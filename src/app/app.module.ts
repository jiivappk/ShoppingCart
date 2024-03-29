import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthInterceptor } from "./auth/auth-interceptor";
import { ErrorInterceptor } from "./error-interceptor";
import { ErrorComponent } from "./error/error.component";
import { AngularMaterialModule } from "./angular-material.module";
import { ProductsModule } from "./products/products.module";
import { OrdersComponent } from "./orders/orders.component";
import { OrderDetailsComponent } from './orders/order-details/order-details.component';
import { OrdersListComponent } from './orders/orders-list/orders-list.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { OtpVerificationDialogComponent } from './otp-verification-dialog/otp-verification-dialog.component';
import { AccountModule } from './account/account.module';
import { AllReviewPageComponent } from './products/all-reviews/all-review-page.component';
import { NgBootstrapModule } from './ngbootstrap.module';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
    OrdersComponent,
    OrderDetailsComponent,
    OrdersListComponent,
    OtpVerificationDialogComponent,
    AllReviewPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AccountModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ProductsModule,
    NgImageSliderModule,
    // NgbModule,
    NgBootstrapModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule {}
