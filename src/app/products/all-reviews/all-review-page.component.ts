import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service';
import { MatDialog } from "@angular/material/dialog";
import { LoadImagesDialogComponent } from '../load-images-model/load-images-model.component';
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: 'app-all-review-page',
  templateUrl: './all-review-page.component.html',
  styleUrls: ['./all-review-page.component.css']
})
export class AllReviewPageComponent implements OnInit {

  constructor(
    private route:ActivatedRoute, 
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
  productsPerPage = 5;
  currentPage = 1;
  productReviews = [];
  totalProducts = 0;
  pageSizeOptions = [1, 2, 5, 10];
  isLoading = false;
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
      this.productReviews = [...result['productReviews']];
      this.totalProducts = result['totalReviewCount'] ? result['totalReviewCount'] : 0;
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


  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.productService.getProductReviews(this.productId, this.productsPerPage, this.currentPage).subscribe((result)=>{
      this.productReviews = [...result['productReviews']];
      this.totalProducts = result['totalReviewCount'] ? result['totalReviewCount'] : 0;
    })
  }

}
