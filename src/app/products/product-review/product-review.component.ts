import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ProductsService } from "../products.service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-product-review",
  templateUrl: "./product-review.component.html",
  styleUrls: ["./product-review.component.css"]
})
export class ProductReviewComponent implements OnInit {

  constructor(public productsService: ProductsService, private route:ActivatedRoute) {}

  form: FormGroup;
  ratingScale = 0;
  tempScale = 0;
  imagesPreview = [];
  imageAsFiles = [];
  productId;
  productTitle;
  public userDetail;
  public userId; 
  public userName;
  public profilePic; 
  public imageCountExceedsError = false;
  public isSubmitButtonCLicked = false;
  ngOnInit(){

      this.route.queryParams.subscribe((params)=>{
        this.productId = params['productId']
        this.productTitle = params['title']
      })

      
      this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
      this.userId = this.userDetail.userId;
      this.userName = this.userDetail.firstName + " " + this.userDetail.lastName;
      this.profilePic = this.userDetail.profilePic;
      this.form = new FormGroup({
        ratingScale: new FormControl(null,{ 
          validators: [Validators.required, , Validators.minLength(10)] 
      }),
        comment: new FormControl(null, { 
            validators: [Validators.required, , Validators.minLength(10)] 
        }),
        images: new FormControl([])
      });
      this.productsService.getSingleProductReview(this.productId, this.userId).subscribe(async (result)=>{
        const self = this;
        let imgArray = result['productReview']['images'];
        const imageBlob = [];
        let imageBlobArray = await this.getBlobImageFromUrl(imgArray);
        if(result['status'] === 'SUCCESS'){
          this.ratingScale = +result['productReview']['ratingScale'];
          self.form.patchValue({
            ratingScale: result['productReview']['ratingScale'],
            comment: result['productReview']['comment'],
            // images:  [...this.form.controls['images'].value ,...result['productReview']['images']]
            images:  [...this.form.controls['images'].value ,...imageBlobArray]
          });
          this.imagesPreview = [...result['productReview']['images']];
        }
        console.log("Image values", this.form)
      })
      console.log("Form value", this.form);
  }

  async getBlobImageFromUrl(imageUrlArray) {
    let blobArray = [];
    for(let i = 0; i<imageUrlArray.length; i++){
      var res = await fetch(imageUrlArray[i]);
      var blob = await res.blob();
      const blobPart = new Blob([blob as BlobPart], {
        type: 'image/jpg',
      });
      const fileUrlSplit = res.url.split('/');
      const filenameArr = fileUrlSplit[fileUrlSplit.length - 1].split('-');
      const fileprefix = filenameArr[0];
      const fileExtension = filenameArr[1].split('.')[1];
      const filename = fileprefix + '.' + fileExtension;
      const file = new File([blobPart], filename, {
        type: 'image/jpg',
      });
      blobArray.push(file);
    }
    return blobArray;
  }

  onSaveReview(){
    console.log("Save button is clicked.");
    this.isSubmitButtonCLicked = true;
    if(this.form.controls.ratingScale.value < 1 || this.imageCountExceedsError || this.form.get('comment').invalid){
      return;
    } 
    this.productsService.addProductReview(
      this.productId, 
      this.productTitle, 
      this.userId, 
      this.userName,
      this.profilePic, 
      this.form.controls.ratingScale.value, 
      this.form.controls.comment.value, 
      this.form.controls.images.value,
      );
  }

  onFileInput(file:File){
    console.log(file);
  }

  onMouseEnter(index){
    // this.ratingScale = index > this.tempScale ? index : this.tempScale;
    this.ratingScale = index;
    this.form.patchValue({ ratingScale: index });
  }

  onMouseOut(index){
    this.ratingScale = this.tempScale;
    this.form.patchValue({ ratingScale: this.tempScale });
  }

  ratingScaleSelected(index){
    this.tempScale = index;
    this.ratingScale = this.tempScale;
    this.form.patchValue({ ratingScale: this.tempScale });
  }

  onImagePicked(event: Event) {
      const {files} = (event.target as HTMLInputElement);
      for(let i = 0;i<files.length;i++){
        this.imageAsFiles.push(files[i])
        const reader = new FileReader();
        reader.onload = () => {
          this.imagesPreview.push(reader.result as string);
        }; 
        reader.readAsDataURL(files[i]);
      }
      this.form.patchValue({ images: [...this.form.controls.images.value, ...this.imageAsFiles] });
      this.imageAsFiles = [];
      this.form.get("images").updateValueAndValidity();
      if(this.imageAsFiles.length > 6){
        this.imageCountExceedsError = true;
      }
      else{
        this.imageCountExceedsError = false;
      }
  }

  onImageRemoval(index){
    console.log("Image Removal selected");
    const files = [...this.form.controls.images.value];
    files.splice(index,1);
    // this.imageAsFiles.splice(index, 1);
    // this.form.patchValue({ images: [...this.imageAsFiles] });
    this.form.patchValue({ images: [...files] });
    this.imagesPreview.splice(index, 1);
  }
    
}
