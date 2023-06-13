import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsComponent } from './product-details.component';
import { RouterModule } from '@angular/router';
import { ProductDetailRoutingModule } from './product-detail-routing.module';
import { MaterialModule } from 'src/app/Shared/material.module';
@NgModule({
  declarations: [ProductDetailsComponent],
  imports: [
    CommonModule,
    RouterModule,
    ProductDetailRoutingModule,
    MaterialModule
  ],
  exports: [ProductDetailsComponent],
})
export class ProductDetailsModule {}
