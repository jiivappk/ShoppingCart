import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Wishlist } from "./wishlist.model";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

const BACKEND_URL = environment.apiUrl + "/wishlist/";

@Injectable({ providedIn: "root" })
export class WishlistService {

  private wishlistItems: Wishlist[] = [];
  private wishlistProductsId = [];
  public updatedWishlistItem:Wishlist;
  public maxWishlistItems:number;
  private wishlistUpdated = new Subject<{ wishlistItems: Wishlist[]; wishlistItemsCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getWishlistUpdateListener() {
    return this.wishlistUpdated.asObservable();
  }
  addWishlistItems(wishlistItem:any){
    this.http.post<{ message: string; wishlistItem: any; maxWishlistItems: number }>(BACKEND_URL,wishlistItem)
    .pipe(
      map(wishlistData => {
        return {
          wishlistItem:{
            id: wishlistData.wishlistItem._id,
            content: wishlistData.wishlistItem.content,
            creator: wishlistData.wishlistItem.creator,
            imagePath: wishlistData.wishlistItem.imagePath,
            productId: wishlistData.wishlistItem.productId,
            title: wishlistData.wishlistItem.title,
            userId: wishlistData.wishlistItem.userId,
            price: wishlistData.wishlistItem.price,
            actualPrice: wishlistData.wishlistItem.actualPrice,
            noOfStocks: wishlistData.wishlistItem.noOfStocks,
            discountPercentage: wishlistData.wishlistItem.discountPercentage
          },
          maxWishlistItems: wishlistData.maxWishlistItems
        };
      })
    )
    .subscribe(transformedWishlistData => {
      this.updatedWishlistItem = transformedWishlistData.wishlistItem;
      this.wishlistUpdated.next({
        wishlistItems:this.wishlistItems,
        wishlistItemsCount: transformedWishlistData.maxWishlistItems
      });
      return "Wishlist Item Added Successfuly";
    });
  }

  getWishlistItems(productsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string; wishlistItems: any; maxWishlistItems: number }>(BACKEND_URL + queryParams)  
    .pipe(
      map(wishlistData => {
        return {
          wishlistItems: wishlistData.wishlistItems.map(wishlistItem => {
            return {
              title: wishlistItem.title,
              content: wishlistItem.content,
              id: wishlistItem._id,
              imagePath: wishlistItem.imagePath,
              creator: wishlistItem.creator,
              price: wishlistItem.price,
              actualPrice: wishlistItem.actualPrice,
              noOfStocks: wishlistItem.noOfStocks,
              discountPercentage: wishlistItem.noOfStocks
            };
          }),
          maxWishlistItems: wishlistData.maxWishlistItems
        };
      })
    )
    .subscribe(transformedWishlistData => {
      this.wishlistItems = transformedWishlistData.wishlistItems;
      this.maxWishlistItems = transformedWishlistData.maxWishlistItems;
      this.wishlistUpdated.next({
        wishlistItems:this.wishlistItems,
        wishlistItemsCount: transformedWishlistData.maxWishlistItems
      });
    });
    return {
      message: "Wishlist Items fetched sucessfully",
      wishlistItems: this.wishlistItems ,
      maxWishlistItemsCount: this.maxWishlistItems
    };
  }

  getWishlistProductsId(){
   return this.http.get<{ message: string; wishlistItems: any; maxWishlistItems: number }>(BACKEND_URL +'getProductsId')  
    // .pipe(
    //   map(wishlistData => {
    //     return {
    //       wishlistItems: wishlistData.wishlistItems.map(wishlistItem => {
    //         return {
    //           title: wishlistItem.title,
    //           content: wishlistItem.content,
    //           id: wishlistItem._id,
    //           imagePath: wishlistItem.imagePath,
    //           creator: wishlistItem.creator,
    //           price: wishlistItem.price,
    //           actualPrice: wishlistItem.actualPrice,
    //           noOfStocks: wishlistItem.noOfStocks,
    //           discountPercentage: wishlistItem.noOfStocks
    //         };
    //       }),
    //       maxWishlistItems: wishlistData.maxWishlistItems
    //     };
    //   })
    // )
    // .subscribe( wishlistData=> {
    //   this.wishlistProductsId = wishlistData.wishlistProductsId;
    //   this.maxWishlistItems = wishlistData.maxWishlistProductsId;
    //   this.wishlistUpdated.next({
    //     wishlistProductsId:this.wishlistProductsId,
    //     wishlistProductsIdCount: wishlistData.maxWishlistItems
    //   });
    // });
    // return {
    //   message: "Wishlist Items fetched sucessfully",
    //   wishlistItems: this.wishlistItems ,
    //   maxWishlistItemsCount: this.maxWishlistItems
    // };
  }


  deleteWishlistItems(wishlistId: string) {
    return this.http.delete(BACKEND_URL + wishlistId);
  }

}
