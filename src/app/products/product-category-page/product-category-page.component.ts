import { Component, OnInit, OnDestroy, Renderer2 } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Router } from '@angular/router';
import { Subscription } from "rxjs";

import { Product } from "../product.model";
import { ProductsService } from "../products.service";
import { AuthService } from "../../auth/auth.service";
import { LoginComponent } from "../../auth/login/login.component";

import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-product-category-page',
  templateUrl: './product-category-page.component.html',
  styleUrls: ['./product-category-page.component.css']
})
export class ProductCategoryPageComponent implements OnInit {

  // products = [
  //   { title: "First Product", content: "This is the first product's content" },
  //   { title: "Second Product", content: "This is the second product's content" },
  //   { title: "Third Product", content: "This is the third product's content" }
  // ];
  products: Product[] = [];
  categoryList = [];
  isLoading = false;
  totalProducts = 0;
  productsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  wishlistAdded = false;
  wishlistArray = [];
  wishlistProductsId = [];
  private categorySub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    public productsService: ProductsService,
    private authService: AuthService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.productsService.getCategory();
    this.categorySub = this.productsService
    .getCategoryUpdateListener()
    .subscribe((category)=>{
      this.categoryList = [...category['categoryList']];
      console.log("Category List",category['categoryList']);
      console.log("this.categoryList",this.categoryList)
    })
    //getting products from backend
    // this.productsService.getProducts(this.productsPerPage, this.currentPage);
    // this.productsSub = this.productsService
    // .getProductUpdateListener()
    // .subscribe((productData: { products: Product[]; productCount: number }) => {
    //   this.isLoading = false;
    //   this.totalProducts = productData.productCount;
    //   this.products = productData.products;
    // });
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy() {
    this.categorySub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
