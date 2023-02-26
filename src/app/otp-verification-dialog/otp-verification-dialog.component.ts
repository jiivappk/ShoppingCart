import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AccountService } from '../account/account.service';
import { ActivatedRoute, NavigationStart, ParamMap, Route, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-otp-verification-dialog',
  templateUrl: './otp-verification-dialog.component.html',
  styleUrls: ['./otp-verification-dialog.component.css']
})
export class OtpVerificationDialogComponent implements OnInit {

  type = '';
  newMailId = 'newMail@gmail.com';
  oldMailId = 'oldMail@gmail.com';
  emailId = '';
  // isPasswordResetPage = '';
  newPassword = '';
  confirmNewPassword = '';
  passwordResetOtp = '';
  newMailOtp = '';
  oldMailOtp = '';
  placeHolderOne = 'Enter OTP sent to ' + this.oldMailId ;
  placeHolderTwo = 'Enter OTP sent to ' + this.newMailId ;
  passwordMismatchError = false;
  isError = false;
  errorMessage = '';
  constructor(
    @Optional() private dialogRef: MatDialogRef<OtpVerificationDialogComponent>,
    // @Optional @Inject(MAT_DIALOG_DATA) public data: {type:string, oldMailId:string, newMailId: string },
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router,
    public route: ActivatedRoute
    ) {
      if(this.dialogRef){
        this.dialogRef.disableClose = true;
      }
      if(data){
        this.type = data.type;
        this.oldMailId = data.oldMailId;
        this.newMailId = data.newMailId;
      }
    }

  ngOnInit(): void {
    // this.isPasswordResetPage = '';
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("mailId")) {
         this.emailId = paramMap.get("mailId");
        //  this.isPasswordResetPage = "passwordReset";
         this.type = 'passwordReset'
      } else {
        console.log("MailId is missing");
      }
    });
    console.log("email", this.emailId);
    // console.log("isPasswordResetPage", this.isPasswordResetPage);
  }

  updatePassword(){

  }

  closeDialog(tag){
    if(this.type === 'mailUpdate' && tag === 'change'){
        this.accountService.updateEmail(this.oldMailId, this.newMailId, this.oldMailOtp, this.newMailOtp);
    }
    else if(this.type === 'mailUpdate' && tag === 'cancel'){
        this.accountService.resetToken(this.oldMailId, "mailUpdate").subscribe((result)=>{
          console.log("Mail id is updated");
        })
    }
    else if(this.type === 'passwordReset' && tag === 'submit'){
      if(this.newPassword === this.confirmNewPassword){
        this.passwordMismatchError = false;
        this.accountService.updatePassword(this.emailId, this.passwordResetOtp, this.newPassword).subscribe((result)=>{
          if(result['success']){
            this.router.navigate(['/auth/login/']);
          }
          else if(result['status'] === 'Failed'){
            this.isError = true;
            this.errorMessage = result['message']
          }
        })
      }
      else{
        this.passwordMismatchError = true;
      }
    }
    else if(this.type === 'passwordReset' && tag === 'cancel'){
      //delete passwordResetToken when canccel  button is clicked logic to be implementedd. Refer this.accountService.passwordResetToken(this.oldMailId);
      this.accountService.resetToken(this.emailId, "passwordReset").subscribe((result)=>{
          this.router.navigate(['/auth/login/']);
      })
    }
    else if(this.type === 'passwordReset' && tag ==='submit'){
      this.updatePassword();
    }
    this.dialogRef.close(true);
  }

}
