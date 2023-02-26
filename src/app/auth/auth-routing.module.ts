import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { CreateUserComponent } from "./create-user/create-user.component";
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { OtpVerificationDialogComponent } from "../otp-verification-dialog/otp-verification-dialog.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "createUser/:token", component: CreateUserComponent},
  { path: "forgetPassword/:mailId", component: ForgetPasswordComponent },
  { path: "account-recovery/:mailId", component: OtpVerificationDialogComponent },
  { path: "resetPassword/:otp", component: ResetPasswordComponent},
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
