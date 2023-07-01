import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from '@angular/router';
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";


import { Order } from "../order.model";
import { OrderService } from "../order.service";
import { AuthService } from "../../auth/auth.service";


@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit {

  orderItems: Order[] = [];
  isLoading = false;
  totalProducts = 0;
  productsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  imageObjectArray = []
  private orderItemsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public orderService: OrderService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.orderService.getOrderItems(this.productsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.orderItemsSub = this.orderService
      .getOrderUpdateListener()
      .subscribe((orderData: { orderItems: Order[]; orderItemsCount: number }) => {
        this.isLoading = false;
        orderData.orderItems.map((orderItem, index)=>{
          this.orderItems.push({
            price: orderItem.price,
            actualPrice: orderItem.actualPrice,
            noOfStocks: orderItem.noOfStocks,
            discountPercentage: orderItem.discountPercentage,
            deliveryAddress: orderItem.deliveryAddress,
            additionalImages: orderItem.additionalImages,
            content: orderItem.content,
            creator: orderItem.creator,
            imagePath: orderItem.imagePath,
            orderId: orderItem.orderId,
            orderInfo: orderItem.orderInfo,
            orderStatus: orderItem.orderStatus,
            refundStatus: orderItem.refundStatus,
            productId: orderItem.productId,
            title: orderItem.title,
            userId: orderItem.userId,
          })
        })
        this.totalProducts = orderData.orderItemsCount;
        
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      }); 
  }

  orderClicked(orderItem){
    orderItem['deliveryAddress'] = JSON.stringify(orderItem.deliveryAddress);
    orderItem['orderInfo'] = orderItem.orderInfo.map(object=>JSON.stringify(object));
    this.router.navigate(['order-list/order-detail'],{queryParams:{orderId:orderItem.orderId, content:orderItem.content, creator:orderItem.creator, imagePath:orderItem.imagePath, title:orderItem.title, deliveryAddress:orderItem.deliveryAddress, price:orderItem.price, actualPrice: orderItem.actualPrice, noOfStocks: orderItem.noOfStocks, discountPercentage: orderItem.discountPercentage, additionalImages:orderItem.additionalImages, orderInfo:orderItem.orderInfo, orderStatus:orderItem.orderStatus, productId:orderItem.productId, userId:orderItem.userId, refundStatus:orderItem.refundStatus} })
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.orderService.getOrderItems(this.productsPerPage, this.currentPage);
  }

  onDelete(orderItemId: string) {
    this.isLoading = true;
    this.orderService.deleteOrderItems(orderItemId).subscribe(() => {
      this.orderService.getOrderItems(this.productsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  redirectToReviewPage(){
    this.router.navigate(['product-review'],{ queryParams: {productId: this.orderItems[0].productId, title: this.orderItems[0].title} } );
  }

  ngOnDestroy() {
    this.orderItemsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
