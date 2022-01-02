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

  constructor(private http: HttpClient, private router: Router) {}

  getCartUpdateListener() {
    return this.cartUpdated.asObservable();
  }
  addCartItems(cartItem:any){
    console.log("CartItem service is called", cartItem);
    this.http.post<{ message: string; cartItem: any; maxCartItems: number }>(BACKEND_URL,cartItem)
    .pipe(
      map(cartData => {
        console.log("CartItem from Backend",cartData)
        return {
          cartItem:{
            id: cartData.cartItem._id,
            content: cartData.cartItem.content,
            creator: cartData.cartItem.creator,
            imagePath: cartData.cartItem.imagePath,
            postId: cartData.cartItem.postId,
            title: cartData.cartItem.title,
            userId: cartData.cartItem.userId,
          },
          maxCartItems: cartData.maxCartItems
        };
      })
    )
    .subscribe(transformedCartData => {
      this.updatedCartItem = transformedCartData.cartItem;
      console.log("Cart Items updated",this.updatedCartItem);
      this.cartUpdated.next({
        cartItems:this.cartItems,
        cartItemsCount: transformedCartData.maxCartItems
      });
      return "Cart Item Added Successfuly";
    });
  }

  getCartItems(postsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string; cartItems: any; maxCartItems: number }>(BACKEND_URL + queryParams)  
    .pipe(
      map(cartData => {
        return {
          cartItems: cartData.cartItems.map(cartItem => {
            return {
              title: cartItem.title,
              content: cartItem.content,
              id: cartItem._id,
              imagePath: cartItem.imagePath,
              creator: cartItem.creator
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

  deleteCartItems(cartItemId: string) {
    return this.http.delete(BACKEND_URL + cartItemId);
  }

}
