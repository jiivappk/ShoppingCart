import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

const BACKEND_URL = environment.apiUrl + "/user/";
@Injectable({ providedIn: "root" })
export class AccountService {

  constructor(private http: HttpClient, private router:  Router) {}

  changeMailId(email: string, password: string, newEmail:string) {
    const data = { oldEmail: email, password: password, newEmail: newEmail };
    return this.http.post(BACKEND_URL + "change-mailId", data);
  }

  updateEmail(oldMailId: string, newMailId: string, oldMailOtp: string, newMailOtp: string){
    const data = {oldMailId: oldMailId, newMailId: newMailId, oldMailOtp: oldMailOtp, newMailOtp:newMailOtp};
    this.http.post(BACKEND_URL + "update-email", data).subscribe((res)=>{
      console.log("respose", res);
      if(res['user']){
        console.log('user');
        this.router.navigate(["/auth/login"]);
      }
    })
  }

  
  updatePassword(emailId, passwordResetOtp, newPassword){
    const data = {emailId: emailId, passwordResetOtp:passwordResetOtp, newPassword:newPassword };
    return this.http.put(BACKEND_URL + "reset-password", data);
  }
  
  resetToken(mailId: string, type: string){
    const data = {mailId: mailId, type: type};
    return this.http.put(BACKEND_URL + "reset-token", data);
  }
  
}
