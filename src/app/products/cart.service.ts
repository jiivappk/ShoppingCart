import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Cart } from "./cart.model";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

const BACKEND_URL = environment.apiUrl + "/cart/";

@Injectable({ providedIn: "root" })
export class CartService {

  private cartItems: Cart[] = [];
  public updatedCartItem:Cart;
  public maxCartItems:number;
  private cartUpdated = new Subject<{ cartItems: Cart[]; cartItemsCount: number }>();
  private cartPrice = new Subject();

  constructor(private http: HttpClient, private router: Router) {}

  getCartUpdateListener() {
    return this.cartUpdated.asObservable();
  }

  getCartPriceListener(){
    return this.cartPrice.asObservable();
  }
  addCartItems(cartItem:any){
    this.http.post<{ message: string; cartItem: any; maxCartItems: number }>(BACKEND_URL,cartItem)
    .pipe(
      map(cartData => {
        return {
          cartItem:{
            id: cartData.cartItem._id,
            content: cartData.cartItem.content,
            creator: cartData.cartItem.creator,
            imagePath: cartData.cartItem.imagePath,
            productId: cartData.cartItem.productId,
            title: cartData.cartItem.title,
            userId: cartData.cartItem.userId,
            price: cartData.cartItem.price, 
            actualPrice: cartData.cartItem.actualPrice, 
            noOfStocks: cartData.cartItem.noOfStocks, 
            discountPercentage: cartData.cartItem.discountPercentage,
            deliveryPeriod: cartData.cartItem.deliveryPeriod,
            deliveryCharge: cartData.cartItem.deliveryCharge,
            replacementPeriod: cartData.cartItem.replacementPeriod,
            saveForLater: cartData.cartItem.saveForLater
          },
          maxCartItems: cartData.maxCartItems
        };
      })
    )
    .subscribe(transformedCartData => {
      this.updatedCartItem = transformedCartData.cartItem;
      this.cartUpdated.next({
        cartItems:this.cartItems,
        cartItemsCount: transformedCartData.maxCartItems
      });
      return "Cart Item Added Successfuly";
    });
  }

  // getCartItems(productsPerPage: number, currentPage: number){
  //   const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;
  //   this.http.get<{ message: string; cartItems: any; maxCartItems: number }>(BACKEND_URL + queryParams)  
  //   .pipe(
  //     map(cartData => {
  //       return {
  //         cartItems: cartData.cartItems.map(cartItem => {
  //           return {
  //             title: cartItem.title,
  //             content: cartItem.content,
  //             id: cartItem._id,
  //             imagePath: cartItem.imagePath,
  //             creator: cartItem.creator,
  //             price: cartItem.price, 
  //             actualPrice: cartItem.actualPrice, 
  //             noOfStocks: cartItem.noOfStocks, 
  //             discountPercentage: cartItem.discountPercentage,
  //             deliveryPeriod: cartItem.deliveryPeriod,
  //             deliveryCharge: cartItem.deliveryCharge,
  //             replacementPeriod: cartItem.replacementPeriod,
  //             saveForLater: cartItem.saveForLater
  //           };
  //         }),
  //         maxCartItems: cartData.maxCartItems
  //       };
  //     })
  //   )
  //   .subscribe(transformedCartData => {
  //     this.cartItems = transformedCartData.cartItems;
  //     this.maxCartItems = transformedCartData.maxCartItems;
  //     this.cartUpdated.next({
  //       cartItems:this.cartItems,
  //       cartItemsCount: transformedCartData.maxCartItems
  //     });
  //   });
   
  //   return {
  //     message: "Cart Items fetched sucessfully",
  //     cartItems: this.cartItems ,
  //     maxCartItemsCount: this.maxCartItems
  //   };

  // }

  getCartItems(){
    // const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string; cartItems: any; maxCartItems: number }>(BACKEND_URL)  
    .pipe(
      map(cartData => {
        return {
          cartItems: cartData.cartItems.map(cartItem => {
            return {
              title: cartItem.title,
              content: cartItem.content,
              id: cartItem._id,
              imagePath: cartItem.imagePath,
              creator: cartItem.creator,
              price: cartItem.price, 
              actualPrice: cartItem.actualPrice, 
              noOfStocks: cartItem.noOfStocks, 
              discountPercentage: cartItem.discountPercentage,
              deliveryPeriod: cartItem.deliveryPeriod,
              deliveryCharge: cartItem.deliveryCharge,
              replacementPeriod: cartItem.replacementPeriod,
              saveForLater: cartItem.saveForLater
            };
          }),
          maxCartItems: cartData.maxCartItems
        };
      })
    )
    .subscribe(transformedCartData => {
      this.cartItems = transformedCartData.cartItems;
      this.maxCartItems = transformedCartData.maxCartItems;
      this.cartUpdated.next({
        cartItems:this.cartItems,
        cartItemsCount: transformedCartData.maxCartItems
      });
    });
   
    return {
      message: "Cart Items fetched sucessfully",
      cartItems: this.cartItems ,
      maxCartItemsCount: this.maxCartItems
    };

  }

  updateCartItem(cartItem) {
    return this.http.put(BACKEND_URL + cartItem.id, cartItem)
  }

  deleteCartItems(cartItemId: any) {
    return this.http.delete(BACKEND_URL + cartItemId);
  }

}
