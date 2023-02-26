import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog } from "@angular/material/dialog";
import { OtpVerificationDialogComponent } from '../../../app/otp-verification-dialog/otp-verification-dialog.component';
import { AccountService } from '../account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { duplicateEmailValidator } from '../../shared/duplicateEmail.validator';
@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.css']
})
export class PersonalInformationComponent implements OnInit {

  myForm: FormGroup;
  firstName = '';
  lastName = '';
  gender = '';
  dob = '';
  email = '';
  newEmail  = '';
  password = '';
  invalidNewMail = false;
  emptyPassword = false;
  invalidPassword = false;
  emptyNewEmail = false;
  invalidNewEmail =  false;
  duplicateNewEmail = false;
  changeEmailInitiate = false;
  disableProceedButton = false;
  editUser = false;
  constructor(
    public authService:AuthService, 
    private dialog:MatDialog, 
    private accountService:AccountService,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {

    const userDetail = JSON.parse(localStorage.getItem("userDetail"));
    this.firstName = userDetail.firstName,
    this.lastName = userDetail.lastName,
    this.gender = userDetail.gender,
    this.dob = userDetail.dob,
    this.email = userDetail.email

    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
      newEmail: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    },{ validators: duplicateEmailValidator });
  }

  savePersonalInfo(){
    console.log("Save Method is called", this.firstName, this.lastName, this.gender, this.dob);
    this.authService.editUser(this.firstName, this.lastName, this.gender, this.dob).subscribe(
      (result)=>{
      console.log("User Updated Successfully",result);
      this.authService.setUserDetail(result['user'].userId, result['user'].email, result['user'].firstName, result['user'].lastName, result['user'].gender, result['user'].phoneNumber, result['user'].profilePic, result['user'].dob);
      },
      (error) => {
        console.log("Error in editing user");
      }
    )
  }

  changeEmailStatus(updateStatus){
    if(!updateStatus){
      this.changeEmailInitiate = false;
      return;
    }
    this.changeEmailInitiate = true;
    console.log("Save Email Method is called",this.email);
  }

  updateEmail(){
    console.log("Update Email method is called");
    if(!this.myForm.invalid){
      this.disableProceedButton = true;
      this.invalidNewEmail = false;

      this.emptyPassword = false;
      this.invalidPassword = false;

      this.emptyNewEmail = false;
      this.invalidNewEmail = false;
      this.duplicateNewEmail = false;
      
      this.accountService.changeMailId(this.email, this.password, this.newEmail).subscribe((res)=>{
        const dialogRef = this.dialog.open(OtpVerificationDialogComponent, {data: {type: 'mailUpdate', oldMailId: this.email, newMailId: this.newEmail}});
        dialogRef.afterClosed().subscribe((result)=>{
          if(result){
            this.disableProceedButton = false;
          }
        })
      },
      (err)=>{
        console.log(err);
      })
    }
    else{
      this.invalidNewEmail = this.myForm.get('email').invalid;

      this.emptyPassword = this.myForm.get('password').errors?.required;
      this.invalidPassword = this.myForm.get('password').errors?.minlength || this.myForm.get('password').errors?.maxlength ;

      this.emptyNewEmail = this.myForm.get('newEmail').errors?.required;
      this.invalidNewEmail = this.myForm.get('newEmail').errors?.email;
      this.duplicateNewEmail = this.myForm.errors?.['duplicateMail'];
    }
  }

  editModeClicked(){
    this.editUser = !this.editUser;
  }
}
