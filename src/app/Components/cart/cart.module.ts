import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { CartRoutingModule } from './cart-routing.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/Shared/material.module';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [CartComponent],
  imports: [
    CommonModule,
    RouterModule,
    CartRoutingModule,
    MaterialModule,
    MatPaginatorModule,
  ],
  exports: [CartComponent],
})
export class CartModule {}
