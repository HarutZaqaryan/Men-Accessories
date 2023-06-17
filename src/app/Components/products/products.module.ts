import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { RouterModule } from '@angular/router';
import { ProductsRoutingModule } from './products-routing.module';
import { MaterialModule } from 'src/app/Shared/material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProductsComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ProductsRoutingModule,
    MaterialModule
  ],
  exports: [ProductsComponent],
})
export class ProductsModule {}
