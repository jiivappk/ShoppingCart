import { Component, OnInit, OnDestroy, AfterContentInit, AfterViewInit, AfterViewChecked, AfterContentChecked, OnChanges, SimpleChanges } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs";

import { Product } from "../product.model";
import { ProductsService } from "../products.service";
import { CartService } from "../cart.service";
import { AuthService } from "../../auth/auth.service";
import { LoginComponent } from "../../auth/login/login.component";

import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.css']
})
export class SearchProductComponent implements OnInit, OnChanges {

  products: Product[] = [];
  isLoading = false;
  totalProducts = 0;
  productsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  searchValue: string;
  private productsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route:ActivatedRoute,
    public productsService: ProductsService,
    public cartService: CartService,
    private authService: AuthService
  ) {}
  ngOnChanges(changes: SimpleChanges) {
    console.log("Changes",changes);
  }
 

  ngOnInit() {
    this.route.queryParams.subscribe((params)=>{
      this.searchValue = params['searchValue']
      console.log("SearchValue from Search-product",params['searchValue']);
      this.isLoading = true;
      this.productsService.searchProduct(this.searchValue, this.productsPerPage, this.currentPage);
      this.userId = this.authService.getUserId();
      this.productsSub = this.productsService
        .getProductUpdateListener()
        .subscribe((productData: { products: Product[]; productCount: number }) => {
          this.isLoading = false;
          this.totalProducts = productData.productCount;
          this.products = productData.products;
          console.log("Product from Search-product",this.products)
          console.log("ProductCount from Search-product",this.totalProducts);
        });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
        });
    })
  }



  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.productsService.searchProduct(this.searchValue,this.productsPerPage, this.currentPage);
  }

  // order(product:any){
  //   this.router.navigate(['order'],{queryParams:{productId:product.id, content:product.content, imagePath:product.imagePath, title:product.title, creator:product.creator}})
  // }

  // addToCart(product:any){
  //   let userId = localStorage.getItem("userId");
  //   if(userId == null){
  //     console.log("User id is null");
  //     this.dialog.open(LoginComponent, {data: {message: "Login Component"}});
  //   }
  //   else{
  //     let cartItem = {
  //       userId: userId,
  //       productId: product.id,
  //       content: product.content,
  //       creator: product.creator,
  //       imagePath: product.imagePath,
  //       title: product.title,
  //     }
  //     console.log("Add to cart is cartItem", cartItem)
  //     console.log("Add to cart userId",userId)
  //     let result = this.cartService.addCartItems(cartItem)
  //     console.log(result)
  //   }
  // }

  // onDelete(productId: string) {
  //   this.isLoading = true;
  //   this.productsService.deleteProduct(productId).subscribe(() => {
  //     this.productsService.getProducts(this.productsPerPage, this.currentPage);
  //   }, () => {
  //     this.isLoading = false;
  //   });
  // }

  getSearchResults(){
    this.productsService.searchProduct(this.searchValue,this.productsPerPage,this.currentPage);
    this.productsSub = this.productsService
      .getProductUpdateListener()
      .subscribe((productData: { products: Product[]; productCount: number }) => {
        this.isLoading = false;
        this.totalProducts = productData.productCount;
        this.products = productData.products;
        console.log(this.products)
      });
  }

  ngOnDestroy() {
    this.productsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
