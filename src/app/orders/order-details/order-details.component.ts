import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  value: any[] = [
    {content:"Ordered" ,date:"15/02/2022 10.30", status:"success"},
    {content:"Processing" ,date:"15/02/2022 14.00", status:"success"},
    {content:"Shipped" ,date:"16/02/2022 10.30", status:"inProgress"},
    {content:"Delivered" ,date:"20/02/2022 10.30", status:"inProgress"},
    {content:"Delivered" ,date:"20/02/2022 10.30", status:"inProgress"},
    {content:"Delivered" ,date:"20/02/2022 10.30", status:"inProgress"},
    {content:"Delivered" ,date:"20/02/2022 10.30", status:"inProgress"},
  ];
  constructor(private route:ActivatedRoute) { }
  orderPrice:string;
  orderAdditionalImages = [];
  orderId:string;
  productId:string;
  userId:any;
  orderContent:string;
  orderCreator:string;
  orderImagePath:string;
  orderTitle:string;
  orderAddress:any;
  orderInfo:any;
  orderStatus:any;
  orderRefundStatus: string;
  imageObject = [];
  
  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      this.orderPrice = params['price']
      this.orderAdditionalImages = params['additionalImages']
      this.orderId = params['orderId']
      this.orderContent = params['content']
      this.orderCreator = params['creator']
      this.orderImagePath = params['imagePath']
      this.orderTitle = params['title']
      this.orderAddress = JSON.parse(params['deliveryAddress'])
      this.orderInfo = params['orderInfo']
      this.orderStatus = params['orderStatus']
      this.orderRefundStatus = params['refundStatus']
      this.productId = params['productId']
      this.userId = params['userId']
      for(let image of this.orderAdditionalImages){
        this.imageObject.push({
         // image:image,
         thumbImage: image,
         alt: this.orderTitle + 'Image'
        })
      }
    })
    console.log(this.orderAddress)
  //   this.imageObject= [
  //     {
  //       image: "http://localhost:3000/images/Front_View.jpg",
  //       thumbImage: "http://localhost:3000/images/Front_View.jpg",
  //       title: 'Slider Image 1',
  //       alt: 'Image Alt 1',
  //     }, 
  //     {
  //       image: "http://localhost:3000/images/Left_View.jpg",
  //       thumbImage: "http://localhost:3000/images/Left_View.jpg",
  //       title: 'Slider Image 1',
  //       alt: 'Image Alt 1',
  //     }, 
  //     {
  //       image: "http://localhost:3000/images/Right_View.jpg",
  //       thumbImage: "http://localhost:3000/images/Right_View.jpg",
  //       title: 'Slider Image 1',
  //       alt: 'Image Alt 1',
  //     }, 
  //     {
  //       image: 'http://localhost:3000/images/Special_View.jpg',
  //       thumbImage: 'http://localhost:3000/images/Special_View.jpg',
  //       title: 'Slider Image 1',
  //       alt: 'Image Alt 1',
  //     }, {
  //       image: 'http://localhost:3000/images/Top_View.jpg',
  //       thumbImage: 'http://localhost:3000/images/Top_View.jpg',
  //       title: 'Slider Image 2',
  //       alt: 'Image Alt 2'
  //     }
  //  ];

  }

  imageClicked(index,imageSlider){
    let tempImage = this.orderImagePath;
    this.orderImagePath = this.imageObject[index]['thumbImage'];
    
    this.imageObject = [];
    for(let i in this.orderAdditionalImages){
      if(i !== index){
        this.imageObject.push({
         // image:image,
         thumbImage: this.orderAdditionalImages[i],
         alt: this.orderTitle + 'Image'
        })
      }
      else if(i === index){
        this.imageObject.push({
          // image:image,
         thumbImage:tempImage,
         alt: this.orderTitle + 'Image'
        })
      }
   }
    // this.imageObject[index]['image'] = tempImage;
    this.imageObject[index]['thumbImage'] = tempImage;
    this.orderAdditionalImages = [];
    this.orderAdditionalImages = this.imageObject.map(value=>value['thumbImage']);
  }

}
