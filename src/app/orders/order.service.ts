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
        console.log("OrderItem from Backend",orderData)
        return {
          orderItem:{
            orderId: orderData.orderItem.orderId,
            content: orderData.orderItem.content,
            creator: orderData.orderItem.creator,
            imagePath: orderData.orderItem.imagePath,
            productId: orderData.orderItem.productId,
            title: orderData.orderItem.title,
            userId: orderData.orderItem.userId,
            address: orderData.orderItem.address,
            orderStatus: orderData.orderItem.orderStatus
          },
          maxOrderItems: orderData.maxOrderItems
        };
      })
    )
    .subscribe(transformedOrderData => {
      this.updatedOrderItem = transformedOrderData.orderItem;
      console.log("Order Items updated",this.updatedOrderItem);
      this.orderUpdated.next({
        orderItems:this.orderItems,
        orderItemsCount: transformedOrderData.maxOrderItems
      });
      return "Order Placed Successfuly";
    });
  }

  getOrderItems(productsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string; orderItems: any; maxOrderItems: number }>(BACKEND_URL + queryParams)  
    .pipe(
      map(orderData => {
        return {
          orderItems: orderData.orderItems.map(orderItem => {
            return {
              orderId:orderItem.orderId,
              address: orderItem.address,
              orderStatus: orderItem.orderStatus,
              content:orderItem.content,
              creator:orderItem.creator,
              imagePath:orderItem.imagePath,
              productId:orderItem.productId,
              title:orderItem.title,
              userId:orderItem.userId,
            };
          }),
          maxOrderItems: orderData.maxOrderItems
        };
      })
    )
    .subscribe(transformedOrderData => {
      this.orderItems = transformedOrderData.orderItems;
      this.maxOrderItems = transformedOrderData.maxOrderItems;
      this.orderUpdated.next({
        orderItems:this.orderItems,
        orderItemsCount: transformedOrderData.maxOrderItems
      });
    });
    return {
      message: "Cart Items fetched sucessfully",
      cartItems: this.orderItems ,
      maxOrderItemsCount: this.maxOrderItems
    };
  }

  deleteOrderItems(orderItemId: string) {
    return this.http.delete(BACKEND_URL + orderItemId);
  }

}
