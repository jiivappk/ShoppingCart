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
  private productsUpdated = new Subject<{ products: Product[]; productCount: number }>();
  
  constructor(private http: HttpClient, private router: Router) {}

  getProducts(productsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; products: any; maxProducts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(productData => {
          console.log("Product Data from Backend",productData);
          return {
            products: productData.products.map(product => {
              return {
                title: product.title,
                content: product.content,
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
          productCount: transformedProductData.maxProducts
        });
        console.log("Products",this.products)
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

  searchProduct(title: string,productsPerPage: number, currentPage: number) {
    console.log("Search Product Api is called", title, productsPerPage, currentPage)
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
          console.log("Product Data from Backend",productData);
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
      .subscribe(transformedProductData => {
        this.products = transformedProductData.products;
        this.productsUpdated.next({
          products: [...this.products],
          productCount: transformedProductData.maxProducts
        });
      });
  }

  addProduct(title: string, content: string, image: File, additionalImages: FileList, price:number, actualPrice:number, noOfStocks:number, discountPercentage:number, deliveryCharge:number, deliveryPeriod:number, replacementPeriod:number) {
    console.log("From addProduct Service");
    console.log("title",title);
    console.log("content",content);
    console.log("image",image);
    console.log("additionalImages",additionalImages);
    console.log("Price",price);
    console.log("actualPrice",actualPrice);
    console.log("noOfStockes", noOfStocks);
    console.log("DiscountPercentage", discountPercentage);
    console.log("DeliveryPeriod", deliveryPeriod);
    console.log("DeliveryCharge", deliveryCharge);
    console.log("ReplacementPeriod", replacementPeriod);
    const productData: any = new FormData();
    productData.append("title", title);
    productData.append("content", content);
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
