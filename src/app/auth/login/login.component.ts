import { Component, OnInit, OnDestroy, Optional } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { MatDialogRef } from "@angular/material/dialog";

import { AuthService } from "../auth.service";

import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { Router } from '@angular/router';

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  socialUser: SocialUser;
  loggedIn: boolean;
  fbImage: string = '../../assets/facebook.jpg';
  authStatus: boolean;
  mailId = {email: ''};
  constructor(
    private router: Router,
    public authService: AuthService, 
    private socialAuthService: SocialAuthService, 
    @Optional() public dialogRef: MatDialogRef<LoginComponent>,  
    ) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.authStatus = !authStatus
        this.isLoading = false;
        console.log("authStatus",this.authStatus);
      }
    );
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.loggedIn = (user != null);
      console.log("socialUser",this.socialUser);
      if(this.socialUser.provider == "GOOGLE"){
        this.authService.googleLogin(this.socialUser.idToken);
      }
      else if(this.socialUser.provider == "FACEBOOK"){
        this.authService.facebookLogin(this.socialUser.authToken, this.socialUser.id);
      }

    });
  }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.loggedIn = (user != null);
      console.log("socialUser",this.socialUser);
      if(this.socialUser.provider == "GOOGLE"){
        this.authService.googleLogin(this.socialUser.idToken);
      }
      else if(this.socialUser.provider == "FACEBOOK"){
        this.authService.facebookLogin(this.socialUser.authToken, this.socialUser.id);
      }

    });
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    const result = this.authService.login(form.value.email, form.value.password);
    // this.dialogRef.close();
  }

  onforgotPassword(email) {
    if (!email) {
      return;
    }
    console.log("Forgot Password",email)
    this.isLoading = true;
    // this.authService.forgotPassword(email)
    //   .subscribe((response)=>{
    //       console.log("Email has been sent",response)
    //       this.mailId.email = email;
    //   })
    this.router.navigate([`/auth/forgetPassword/${email}`]);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
