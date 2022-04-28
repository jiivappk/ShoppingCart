import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";


import { Wishlist } from "../wishlist.model";
import { ProductsService } from "../products.service";
import { WishlistService } from "../wishlist.service";
import { AuthService } from "../../auth/auth.service";
import { LoginComponent } from "../../auth/login/login.component";

import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  
  wishlistItems: Wishlist[] = [];
  isLoading = false;
  totalProducts = 0;
  productsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private wishlistItemsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    private dialog: MatDialog,
    public productsService: ProductsService,
    public wishlistService: WishlistService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.wishlistService.getWishlistItems(this.productsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.wishlistItemsSub = this.wishlistService
      .getWishlistUpdateListener()
      .subscribe((wishlistData: { wishlistItems: Wishlist[]; wishlistItemsCount: number }) => {
        this.isLoading = false;
        this.wishlistItems = wishlistData.wishlistItems;
        this.totalProducts = wishlistData.wishlistItemsCount;
        console.log(this.wishlistItems)
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
    this.productsPerPage = pageData.pageSize;
    this.wishlistService.getWishlistItems(this.productsPerPage, this.currentPage);
  }


  onDelete(wishlistItemId: string) {
    console.log("Delete WishlistItem Id",wishlistItemId)
    this.isLoading = true;
    this.wishlistService.deleteWishlistItems(wishlistItemId).subscribe(() => {
      this.wishlistService.getWishlistItems(this.productsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.wishlistItemsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
