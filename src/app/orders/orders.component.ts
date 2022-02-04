import { Component, OnInit } from '@angular/core';
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

  form: FormGroup;
  postId:string;
  postContent:string;
  postCreator:string;
  postImagePath:string;
  postTitle:string;
  isLoading = false;
  pageContent = ['Delivery Address','Make Payment','Oredred Details'];
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
           ]

  ngOnInit(): void {
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
      this.postId = params['postId']
      this.postContent = params['content']
      this.postCreator = params['creator']
      this.postImagePath = params['imagePath']
      this.postTitle = params['title']
      console.log("postId from Order",params['postId']);
      console.log("postContent from Order",params['content']);
      console.log("postCreator from Order",params['creator']);
      console.log("postImagePath from Order",params['imagePath']);
      console.log("postTitle from Order",params['title']);
    })

  }

  ngAfterViewInit(){

  }
  

  onSaveOrder(header){
    console.log("Inside OnSavePost")
    console.log(this.form.value)
    console.log("Expansion Header",header)
    let userId = localStorage.getItem("userId");
    if(userId == null){
      console.log("User id is null");
      this.dialog.open(LoginComponent, {data: {message: "Login Component"}});
    }
    else{
      let orderItem = {
        title: this.postTitle,
        content: this.postContent,
        imagePath: this.postImagePath,
        creator: this.postCreator,
        postId: this.postId,
        userId: userId,
        address: {
          fullName: this.form.value.fullName,
          mobile: this.form.value.mobile,
          pinCode: this.form.value.pinCode,
          flatNo: this.form.value.flatNo,
          area: this.form.value.area,
          landMark: this.form.value.landMark,
          town: this.form.value.town,
          state: this.form.value.state,
          },
        orderStatus: [
          {
            content:"Ordered",
            date:"15/02/2022 10.30",
            status:"R",
          },

        ]
      }
      console.log("Add to order is orderItem", orderItem)
      console.log("Add to cart userId",userId)
      let result = this.orderService.addOrderItems(orderItem)
      console.log(result)
    }
    // this.orderService.addOrderItems()
  }

  Expanded(header){
    console.log("Expansion Header",header.panel._expanded)
  }

}
