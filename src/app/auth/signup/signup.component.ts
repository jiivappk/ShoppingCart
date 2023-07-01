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
  public firstName = '';
  public lastName = '';
  public gender = '';
  public dob = '';
  public phoneNumber = '';
  public email = '';
  public password = '';
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
    this.firstName = form.value.firstName;
    this.lastName = form.value.lastName;
    this.gender = form.value.gender;
    this.dob = form.value.dob;
    this.phoneNumber = form.value.phoneNumber;
    this.email = form.value.email;
    this.password = form.value.password;
    this.authService.signIn(this.firstName, this.lastName, this.gender, this.dob, this.phoneNumber, this.email, this.password );
    this.isMailSent = true;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
