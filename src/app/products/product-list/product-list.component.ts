import { Component, OnInit, OnDestroy, Renderer2 } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Router } from '@angular/router';
import { Subscription } from "rxjs";

import { Product } from "../product.model";
import { ProductsService } from "../products.service";
import { CartService } from "../cart.service";
import { WishlistService  } from "../wishlist.service";
import { AuthService } from "../../auth/auth.service";
import { LoginComponent } from "../../auth/login/login.component";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"]
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
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
  private productsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public productsService: ProductsService,
    public cartService: CartService,
    public wishlistService: WishlistService,
    private authService: AuthService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.isLoading = true;

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("category-name")) {
         console.log("CreateUser Route token is", paramMap.has("category-name"));
         const categoryName = paramMap.get("category-name");
         //getting products based on category from backend
         this.productsService.getProducts(null,null,categoryName)
      } else {
        console.log("Token is missing");
        //getting products from backend
        this.productsService.getProducts(this.productsPerPage, this.currentPage,null);
        this.userId = this.authService.getUserId();
      }
    });
    
    //updating the product list
    this.productsSub = this.productsService
      .getProductUpdateListener()
      .subscribe((productData: { products: Product[]; productCount: number }) => {
        this.isLoading = false;
        this.totalProducts = productData.productCount;
        this.products = productData.products;
      });
    //getting wishlist product ids
    this.wishlistService.getWishlistProductsId().subscribe((documents)=>{
      this.wishlistProductsId = documents['wishlistProductsId'];
    })

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
    this.productsService.getProducts(this.productsPerPage, this.currentPage);
  }

  order(product:any){
    this.router.navigate(['order'],{queryParams:{productId:product.id, additionalImages:product.additionalImages, content:product.content, imagePath:product.imagePath, title:product.title, creator:product.creator, price:product.price, actualPrice:product.actualPrice, noOfStocks:product.noOfStocks, discountPercentage:product.discountPercentage }});
  }

  addToCart(product:any){
    let userId = localStorage.getItem("userId");
    if(userId == null){
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
        price: product.price, 
        actualPrice: product.actualPrice, 
        noOfStocks: product.noOfStocks, 
        discountPercentage: product.discountPercentage,
        deliveryPeriod: product.deliveryPeriod,
        deliveryCharge: product.deliveryCharge,
        replacementPeriod: product.replacementPeriod,
        saveForLater: false

      }
      let result = this.cartService.addCartItems(cartItem)
    }
  }

  addToWishlist(product, fas, far){
    this.wishlistAdded = true;
    let userId = localStorage.getItem("userId");
    if(userId == null){
      this.dialog.open(LoginComponent, {data: {message: "Login Component"}});
    }
    else{
      let wishlistItem = {
        userId: userId,
        productId: product.id,
        content: product.content,
        creator: product.creator,
        imagePath: product.imagePath,
        title: product.title,
        price: product.price,
        actualPrice: product.actualPrice,
        noOfStocks: product.noOfStocks,
        discountPercentage: product.discountPercentage
      }
      let result = this.wishlistService.addWishlistItems(wishlistItem)
    }
  }

  removeFromWishlist(productId, fas, far){
    this.wishlistAdded = false;
    let userId = localStorage.getItem("userId");
    if(userId == null){
      this.dialog.open(LoginComponent, {data: {message: "Login Component"}});
    }
    else{
      let wishlistItem = {
        userId: userId,
        productId: productId,
      }
      // console.log("Add to cart is cartItem", wishlistItem)
      // console.log("Add to cart userId",userId)
      this.wishlistService.deleteWishlistItems(productId).subscribe((result)=>{
        console.log("Delete Result from backend is",result)
      })

    }
  }

  clicked(event,product){
    // this.renderer.addClass(event.target, "far")
    if(event.target.className  === 'far fa-heart'){

    //add to wishlist call
    this.wishlistAdded = true;
    let userId = localStorage.getItem("userId");
    if(userId == null){
      this.dialog.open(LoginComponent, {data: {message: "Login Component"}});
    }
    else{
      let wishlistItem = {
        userId: userId,
        productId: product.id,
        content: product.content,
        creator: product.creator,
        imagePath: product.imagePath,
        title: product.title,
        price: product.price,
        actualPrice: product.actualPrice,
        noOfStocks: product.noOfStocks,
        discountPercentage: product.discountPercentage
      }
      let result = this.wishlistService.addWishlistItems(wishlistItem)
    }
    // add to wishlist ends
      this.renderer.removeClass(event.target, 'far');
      this.renderer.removeClass(event.target, 'fa-heart')
      this.renderer.addClass(event.target, "fas");
      this.renderer.addClass(event.target, "fa-heart")
    }
    else if(event.target.className === 'fas fa-heart'){

      //remove from wishlist called
      this.wishlistAdded = false;
      let userId = localStorage.getItem("userId");
      if(userId == null){
        this.dialog.open(LoginComponent, {data: {message: "Login Component"}});
      }
      else{
        let wishlistItem = {
          userId: userId,
          productId: product.id,
        }
        // console.log("Add to cart is cartItem", wishlistItem)
        // console.log("Add to cart userId",userId)
        this.wishlistService.deleteWishlistItems(product.id).subscribe((result)=>{
          console.log("Delete Result from backend is",result)
        })

      }
      //remove from wishlist ends
      this.renderer.removeClass(event.target, 'fas');
      this.renderer.removeClass(event.target, 'fa-heart')
      this.renderer.addClass(event.target, "far");
      this.renderer.addClass(event.target, "fa-heart")
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
