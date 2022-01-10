import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";

import { AuthService } from "../auth.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(public authService: AuthService) { }
  isLoading = false;

  ngOnInit(): void {
  }

  onforgotPassword(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form.value)
    this.isLoading = true;
    this.authService.forgotPassword(form.value.email)
      .subscribe((response)=>{
          console.log("Email has been sent",response)
      })
  }

}
