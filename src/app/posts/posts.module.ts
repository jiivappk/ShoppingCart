import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgImageSliderModule } from 'ng-image-slider';

import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";
import { AngularMaterialModule } from "../angular-material.module";
import { PostDetailsComponent } from './post-details/post-details.component';
import { CartComponent } from './cart/cart.component';
import { SearchPostComponent } from './search-post/search-post.component';

@NgModule({
  declarations: [PostCreateComponent, PostListComponent, PostDetailsComponent, CartComponent, SearchPostComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    NgImageSliderModule,
    RouterModule
  ]
})
export class PostsModule {}
