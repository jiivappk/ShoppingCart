import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute, NavigationStart, ParamMap, Route, Router } from '@angular/router';
@Component({
  selector: 'app-load-images-dialog',
  templateUrl: './load-images-model.component.html',
  styleUrls: ['./load-images-model.component.css']
})
export class LoadImagesDialogComponent implements OnInit {

  images:any;
  imageCount:any;
  imageIndex:any;
  userName:any;
  ratingScale:any;
  comment:any;
  isSingleImage = false;
  imageObject:any = [];
  defaultImageIndex = 1;
  constructor(
    @Optional() private dialogRef: MatDialogRef<LoadImagesDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    public route: ActivatedRoute
    ) {
      if(data){
        const self = this;
        self.imageIndex = data.imageIndex;
        self.images = [...data.images];
        if(data.isSingleImage){
          self.images = this.reorderArrayBySelectedImage(this.imageIndex, this.images); 
        }
        self.imageCount = data.imageCount;
        self.userName = data.userName;
        self.ratingScale = data.ratingScale;
        self.comment = data.comment;
        self.isSingleImage = data.isSingleImage;
        for(let image of this.images){
          self.imageObject.push({
           // image:image,
           thumbImage: image,
           alt: this.userName + 'Image'
          })
       }
       console.log(self.imageObject);
      }
    }

  ngOnInit(): void {
  }

  closeDialog(tag){
    
    this.dialogRef.close(true);
  }

  singleImageSlide(index){
    this.imageObject = this.reorderArrayBySelectedImage(index, this.imageObject);
    this.isSingleImage = true;
  }

  reorderArrayBySelectedImage(index,arr){
    // const selectedImageObject = arr[index];
    // for(let i=index;i>=0;i--){
    //   arr[i] = arr[i-1];
    // }
    // arr[0] = selectedImageObject;
    // return arr;
    const firstArr = arr.slice(index);
    const secondArr = arr.slice(0,index);
    const result = [...firstArr, ...secondArr];
    return result;
  }

}
