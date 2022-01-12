import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Order } from "./order.model";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

const BACKEND_URL = environment.apiUrl + "/orders/";

@Injectable({ providedIn: "root" })
export class OrderService {
  private orderItems: Order[] = [];
  public updatedOrderItem:Order;
  public maxOrderItems:number;
  private orderUpdated = new Subject<{ orderItems: Order[]; orderItemsCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getOrderUpdateListener() {
    return this.orderUpdated.asObservable();
  }
  addOrderItems(orderItem:any){
    console.log("OrderItems service is called", orderItem);
    this.http.post<{ message: string; orderItem: any; maxOrderItems: number }>(BACKEND_URL,orderItem)
    .pipe(
      map(orderData => {
        console.log("CartItem from Backend",orderData)
        return {
          cartItem:{
            id: orderData.orderItem._id,
            content: orderData.orderItem.content,
            creator: orderData.orderItem.creator,
            imagePath: orderData.orderItem.imagePath,
            postId: orderData.orderItem.postId,
            title: orderData.orderItem.title,
            userId: orderData.orderItem.userId,
            orderStatus: orderData.orderItem.orderStatusItem
          },
          maxOrderItems: orderData.maxOrderItems
        };
      })
    )
    .subscribe(transformedOrderData => {
      this.updatedOrderItem = transformedOrderData.cartItem;
      console.log("Cart Items updated",this.updatedOrderItem);
      this.orderUpdated.next({
        orderItems:this.orderItems,
        orderItemsCount: transformedOrderData.maxOrderItems
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
    .subscribe(transformedOrderData => {
      this.orderItems = transformedOrderData.cartItems;
      this.maxOrderItems = transformedOrderData.maxCartItems;
      this.orderUpdated.next({
        orderItems:this.orderItems,
        orderItemsCount: transformedOrderData.maxCartItems
      });
    });
    return {
      message: "Cart Items fetched sucessfully",
      cartItems: this.orderItems ,
      maxOrderItemsCount: this.maxOrderItems
    };
  }

  deleteCartItems(orderItemId: string) {
    return this.http.delete(BACKEND_URL + orderItemId);
  }

}
