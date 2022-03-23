import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  constructor(private route:ActivatedRoute) { }
  productId:string;
  productcontent:string;
  productcreator:string;
  productimagePath:string;
  producttitle:string;
  imageObject:any;
  
  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      this.productId = params['id']
      this.productcontent = params['content']
      this.productcreator = params['creator']
      this.productimagePath = params['imagePath']
      this.producttitle = params['title']
      console.log("productId",params['id']);
      console.log("productcontent",params['content']);
      console.log("productcreator",params['creator']);
      console.log("productimagePath",params['imagePath']);
      console.log("producttitle",params['title']);
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

  yourfunctionName(event){
    console.log("Your function is called", event)
  }

}
