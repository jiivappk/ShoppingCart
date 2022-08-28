import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { OrderService } from "./order.service";

import { LoginComponent } from "../auth/login/login.component";

import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  constructor(private orderService:OrderService,  private dialog: MatDialog, private route:ActivatedRoute) { }

  @ViewChild('accordianList') accordianList: ElementRef;

  form: FormGroup;
  isLoading = false;
  pageItems = ['Delivery Address','Make Payment','Oredred Details'];
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
            address: {
              fullName: "",
              mobile: "",
              pinCode: "",
              flatNo: "",
              area: "",
              landMark: "",
              town: "",
              state: "",
              },
            orderStatus: [],
            refundStatus: "NA"
          }

  

  ngOnInit(): void {
    let userId = localStorage.getItem("userId");
    if(userId == null){
      this.dialog.open(LoginComponent, {data: {message: "Login Component"}});
    }
    else{
      this.orderItem.userId = userId;
    }

    this.form = new FormGroup({
      fullName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      mobile: new FormControl(null, { validators: [Validators.required, , Validators.minLength(10)] }),
      pinCode: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(4)]
      }),
      flatNo: new FormControl(null, {
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
    });
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
    

  }
  

  onSaveAddress(firstExpansionPanel, secondExpansionPanel ,thirdExpansionPanel){
    firstExpansionPanel.close();
    secondExpansionPanel.open();
    thirdExpansionPanel.close();
 
    this.orderItem.address.fullName = this.form.value.fullName,
    this.orderItem.address.mobile = this.form.value.mobile,
    this.orderItem.address.pinCode = this.form.value.pinCode,
    this.orderItem.address.flatNo = this.form.value.flatNo,
    this.orderItem.address.area = this.form.value.area,
    this.orderItem.address.landMark = this.form.value.landMark,
    this.orderItem.address.town = this.form.value.town,
    this.orderItem.address.state = this.form.value.state
    
  }

  onPayment(firstExpansionPanel, secondExpansionPanel, thirdExpansionPanel){
    firstExpansionPanel.close();
    secondExpansionPanel.close();
    thirdExpansionPanel.open();
    this.orderItem.orderStatus.push({
      content: "Ordered",
      date: "15/02/2022 10.30",
      status: "R"
    })
    this.orderItem.orderStatus.push({
      content: "Delivered",
      date: "25/02/2022 11.30",
      status: "R"
    })
    this.orderItem.orderStatus.push({
      content: "Cancelled",
      date: "11/03/2022 12.30",
      status: "R"
    })
    let result = this.orderService.addOrderItems(this.orderItem)
  
  }

}
