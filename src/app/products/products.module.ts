import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgImageSliderModule } from 'ng-image-slider';

import { ProductCreateComponent } from "./product-create/product-create.component";
import { ProductListComponent } from "./product-list/product-list.component";
import { AngularMaterialModule } from "../angular-material.module";
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { SearchProductComponent } from './search-product/search-product.component';
import { WishlistComponent } from './wishlist/wishlist.component';

@NgModule({
  declarations: [ProductCreateComponent, ProductListComponent, ProductDetailsComponent, CartComponent, SearchProductComponent, WishlistComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    NgImageSliderModule,
    RouterModule
  ]
})
export class ProductsModule {}
