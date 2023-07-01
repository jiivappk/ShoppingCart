import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgImageSliderModule } from 'ng-image-slider';

import { ProductCreateComponent } from "./product-create/product-create.component";
import { ProductListComponent } from "./product-list/product-list.component";
import { AngularMaterialModule } from "../angular-material.module";
import { FormsModule } from "@angular/forms";
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { SearchProductComponent } from './search-product/search-product.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { ProductCategoryPageComponent } from './product-category-page/product-category-page.component';
import { ProductReviewComponent }from './product-review/product-review.component';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgBootstrapModule } from '../ngbootstrap.module';
import { LoadImagesDialogComponent } from './load-images-model/load-images-model.component';

@NgModule({
  declarations: [
    ProductCreateComponent, 
    ProductListComponent, 
    ProductDetailsComponent, 
    CartComponent, 
    SearchProductComponent, 
    WishlistComponent, 
    ProductCategoryPageComponent,
    ProductReviewComponent,
    LoadImagesDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    NgImageSliderModule,
    RouterModule,
    FormsModule,
    // NgbModule,
    NgBootstrapModule
  ]
})
export class ProductsModule {}
