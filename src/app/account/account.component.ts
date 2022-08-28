import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  value: any[] = [
    {content:"Ordered" ,date:"15/02/2022 10.30", status:"S"},
    {content:"Processing" ,date:"15/02/2022 14.00", status:"S"},
    {content:"Shipped" ,date:"16/02/2022 10.30", status:"R"},
    {content:"Delivered" ,date:"20/02/2022 10.30", status:"R"},
    {content:"Delivered" ,date:"20/02/2022 10.30", status:"R"},
    {content:"Delivered" ,date:"20/02/2022 10.30", status:"R"},
    {content:"Delivered" ,date:"20/02/2022 10.30", status:"R"},
  ];
  constructor(private route:ActivatedRoute, private authService: AuthService, private router: Router) { }
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
  orderStatus:any;
  orderRefundStatus: string;
  imageObject = [];
  
  userName = 'User';
  userImageUrl = '../assets/User-Image-Male.webp';
  ngOnInit(): void {
    this.authService.profileDetails$.subscribe((details)=>{
      console.log("Profile Details", details);
    })
    this.route.queryParams.subscribe((params)=>{
      this.orderPrice = params['price']
      this.orderAdditionalImages = params['additionalImages']
      this.orderId = params['orderId']
      this.orderContent = params['content']
      this.orderCreator = params['creator']
      this.orderImagePath = params['imagePath']
      this.orderTitle = params['title']
      this.orderAddress = JSON.parse(params['address'])
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

    // this.router.navigate([''])

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

