import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  isLoading = false;
  constructor(public authService: AuthService, public route: ActivatedRoute) { }
  token:string = '';
  ngOnInit(): void {
    console.log("CreateUser Route is being called");
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("token")) {
         console.log("ResetPassword Route token is", paramMap.has("token"));
         this.token= paramMap.get("token");
        //  this.authService.createUser(token);
      } else {
        console.log("Token is missing");
      }
    });

  }

  onResetPassword(form:any){
    let password = form.value.password;
    let confirmPassword = form.value.confirmPassword;
    console.log(password,confirmPassword);
    if(form.value.password === form.value.confirmPassword){
      this.authService.resetPassword(this.token, password);
    }
  }
}
