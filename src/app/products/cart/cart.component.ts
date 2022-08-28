import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";


import { Cart } from "../cart.model";
import { ProductsService } from "../products.service";
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
  saveForLater: Cart[] = [];
  isLoading = false;
  totalProducts = 0;
  productsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  itemCount: number;
  saveItemCount: number;
  amount: number;
  discountAmount: number;
  deliveryAmount: number;
  totalAmount: number;
  savinngsAmount: number;
  private cartItemsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    private dialog: MatDialog,
    public productsService: ProductsService,
    public cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    // this.cartService.getCartItems(this.productsPerPage, this.currentPage);
    this.cartService.getCartItems();
    this.userId = this.authService.getUserId();
    this.cartItemsSub = this.cartService
      .getCartUpdateListener()
      .subscribe((cartData: { cartItems: Cart[]; cartItemsCount: number }) => {
        this.isLoading = false;
        this.amount = 0;
        this.discountAmount = 0;
        this.totalAmount = 0;
        this.deliveryAmount = 0;
        this.savinngsAmount = 0;
        this.itemCount = 0;
        // this.cartItems = cartData.cartItems.filter( cartItem=>cartItem.saveForLater === false);
        this.cartItems = cartData.cartItems.map((cartItem)=>{
          if(cartItem.saveForLater === false){
                this.amount += cartItem.actualPrice;
                this.discountAmount += (cartItem.actualPrice - cartItem.price);
                this.deliveryAmount += cartItem.deliveryCharge;
                this.totalAmount += cartItem.price;
                this.itemCount++;
                this.savinngsAmount = this.amount - this.totalAmount; 
              }
          return cartItem;
        });
        this.totalProducts = cartData.cartItemsCount;
        this.saveItemCount = this.totalProducts - this.itemCount;
      })
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
      this.calculateCartPrice();
  }

  calculateCartPrice(){
    this.amount = 0;
    this.discountAmount = 0;
    this.totalAmount = 0;
    this.deliveryAmount = 0;
    this.savinngsAmount = 0;
    this.itemCount = 0;

    this.cartItems.map((item)=>{
      if(!item.saveForLater){
        this.amount += item.actualPrice;
        this.discountAmount += (item.actualPrice - item.price);
        this.deliveryAmount += item.deliveryCharge;
        this.totalAmount += item.price;
        this.itemCount++;
      }
    })
    this.savinngsAmount = this.amount - this.totalAmount; 
  }

  // onChangedPage(pageData: PageEvent) {
  //   this.isLoading = true;
  //   this.currentPage = pageData.pageIndex + 1;
  //   this.productsPerPage = pageData.pageSize;
  //   this.cartService.getCartItems(this.productsPerPage, this.currentPage);
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

  saveLaterUpdate(index, updateOption){
    // this.saveForLater.push(cartItem);
    // console.log("Index of cartItem",index)

    if(updateOption === 'saveLater'){
      this.cartItems[index].saveForLater = true;
      this.calculateCartPrice();
      this.cartService.updateCartItem(this.cartItems[index]).subscribe((updatedCartItem)=>{
        this.saveItemCount++;
      })
    }
    else if(updateOption === 'removeSaveLater'){
      this.cartItems[index].saveForLater = false;
      this.calculateCartPrice();
      this.cartService.updateCartItem(this.cartItems[index]).subscribe((updatedCartItem)=>{
        this.saveItemCount--;
      })
    }
    

  }

  onDelete(cartItemId: string) {
    this.isLoading = true;
    this.cartService.deleteCartItems(cartItemId).subscribe(() => {
      // this.cartService.getCartItems(this.productsPerPage, this.currentPage);
      this.cartService.getCartItems();
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.cartItemsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
