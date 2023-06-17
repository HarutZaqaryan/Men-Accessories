import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { ProductResolver } from './Services/product.resolver';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  // ! Lazy Routing To Products Page
  {
    path: 'products',
    loadChildren: () =>
      import('./Components/products/products.module').then(
        (m) => m.ProductsModule
      ),
  },
  // ! Lazy Routing To Products Detail Page
  {
    path: 'product/:id',
    loadChildren: () =>
      import('./Components/product-details/product-details.module').then(
        (m) => m.ProductDetailsModule
      ),
    resolve: { data: ProductResolver },
  },
  // ! Lazy Routing To Cart Page
  {
    path: 'cart',
    loadChildren: () =>
      import('./Components/cart/cart.module').then((m) => m.CartModule),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
