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
  productContent:string;
  productCreator:string;
  productImagePath:string;
  productAdditionalImages = [];
  productTitle:string;
  imageObject:any = [];
  
  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      this.productId = params['id']
      this.productContent = params['content']
      this.productCreator = params['creator']
      this.productImagePath = params['imagePath']
      this.productAdditionalImages = params['additionalImages']
      this.productTitle = params['title']
      for(let image of this.productAdditionalImages){
         this.imageObject.push({
          // image:image,
          thumbImage: image,
          alt: this.productTitle + 'Image'
         })
      }
    })


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
    let tempImage = this.productImagePath;
    this.productImagePath = this.imageObject[index]['thumbImage'];
    
    this.imageObject = [];
    for(let i in this.productAdditionalImages){
      if(i !== index){
        this.imageObject.push({
         // image:image,
         thumbImage: this.productAdditionalImages[i],
         alt: this.productTitle + 'Image'
        })
      }
      else if(i === index){
        this.imageObject.push({
          // image:image,
         thumbImage:tempImage,
         alt: this.productTitle + 'Image'
        })
      }
   }
    // this.imageObject[index]['image'] = tempImage;
    this.imageObject[index]['thumbImage'] = tempImage;
    this.productAdditionalImages = [];
    this.productAdditionalImages = this.imageObject.map(value=>value['thumbImage']);
  }

}
