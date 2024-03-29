import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../products.service';
import { MatDialog } from "@angular/material/dialog";
import { LoadImagesDialogComponent } from '../load-images-model/load-images-model.component';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  constructor(
    private route:ActivatedRoute, 
    public router:Router,
    private productService: ProductsService,
    private dialog:MatDialog
    ) { }
  productId:string;
  productContent:string;
  productCreator:string;
  productImagePath:string;
  productAdditionalImages = [];
  productTitle:string;
  imageObject:any = [];
  productsPerPage = 2;
  currentPage = 1;
  productReviews = [];
  
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
   
    this.productService.getProductReviews(this.productId, this.productsPerPage, this.currentPage).subscribe((result)=>{
      console.log(result['productReviews']);
      this.productReviews = [...result['productReviews']];
      console.log("this.productReviews",this.productReviews);
    })

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

  loadAllImagesModal(productImages,userName, ratingScale, comment){
    const dialogRef = this.dialog.open(LoadImagesDialogComponent, {data: {images: productImages,imageCount:productImages.length, userName:userName, ratingScale:ratingScale, comment:comment, isSingleImage:false}});
  }

  loadSingleImagesModal(productImages, imageIndex, userName, ratingScale, comment){
    const dialogRef = this.dialog.open(LoadImagesDialogComponent, {data: {images: productImages,imageIndex:imageIndex, userName:userName, ratingScale:ratingScale, comment:comment, isSingleImage:true}});
  }

  routeToAllReview(){
    this.router.navigate(['../all-reviews/',], {relativeTo: this.route, queryParams: {id:this.productId,content:this.productContent,creator:this.productCreator,imagePath:this.productImagePath,additionalImages:this.productAdditionalImages, title:this.productTitle}} );
  }

}
