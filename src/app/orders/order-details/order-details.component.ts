import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  value: any[] = [
    {content:"Ordered" ,date:"15/02/2022 10.30", status:"S"},
    {content:"Processing" ,date:"15/02/2022 14.00", status:"S"},
    {content:"Shipped" ,date:"16/02/2022 10.30", status:"R"},
    {content:"Delivered" ,date:"20/02/2022 10.30", status:"R"},
    {content:"Delivered" ,date:"20/02/2022 10.30", status:"R"},
    {content:"Delivered" ,date:"20/02/2022 10.30", status:"R"},
    {content:"Delivered" ,date:"20/02/2022 10.30", status:"R"},
  ];
  constructor(private route:ActivatedRoute) { }
  orderId:string;
  productId:string;
  userId:any;
  orderContent:string;
  orderCreator:string;
  orderImagePath:string;
  orderTitle:string;
  orderAddress:any;
  orderStatus:any;
  imageObject:any;
  
  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      this.orderId = params['orderId']
      this.orderContent = params['content']
      this.orderCreator = params['creator']
      this.orderImagePath = params['imagePath']
      this.orderTitle = params['title']
      this.orderAddress = JSON.parse(params['address'])
      this.orderStatus = JSON.parse(params['orderStatus'])
      this.productId = params['productId']
      this.userId = params['userId']
      console.log("OrderID",params['orderId']);
      console.log("ProductID",params['productId']);
      console.log("UserID",params['userId']);
      console.log("OrderContent",params['content']);
      console.log("OrderCreator",params['creator']);
      console.log("OrderImagePath",params['imagePath']);
      console.log("OrderTitle",params['title']);
      console.log("OrderAddress",JSON.parse(params['address']));
      console.log("OrderStatus",JSON.parse(params['orderStatus']));
    })

    this.imageObject= [
      {
        image: "http://localhost:3000/images/Front_View.jpg",
        thumbImage: "http://localhost:3000/images/Front_View.jpg",
        title: 'Slider Image 1',
        alt: 'Image Alt 1',
      }, 
      {
        image: "http://localhost:3000/images/Left_View.jpg",
        thumbImage: "http://localhost:3000/images/Left_View.jpg",
        title: 'Slider Image 1',
        alt: 'Image Alt 1',
      }, 
      {
        image: "http://localhost:3000/images/Right_View.jpg",
        thumbImage: "http://localhost:3000/images/Right_View.jpg",
        title: 'Slider Image 1',
        alt: 'Image Alt 1',
      }, 
      {
        image: 'http://localhost:3000/images/Special_View.jpg',
        thumbImage: 'http://localhost:3000/images/Special_View.jpg',
        title: 'Slider Image 1',
        alt: 'Image Alt 1',
      }, {
        image: 'http://localhost:3000/images/Top_View.jpg',
        thumbImage: 'http://localhost:3000/images/Top_View.jpg',
        title: 'Slider Image 2',
        alt: 'Image Alt 2'
      }
   ];

  }

}
