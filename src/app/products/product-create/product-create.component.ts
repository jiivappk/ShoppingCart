import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { ProductsService } from "../products.service";
import { Product } from "../product.model";
import { mimeType } from "./mime-type.validator";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-product-create",
  templateUrl: "./product-create.component.html",
  styleUrls: ["./product-create.component.css"]
})
export class ProductCreateComponent implements OnInit, OnDestroy {
  enteredTitle = "";
  enteredContent = "";
  product: Product;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  additionalImages = [];
  categoryList = ['other-category','mobile', 'laptop', 'car', 'headphone', 'bike', 'furniture'];
  private mode = "create";
  private productId: string;
  private authStatusSub: Subscription;

  constructor(
    public productsService: ProductsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });

    this.form = this.fb.group({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required, Validators.maxLength(250)] }),
      category: new FormControl(null),
      newCategory: new FormControl({ value: null, disabled: true }, { validators: [Validators.required]}),

      price: new FormControl(null, {validators: [Validators.required] }),
      actualPrice: new FormControl(null, {validators: [Validators.required]}),
      discountPercentage: new FormControl(null, {validators: [Validators.required]}),
      noOfStocks: new FormControl(null, {validators: [Validators.required]}),

      deliveryPeriod: new FormControl(null, {validators: [Validators.required]}),
      deliveryCharge: new FormControl(null, {validators: [Validators.required]}),
      replacementPeriod: new FormControl(null, {validators: [Validators.required]}),

      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }), 
      additionalImages: new FormControl(null)
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("productId")) {
        this.mode = "edit";
        this.productId = paramMap.get("productId");
        this.isLoading = true;
        this.productsService.getProduct(this.productId).subscribe(productData => {
          this.isLoading = false;
          this.product = {
            id: productData._id,
            title: productData.title,
            content: productData.content,
            imagePath: productData.imagePath,
            creator: productData.creator
          };
          this.form.setValue({
            title: this.product.title,
            content: this.product.content,
            image: this.product.imagePath
          });
        });
      } else {
        this.mode = "create";
        this.productId = null;
      }
    });
  } 
  
  newCategoryWritten(){
    this.form.patchValue({category: this.form.get('newCategory').value})
  }

  categorySelected(selectedValue){
    if(selectedValue === 'other-category'){
      this.form.get('newCategory').enable();
      this.form.patchValue({category: this.form.get('newCategory').value})
    }
    else{
      this.form.get('newCategory').disable();
    }
  }

  onImagePicked(event: Event, targetImage) {
    if(targetImage === 'primaryImage'){
      const file = (event.target as HTMLInputElement).files[0];
      this.form.patchValue({ image: file });
      this.form.get("image").updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
    else if(targetImage === 'additionalImages'){
      const {files} = (event.target as HTMLInputElement);
      this.form.patchValue({ additionalImages: files });
      this.form.get("additionalImages").updateValueAndValidity();
      for(let i = 0;i<files.length;i++){
        const reader = new FileReader();
        reader.onload = () => {
          this.additionalImages.push(reader.result as string);
        }; 
        reader.readAsDataURL(files[i]);
      }
    }
  }


  onSaveProduct() {
    // if(this.form.value.newCategory){
      // this.categoryService.updateCategoryItem({categoryList: this.form.value.newCategory})
      //   .subscribe((result)=>{
      //     console.log("Result from update is", result)
      //   })
        // this.categoryService.addCategoryItems({categoryList: this.categoryList});
    // }
    let price = this.form.value.price;
    let actualPrice = this.form.value.actualPrice;
    let discount = 100-((price/actualPrice)*100);
    this.form.patchValue({discountPercentage: discount})
    this.form.patchValue({deliveryPeriod: 12})
    this.form.patchValue({deliveryCharge: 0})
    this.form.patchValue({replacementPeriod: 10})
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.productsService.addProduct(
        this.form.value.title,
        this.form.value.content,
        this.form.value.category,
        this.form.value.image,
        this.form.value.additionalImages,
        price,
        actualPrice,
        this.form.value.noOfStocks,
        this.form.value.discountPercentage,
        this.form.value.deliveryCharge,
        this.form.value.deliveryPeriod,
        this.form.value.replacementPeriod

      );
    } else {
      this.productsService.updateProduct(
        this.productId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
