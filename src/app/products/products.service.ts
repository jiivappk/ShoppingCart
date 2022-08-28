import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Product } from "./product.model";

const BACKEND_URL = environment.apiUrl + "/products/";

@Injectable({ providedIn: "root" })
export class ProductsService {
  private products: Product[] = [];
  private productsUpdated = new Subject<{ products: Product[]; productCount: number, error: string }>();
  private categoryList = [];
  private categoryUpdated = new Subject();
  constructor(private http: HttpClient, private router: Router) {}

  getProducts(productsPerPage?: number, currentPage?: number, categoryName?: string) {
    let queryParams = ''
    if(categoryName){
      queryParams = `?categoryName=${categoryName}`;
    }
    else{
      queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;
    }
    this.http
      .get<{ message: string; products: any; maxProducts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(productData => {
          return {
            products: productData.products.map(product => {
              return {
                title: product.title,
                content: product.content,
                category: product.category,
                id: product._id,
                imagePath: product.imagePath,
                additionalImages: product.additionalImages,
                creator: product.creator,
                price: product.price,
                actualPrice: product.actualPrice,
                noOfStocks: product.noOfStocks,
                discountPercentage: product.discountPercentage,
                deliveryPeriod: product.deliveryPeriod,
                deliveryCharge: product.deliveryCharge,
                replacementPeriod: product.replacementPeriod
              };
            }),
            maxProducts: productData.maxProducts
          };
        })
      )
      .subscribe(transformedProductData => {
        this.products = transformedProductData.products;
        this.productsUpdated.next({
          products: [...this.products],
          productCount: transformedProductData.maxProducts,
          error: ''
        });
      });
  }

  getProductUpdateListener() {
    return this.productsUpdated.asObservable();
  }

  getProduct(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  getCategory(){
    this.http
      .get<{}>(
        BACKEND_URL + 'category'
      )
      .subscribe((category)=>{
        this.categoryList = [...category['categoryList']]
        this.categoryUpdated.next({categoryList:this.categoryList})
      })
  }

  getCategoryUpdateListener(){
    return this.categoryUpdated.asObservable();
  }

  searchProduct(title: string,productsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}&title=${title}`;
    // return this.http.get<{
    //   _id: string;
    //   title: string;
    //   content: string;
    //   imagePath: string;
    //   creator: string;
    // }>(BACKEND_URL + queryParams);

    this.http
      .get<{ message: string; products: any; maxProducts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(productData => {
          return {
            products: productData.products.map(product => {
              return {
                title: product.title,
                content: product.content,
                id: product._id,
                imagePath: product.imagePath,
                creator: product.creator
              };
            }),
            maxProducts: productData.maxProducts
          };
        })
      )
      .subscribe(
        (transformedProductData) => {
        this.products = transformedProductData.products;
        this.productsUpdated.next({
          products: [...this.products],
          productCount: transformedProductData.maxProducts,
          error: ''
        });
        },
        (err)=>{
          console.log("Error occured while fetching products",err);
          if(err.error.message === 'Fetching products failed!'){
            this.productsUpdated.next({
              products: [],
              productCount: 0,
              error: 'No Data Found!!'
            });
          }
        }
      );
  }

  addProduct(title: string, content: string, category: string, image: File, additionalImages: FileList, price:number, actualPrice:number, noOfStocks:number, discountPercentage:number, deliveryCharge:number, deliveryPeriod:number, replacementPeriod:number) {
    const productData: any = new FormData();
    productData.append("title", title);
    productData.append("content", content);
    productData.append("category", category);
    productData.append("image", image, title);
    productData.append("price",price);
    productData.append("actualPrice",actualPrice);
    productData.append("noOfStocks",noOfStocks);
    productData.append("discountPercentage",discountPercentage);
    productData.append("deliveryPeriod",deliveryPeriod);
    productData.append("deliveryCharge",deliveryCharge);
    productData.append("replacementPeriod",replacementPeriod);
    for(let i = 0;i<additionalImages.length;i++){
      productData.append("additionalImages", additionalImages[i], title);   
    }
    this.http
      .post<{ message: string; product: Product }>(
        BACKEND_URL,
        productData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updateProduct(id: string, title: string, content: string, image: File | string) {
    let productData: Product | FormData;
    if (typeof image === "object") {
      productData = new FormData();
      productData.append("id", id);
      productData.append("title", title);
      productData.append("content", content);
      productData.append("image", image, title);
    } else {
      productData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put(BACKEND_URL + id, productData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deleteProduct(productId: string) {
    return this.http.delete(BACKEND_URL + productId);
  }

}
