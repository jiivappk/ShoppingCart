import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Router } from '@angular/router';

import { AuthService } from "../auth/auth.service";
import { CartService } from "../posts/cart.service";
import { PostsService } from "../posts/posts.service";
import { Cart } from "../posts/cart.model"

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  postsPerPage = 2;
  currentPage = 1;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  private cartItemsSub: Subscription;
  private totalCartItems: number;
  constructor(private authService: AuthService, public cartService: CartService, public postService:PostsService, public router:Router) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
      this.cartService.getCartItems(2,1);
      this.cartItemsSub = this.cartService
      .getCartUpdateListener()
      .subscribe((cartData: { cartItems: Cart[]; cartItemsCount: number }) => {
        this.totalCartItems = cartData.cartItemsCount;
        console.log(this.totalCartItems)
      });
  }

  onLogout() {
    this.authService.logout();
  }

  onSearch(value){
    console.log("OnSEarch is called",value)
    this.router.navigate(["search"],{queryParams:{searchValue:value}})
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.cartItemsSub.unsubscribe();
  }
}
