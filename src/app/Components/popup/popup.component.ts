import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnInit {
  images: string[] = [];

  popUpForm: FormGroup = new FormGroup({
    id: new FormControl(this.data?.id ?? null),
    title: new FormControl(this.data?.title ?? '', [
      Validators.required,
      Validators.minLength(5),
    ]),
    price: new FormControl(this.data?.price ?? null, Validators.required),
    brand: new FormControl(this.data?.brand ?? '', Validators.required),
    category: new FormControl(this.data?.category ?? '', Validators.required),
    description: new FormControl(this.data?.description ?? '', [
      Validators.required,
      Validators.minLength(10),
    ]),
    image: new FormControl(this.data?.image ?? ''),
  });

  isNewProduct: boolean = true;

  disabledBtn: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.isNewProduct = false;
    } else {
      this.isNewProduct = true;
    }
  }

  // * Form Submit
  formSubmit() {
    if (this.data) {
      this.data = {
        id: this.popUpForm.value.id,
        title: this.popUpForm.value.title,
        price: this.popUpForm.value.price,
        brand: this.popUpForm.value.brand,
        category: this.popUpForm.value.category,
        image: this.images[0] ?? this.data.image,
        image_detail_1: this.images[1] ?? this.data.image_detail_1,
        image_detail_2: this.images[2] ?? this.data.image_detail_2,
        description: this.popUpForm.value.description,
        disableEdit: false,
        quantity: 1,
      };
    } else {
      this.data = {
        id: this.popUpForm.value.id,
        title: this.popUpForm.value.title,
        price: this.popUpForm.value.price,
        brand: this.popUpForm.value.brand,
        category: this.popUpForm.value.category,
        image: this.images[0] ?? null,
        image_detail_1: this.images[1] ?? null,
        image_detail_2: this.images[2] ?? null,
        description: this.popUpForm.value.description,
        disableEdit: false,
        quantity: 1,
      };
    }
    this.dialogRef.close(this.data);
    console.log(this.popUpForm.controls['title'], 'title field');
    console.log(this.popUpForm.controls['description'], 'description field');
  }

  // * File Upload Change
  fileInputChange(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      let file = event.target.files[i];
      this.images.push(URL.createObjectURL(file));
    }
  }

  getInputErrors(input: any): any {
    if (input.hasError('required')) {
      return 'The Field Is Required';
    } else if (
      input.hasError('minlength') &&
      input.errors.minlength.requiredLength === 5
    ) {
      return 'The Title Field Most Contain Minimum 5 symbols';
    } else if (
      input.hasError('minlength') &&
      input.errors.minlength.requiredLength === 10
    ) {
      return 'The Description Field Most Contain Minimum 10 symbols';
    }
  }

  // * Allow or Not Submiting Form
  allowSubmit() {
    if (this.popUpForm.status === 'VALID') {
      this.disabledBtn = false;
    } else {
      this.disabledBtn = true;
    }
  }

  // * Cancel Adding Or Updating(Close Pop Up)
  cancel() {
    this.dialogRef.close(null);
  }
}
