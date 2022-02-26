import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { filter } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

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
  searchItem: string;
  constructor( private authService: AuthService, 
               public cartService: CartService,
               public postService:PostsService,
               public router:Router,
               private route:ActivatedRoute,
               ) {}

  ngOnInit() {
    this.router.events
    .pipe( filter(event => event instanceof NavigationEnd) )    
    .subscribe(event=> 
     {          
        console.log("Event from header",event["url"]);
        if(event["url"] == '/'){
          this.searchItem = "";
        }
     });
    
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

  onSearch(){
    console.log("OnSEarch is called",this.searchItem)
    this.router.navigate(["search"],{queryParams:{searchValue:this.searchItem}})
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.cartItemsSub.unsubscribe();
  }
}
