import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";


import { Cart } from "../cart.model";
import { PostsService } from "../posts.service";
import { CartService } from "../cart.service";
import { AuthService } from "../../auth/auth.service";
import { LoginComponent } from "../../auth/login/login.component";

import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  
  cartItems: Cart[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private cartItemsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    private dialog: MatDialog,
    public postsService: PostsService,
    public cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.cartService.getCartItems(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.cartItemsSub = this.cartService
      .getCartUpdateListener()
      .subscribe((cartData: { cartItems: Cart[]; cartItemsCount: number }) => {
        this.isLoading = false;
        this.cartItems = cartData.cartItems;
        this.totalPosts = cartData.cartItemsCount;
        console.log(this.cartItems)
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
    this.cartService.getCartItems(this.postsPerPage, this.currentPage);
  }

  // addToCart(post:any){
  //   let userId = localStorage.getItem("userId");
  //   if(userId == null){
  //     console.log("User id is null");
  //     this.dialog.open(LoginComponent, {data: {message: "Login Component"}});
  //   }
  //   else{
  //     let cartItem = {
  //       userId: userId,
  //       postId: post.id,
  //       content: post.content,
  //       creator: post.creator,
  //       imagePath: post.imagePath,
  //       title: post.title,
  //     }
  //     console.log("Add to cart is cartItem", cartItem)
  //     console.log("Add to cart userId",userId)
  //     let result = this.cartService.addCartItems(cartItem)
  //     console.log(result)
  //   }
  // }

  onDelete(cartItemId: string) {
    console.log("Delete CartItem Id",cartItemId)
    this.isLoading = true;
    this.cartService.deleteCartItems(cartItemId).subscribe(() => {
      this.cartService.getCartItems(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.cartItemsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
