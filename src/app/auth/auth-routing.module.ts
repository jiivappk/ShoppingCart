import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { CreateUserComponent } from "./create-user/create-user.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "createUser/:token", component: CreateUserComponent},
  { path: "forgotPassword", component: ForgotPasswordComponent },
  { path: "resetPassword/:token", component: ResetPasswordComponent},
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
