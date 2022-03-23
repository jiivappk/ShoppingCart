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

  addProduct(title: string, content: string, image: File) {
    const productData = new FormData();
    productData.append("title", title);
    productData.append("content", content);
    productData.append("image", image, title);
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
