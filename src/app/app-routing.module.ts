import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductListComponent } from "./products/product-list/product-list.component";
import { ProductCreateComponent } from "./products/product-create/product-create.component";
import { SearchProductComponent } from "./products/search-product/search-product.component";
import { AuthGuard } from "./auth/auth.guard";
import { ProductDetailsComponent } from "./products/product-details/product-details.component";
import { CartComponent } from "./products/cart/cart.component";
import { OrdersComponent } from "./orders/orders.component";
import { OrdersListComponent } from "./orders/orders-list/orders-list.component";
import { OrderDetailsComponent } from "./orders/order-details/order-details.component";
import { WishlistComponent } from "./products/wishlist/wishlist.component";

const routes: Routes = [
  { path: "", component: ProductListComponent },
  { path: "search", component: SearchProductComponent },
  { path: "product-detail", component: ProductDetailsComponent },
  { path: "create", component: ProductCreateComponent, canActivate: [AuthGuard] },
  { path: "order", component: OrdersComponent, canActivate: [AuthGuard] },
  { path: "order-list", component: OrdersListComponent, canActivate: [AuthGuard] },
  { path: "order-list/order-detail", component: OrderDetailsComponent, canActivate: [AuthGuard] },
  { path: "cart", component: CartComponent, canActivate: [AuthGuard] },
  { path: "wishlist", component: WishlistComponent, canActivate: [AuthGuard] },
  { path: "edit/:productId", component: ProductCreateComponent, canActivate: [AuthGuard] },
  { path: "auth", loadChildren: ()=>import('./auth/auth.module').then(m=>m.AuthModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
