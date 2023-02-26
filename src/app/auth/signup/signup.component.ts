import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  public confirmPasswordError = false;
  public email = '';
  public isMailSent = false;
  

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if(form.value.confirmPassword !== form.value.password){
      this.confirmPasswordError = true;
      return;
    }
    this.confirmPasswordError = false;
    this.email = form.value.email;
    this.authService.signIn(form.value.email, form.value.confirmPassword);
    this.isMailSent = true;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
