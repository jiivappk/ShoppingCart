import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { OrderService } from "./order.service";
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from "@angular/router";

import { LoginComponent } from "../auth/login/login.component";

import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, AfterViewInit {

  constructor(
    private orderService:OrderService, 
    private dialog: MatDialog, 
    private route:ActivatedRoute, 
    public authService:AuthService,
    private router: Router
    ) { }

  @ViewChild('accordianList') accordianList: ElementRef;
  @ViewChild('firstExpansionPanel') firstExpansionPanel: any;
  @ViewChild('secondExpansionPanel') secondExpansionPanel: any;
  @ViewChild('thirdExpansionPanel') thirdExpansionPanel: any;

  form: FormGroup;
  isLoading = false;
  pageItems = ['Delivery Address','Make Payment','Oredred Details'];
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
  orderItem = {
            title: "",
            content: "",
            imagePath: "",
            creator: "",
            productId: "",
            userId: "",
            price: 0,
            actualPrice: 0,
            noOfStocks: 0,
            discountPercentage: 0,
            additionalImages: [],
            deliveryAddress: {
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
              },
            orderInfo: [],
            orderStatus: '',
            refundStatus: "NA"
          }

  
  public userDetail;
  public existingAddress:any;
  public mode = 'create';
  public editElementIndex = null;
  public selectedAddressType = 'home';
  public isaddAddress = false;
  public isAddressSelected = false;
  public selectedAddressIndex;
  public orderFailed = false;

  ngOnInit(): void {
    let userId = localStorage.getItem("userId");
    if(userId == null){
      this.dialog.open(LoginComponent, {data: {message: "Login Component"}});
    }
    else{
      this.orderItem.userId = userId;
    }

    // this.form = new FormGroup({
    //   fullName: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(3)]
    //   }),
    //   mobile: new FormControl(null, { validators: [Validators.required, , Validators.minLength(10)] }),
    //   pinCode: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(4)]
    //   }),
    //   flatNo: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   area: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   landMark: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   town: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   state: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    // });
    this.route.queryParams.subscribe((params)=>{
      this.orderItem.productId = params['productId']
      this.orderItem.content = params['content']
      this.orderItem.creator = params['creator']
      this.orderItem.imagePath = params['imagePath']
      this.orderItem.title = params['title'],
      this.orderItem.additionalImages = params['additionalImages']
      this.orderItem.price = params['price']
      this.orderItem.actualPrice = params['actualPrice']
      this.orderItem.noOfStocks = params['noOfStocks']
      this.orderItem.discountPercentage = params['discountPercentage']
    })

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

  ngAfterViewInit(){
    this.firstExpansionPanel.disabled = true;
    this.secondExpansionPanel.disabled = true;
    this.thirdExpansionPanel.disabled = true;
    this.firstExpansionPanel.open();
    this.secondExpansionPanel.close();
    this.thirdExpansionPanel.close();
  }
  

  onSaveAddress(firstExpansionPanel, secondExpansionPanel ,thirdExpansionPanel, mode){
    this.firstExpansionPanel.disabled = true;
    this.secondExpansionPanel.disabled = true;
    this.thirdExpansionPanel.disabled = true;
    firstExpansionPanel.close();
    secondExpansionPanel.open();
    thirdExpansionPanel.close();
    this.isAddressSelected = true;
    this.isaddAddress = false;
 
    if(mode === 'saveAndDeliver'){
      this.saveDeliveryAddress();
    }
    else{
      this.orderItem.deliveryAddress.name = this.existingAddress[this.selectedAddressIndex].name,
      this.orderItem.deliveryAddress.mobile = this.existingAddress[this.selectedAddressIndex].mobile,
      this.orderItem.deliveryAddress.pinCode = this.existingAddress[this.selectedAddressIndex].pinCode,
      this.orderItem.deliveryAddress.locality = this.existingAddress[this.selectedAddressIndex].locality,
      this.orderItem.deliveryAddress.area = this.existingAddress[this.selectedAddressIndex].area,
      this.orderItem.deliveryAddress.landMark = this.existingAddress[this.selectedAddressIndex].landMark,
      this.orderItem.deliveryAddress.town = this.existingAddress[this.selectedAddressIndex].town,
      this.orderItem.deliveryAddress.state = this.existingAddress[this.selectedAddressIndex].state
      this.orderItem.deliveryAddress.alternateMobileNumber = this.existingAddress[this.selectedAddressIndex].alternateMobileNumber
      this.orderItem.deliveryAddress.addressType = this.existingAddress[this.selectedAddressIndex].addressType
    }
  }

  async onPayment(firstExpansionPanel, secondExpansionPanel, thirdExpansionPanel){
    firstExpansionPanel.close();
    secondExpansionPanel.close();
    thirdExpansionPanel.open();
    // this.orderItem.orderInfo.push({
    //   content: "Ordered",
    //   date: "15/02/2022 10.30",
    //   status: "success"
    // })
    // this.orderItem.orderInfo.push({
    //   content: "Delivered",
    //   date: "25/02/2022 11.30",
    //   status: "inProgress"
    // })
    // this.orderItem.orderInfo.push({
    //   content: "Cancelled",
    //   date: "11/03/2022 12.30",
    //   status: "inProgress"
    // })
    this.orderItem.orderInfo.push({
      content:"Ordered",
      date:"15/02/2022 10.30", 
      status:"success"
    })
    this.orderItem.orderInfo.push({
      content:"Processing",
      date:"15/02/2022 14.00",
      status:"success"
    })
    this.orderItem.orderInfo.push({
      content:"Shipped",
      date:"16/02/2022 10.30",
      status:"success"
    })
    this.orderItem.orderInfo.push({
      content:"Delivered",
      date:"20/02/2022 10.30",
      status:"inProgress"
    })
    this.orderItem.orderInfo.push({
      content: "Cancelled",
      date: "11/03/2022 12.30",
      status: "inProgress"
    })
    
    let result = await this.orderService.addOrderItems(this.orderItem);
    if(result.status === 'success'){
      result.orderItem['deliveryAddress'] = JSON.stringify(result.orderItem.deliveryAddress);
      result.orderItem['orderInfo'] = result.orderItem.orderInfo.map(object=>JSON.stringify(object));
      this.router.navigate(['order-list/order-detail'],{queryParams:{orderId:result.orderItem.orderId, content:result.orderItem.content, creator:result.orderItem.creator, imagePath:result.orderItem.imagePath, title:result.orderItem.title, deliveryAddress:result.orderItem.deliveryAddress, price:result.orderItem.price, actualPrice: result.orderItem.actualPrice, noOfStocks: result.orderItem.noOfStocks, discountPercentage: result.orderItem.discountPercentage, additionalImages:result.orderItem.additionalImages, orderInfo:result.orderItem.orderInfo, orderStatus:result.orderItem.orderStatus, productId:result.orderItem.productId, userId:result.orderItem.userId, refundStatus:result.orderItem.refundStatus} })
      // this.router.navigate(["order-list/order-detail"])
    }
    else{
      this.orderFailed = true;
    }
  
  }

  saveDeliveryAddress(){
      if(this.form.status === 'INVALID'){
      return;
      }
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
      this.saveAddress();
      this.isaddAddress = !this.isaddAddress;
    
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
              this.selectedAddressIndex = this.existingAddress.length - 1;
              this.orderItem.deliveryAddress.name = this.existingAddress[this.selectedAddressIndex].name,
              this.orderItem.deliveryAddress.mobile = this.existingAddress[this.selectedAddressIndex].mobile,
              this.orderItem.deliveryAddress.pinCode = this.existingAddress[this.selectedAddressIndex].pinCode,
              this.orderItem.deliveryAddress.locality = this.existingAddress[this.selectedAddressIndex].locality,
              this.orderItem.deliveryAddress.area = this.existingAddress[this.selectedAddressIndex].area,
              this.orderItem.deliveryAddress.landMark = this.existingAddress[this.selectedAddressIndex].landMark,
              this.orderItem.deliveryAddress.town = this.existingAddress[this.selectedAddressIndex].town,
              this.orderItem.deliveryAddress.state = this.existingAddress[this.selectedAddressIndex].state
              this.orderItem.deliveryAddress.alternateMobileNumber = this.existingAddress[this.selectedAddressIndex].alternateMobileNumber
              this.orderItem.deliveryAddress.addressType = this.existingAddress[this.selectedAddressIndex].addressType
            })
          }
          console.log("After Update",this.userDetail);
        }
      })
    }

  openAndClose(){
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

  changeAddress(){
    this.isAddressSelected = false;
    this.firstExpansionPanel.open();
    this.secondExpansionPanel.close();
    this.thirdExpansionPanel.close();
  }

  onSelectAddress(index){
    console.log(index);
    this.selectedAddressIndex = index;
  }

  onConfirmOrderDetails(){
    this.firstExpansionPanel.close();
    this.secondExpansionPanel.close();
    this.thirdExpansionPanel.open();
  }

}
