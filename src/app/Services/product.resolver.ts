import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { EMPTY, Observable, catchError } from 'rxjs';
import { IProducts } from '../Models/IProducts';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root',
})
export class ProductResolver implements Resolve<IProducts> {
  constructor(
    private productService: ProductsService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
      return this.productService.getProductDetail(route.params?.['id']).pipe(
        catchError(() => {
          this.router.navigate(['products']);
          return EMPTY
        })
      )
  }
  
}
