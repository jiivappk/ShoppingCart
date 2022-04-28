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

  onImagePicked(event: Event, targetImage) {
    console.log("Image Picked is called", event);
    console.log("target",targetImage);
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
      console.log("On additionalImages block")
      const {files} = (event.target as HTMLInputElement);
      this.form.patchValue({ additionalImages: files });
      console.log("Form value",this.form.get("additionalImages"));
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
    let price = this.form.value.price;
    let actualPrice = this.form.value.actualPrice;
    let discount = 100-((price/actualPrice)*100);
    console.log("Discount",discount);
    this.form.patchValue({discountPercentage: discount})
    this.form.patchValue({deliveryPeriod: 12})
    this.form.patchValue({deliveryCharge: 0})
    this.form.patchValue({replacementPeriod: 10})
    console.log("Dicount For Value",this.form.value.discountPercentage);
    console.log("Save Producct method is called")
    if (this.form.invalid) {
      console.log("Form is invalid")
      console.log("Invalid Form",this.form);
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      console.log("Inside Create Model")
      this.productsService.addProduct(
        this.form.value.title,
        this.form.value.content,
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
      console.log("Form values are", this.form);
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
