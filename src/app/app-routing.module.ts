import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { SearchPostComponent } from "./posts/search-post/search-post.component";
import { AuthGuard } from "./auth/auth.guard";
import { PostDetailsComponent } from "./posts/post-details/post-details.component";
import { CartComponent } from "./posts/cart/cart.component";
import { OrdersComponent } from "./orders/orders.component";
import { OrdersListComponent } from "./orders/orders-list/orders-list.component";
import { OrderDetailsComponent } from "./orders/order-details/order-details.component";

const routes: Routes = [
  { path: "", component: PostListComponent },
  { path: "search", component: SearchPostComponent },
  { path: "post-detail", component: PostDetailsComponent },
  { path: "create", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "order", component: OrdersComponent, canActivate: [AuthGuard] },
  { path: "order-list", component: OrdersListComponent, canActivate: [AuthGuard] },
  { path: "order-list/order-detail", component: OrderDetailsComponent, canActivate: [AuthGuard] },
  { path: "cart", component: CartComponent, canActivate: [AuthGuard] },
  { path: "edit/:postId", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "auth", loadChildren: ()=>import('./auth/auth.module').then(m=>m.AuthModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
