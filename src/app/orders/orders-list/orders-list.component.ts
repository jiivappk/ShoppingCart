import { Component, OnInit, OnDestroy } from "@angular/core";
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
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private orderItemsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.orderService.getOrderItems(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.orderItemsSub = this.orderService
      .getOrderUpdateListener()
      .subscribe((orderData: { orderItems: Order[]; orderItemsCount: number }) => {
        this.isLoading = false;
        // this.orderItems = orderData.orderItems;
        orderData.orderItems.map((orderItem)=>{
          this.orderItems.push({
            address: JSON.stringify(orderItem.address) ,
            content: orderItem.content,
            creator: orderItem.creator,
            imagePath: orderItem.imagePath,
            orderId: orderItem.orderId,
            orderStatus: JSON.stringify(orderItem.orderStatus) ,
            postId: orderItem.postId,
            title: orderItem.title,
            userId: orderItem.userId,
          })
        })
        this.totalPosts = orderData.orderItemsCount;
        console.log("Altered Order Items",this.orderItems)
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.orderService.getOrderItems(this.postsPerPage, this.currentPage);
  }

  onDelete(orderItemId: string) {
    console.log("Delete CartItem Id",orderItemId)
    this.isLoading = true;
    this.orderService.deleteOrderItems(orderItemId).subscribe(() => {
      this.orderService.getOrderItems(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.orderItemsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
