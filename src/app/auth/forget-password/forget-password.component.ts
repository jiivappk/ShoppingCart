import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { AuthService } from "../auth.service";

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router, private route: ActivatedRoute) { }
  isLoading = false;
  emailId = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("mailId")) {
         this.emailId = paramMap.get("mailId");
      } else {
        console.log("MailId is missing");
      }
    });
  }

  onforgotPassword(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form.value)
    this.isLoading = true;
    this.authService.forgotPassword(form.value.email)
      .subscribe((response)=>{
          this.router.navigate([`/auth/account-recovery/${this.emailId}`]);
      })
  }

}
