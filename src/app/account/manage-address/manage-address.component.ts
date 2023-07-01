import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-manage-address',
  templateUrl: './manage-address.component.html',
  styleUrls: ['./manage-address.component.css']
})
export class ManageAddressComponent implements OnInit {

  constructor(public authService:AuthService) { }

  isaddAddress = false;
  address = {
    area:'',
    alternateMobileNumber:'',
    locality:'',
    name:'',
    landMark:'',
    mobile:'',
    pinCode:'',
    state:'',
    town:'',
    addressType:''
  }

  states = [  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

form: FormGroup;
public userDetail;
public existingAddress:any;
public mode = 'create';
public editElementIndex = null;
public selectedAddressType = 'home';

  ngOnInit(): void {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
    if(this.userDetail.address.length > 0 ){
      this.existingAddress = [];
      this.userDetail.address.map((address)=>{
        this.existingAddress.push(JSON.parse(address));
      })
    }
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      mobile: new FormControl(null, { validators: [Validators.required, , Validators.minLength(10)] }),
      pinCode: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(4)]
      }),
      alternateMobileNumber: new FormControl(null, {
        validators: [Validators.required]
      }),
      locality: new FormControl(null, {
        validators: [Validators.required]
      }),
      area: new FormControl(null, {
        validators: [Validators.required]
      }),
      landMark: new FormControl(null, {
        validators: [Validators.required]
      }),
      town: new FormControl(null, {
        validators: [Validators.required]
      }),
      state: new FormControl(null, {
        validators: [Validators.required]
      }),
      addressType: new FormControl(null)
    });
  }

  openAndClose(){
    this.isaddAddress = !this.isaddAddress;
  }

  onSaveAddress(){
   if(this.form.status === 'INVALID'){
    return;
   }
   if(this.mode === 'create'){
     this.address.name = this.form.controls.name.value;
     this.address.area = this.form.controls.area.value;
     this.address.alternateMobileNumber = this.form.controls.alternateMobileNumber.value;
     this.address.locality = this.form.controls.locality.value;
     this.address.landMark = this.form.controls.landMark.value;
     this.address.mobile = this.form.controls.mobile.value;
     this.address.pinCode = this.form.controls.pinCode.value;
     this.address.state = this.form.controls.state.value;
     this.address.town = this.form.controls.town.value;
     this.address.addressType = this.form.controls.addressType.value;
     this.selectedAddressType = this.form.controls.addressType.value;
  
     const newAddress = JSON.stringify(this.address);
     if(this.userDetail.address.length > 0 ){
        const isAddressPresent = this.userDetail.address.some((address)=>{
          return address === newAddress;
        })
  
        if(!isAddressPresent){
          this.userDetail.address.push(newAddress);
        }
     }
     else{
      this.userDetail.address.push(newAddress);
     }
   }
   else if(this.mode === 'edit'){
      console.log(this.address);
      this.address.name = this.form.controls.name.value;
      this.address.area = this.form.controls.area.value;
      this.address.alternateMobileNumber = this.form.controls.alternateMobileNumber.value;
      this.address.locality = this.form.controls.locality.value;
      this.address.landMark = this.form.controls.landMark.value;
      this.address.mobile = this.form.controls.mobile.value;
      this.address.pinCode = this.form.controls.pinCode.value;
      this.address.state = this.form.controls.state.value;
      this.address.town = this.form.controls.town.value;
      this.address.addressType = this.form.controls.addressType.value;
      this.selectedAddressType = this.form.controls.addressType.value;
  
      const editedAddress = JSON.stringify(this.address);
      this.userDetail.address.splice(this.editElementIndex, 1, editedAddress);
   }
   this.saveAddress();
   this.isaddAddress = !this.isaddAddress;
   
  }

  deleteAddress(index){
    console.log(index);
    this.existingAddress.splice(index,1);
    const newAddress = this.existingAddress.map((address)=>{
      return JSON.stringify(address);
    })
    this.userDetail.address = newAddress;
    this.saveAddress();
  }

  saveAddress(){
    this.authService.editUser(this.userDetail).subscribe((result:any)=>{
      this.mode = 'create';
      this.emptyForm();
      if(result?.status === 'OK'){
        this.authService.setUserDetail(result['user']['userId'],result['user']['email'],result['user']['firstName'],result['user']['lastName'],result['user']['gender'],result['user']['phoneNumber'],result['user']['profilePic'],result['user']['dob'],result['user']['address'])
        this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
        if(this.userDetail.address.length > 0 ){
          this.existingAddress = [];
          this.userDetail.address.map((address)=>{
            this.existingAddress.push(JSON.parse(address));
          })
        }
        console.log("After Update",this.userDetail);
      }
     })
  }

  openEdit(index){
    this.editElementIndex = index;
    this.form.patchValue({
      name: this.existingAddress[index].name,
      mobile: this.existingAddress[index].mobile,
      pinCode: this.existingAddress[index].pinCode,
      alternateMobileNumber: this.existingAddress[index].alternateMobileNumber,
      locality: this.existingAddress[index].locality,
      area: this.existingAddress[index].area,
      landMark: this.existingAddress[index].landMark,
      town: this.existingAddress[index].town,
      state: this.existingAddress[index].state,
      addressType: this.existingAddress[index].addressType
    });
    this.selectedAddressType = this.form.controls.addressType.value;
    this.mode = 'edit';
    this.isaddAddress = !this.isaddAddress;
  }

  closeEdit(){
    this.emptyForm();
    this.mode = 'create';
    this.isaddAddress = !this.isaddAddress;
    this.selectedAddressType = 'home';
  }

  emptyForm(){
    this.form.patchValue({
      name: null,
      mobile: null,
      pinCode: null,
      alternateMobileNumber: null,
      locality: null,
      area: null,
      landMark: null,
      town: null,
      state: null,
      addressType: null
    });
    this.form.reset()
  }

}
