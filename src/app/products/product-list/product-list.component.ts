import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Router } from '@angular/router';
import { Subscription } from "rxjs";

import { Product } from "../product.model";
import { ProductsService } from "../products.service";
import { CartService } from "../cart.service";
import { AuthService } from "../../auth/auth.service";
import { LoginComponent } from "../../auth/login/login.component";

import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"]
})
export class ProductListComponent implements OnInit, OnDestroy {
  // products = [
  //   { title: "First Product", content: "This is the first product's content" },
  //   { title: "Second Product", content: "This is the second product's content" },
  //   { title: "Third Product", content: "This is the third product's content" }
  // ];
  products: Product[] = [];
  isLoading = false;
  totalProducts = 0;
  productsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private productsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    public productsService: ProductsService,
    public cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.productsService.getProducts(this.productsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.productsSub = this.productsService
      .getProductUpdateListener()
      .subscribe((productData: { products: Product[]; productCount: number }) => {
        this.isLoading = false;
        this.totalProducts = productData.productCount;
        this.products = productData.products;
        console.log(this.products)
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    console.log("Product List Component is called", this.products);
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.productsService.getProducts(this.productsPerPage, this.currentPage);
  }

  order(product:any){
    this.router.navigate(['order'],{queryParams:{productId:product.id, content:product.content, imagePath:product.imagePath, title:product.title, creator:product.creator}})
  }

  addToCart(product:any){
    let userId = localStorage.getItem("userId");
    if(userId == null){
      console.log("User id is null");
      this.dialog.open(LoginComponent, {data: {message: "Login Component"}});
    }
    else{
      let cartItem = {
        userId: userId,
        productId: product.id,
        content: product.content,
        creator: product.creator,
        imagePath: product.imagePath,
        title: product.title,
      }
      console.log("Add to cart is cartItem", cartItem)
      console.log("Add to cart userId",userId)
      let result = this.cartService.addCartItems(cartItem)
      console.log(result)
    }
  }

  onDelete(productId: string) {
    this.isLoading = true;
    this.productsService.deleteProduct(productId).subscribe(() => {
      this.productsService.getProducts(this.productsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.productsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
