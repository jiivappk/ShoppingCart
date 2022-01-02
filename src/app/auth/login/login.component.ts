import { Component, OnInit, OnDestroy, Optional } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { MatDialogRef } from "@angular/material/dialog";

import { AuthService } from "../auth.service";

import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";


@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  socialUser: SocialUser;
  loggedIn: boolean;

  constructor(public authService: AuthService, private socialAuthService: SocialAuthService, @Optional() public dialogRef: MatDialogRef<LoginComponent>) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );

    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.loggedIn = (user != null);
      console.log("socialUser",this.socialUser);
    });
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
