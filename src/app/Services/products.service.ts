import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProducts } from '../Models/IProducts';
import { catchError, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  productsUrl: string = 'http://localhost:3000/products';

  constructor(private http:HttpClient) {}

  // * Get All Products From Server
  getAllProducts() {
    return this.http.get<IProducts[]>(this.productsUrl).pipe(
      catchError((err) => {
        return throwError(err)
      }),
      retry(2)
    )
  }

  // * Get Individual Product Details
  getProductDetail(id:number) {
    return this.http.get<IProducts[]>(`${this.productsUrl}/${id}`).pipe(
      catchError((err) => {
        return throwError(err)
      }),
      retry(2)
    );
  }

  // * Add New Product & Post To Server
  addNewProduct(product:IProducts) {
    return this.http.post<IProducts>(this.productsUrl,product).pipe(
      catchError((err) => {
        return throwError(err)
      }),
      retry(2)
    );
  }  

  // * Edit Product In Server
  editProduct(product:IProducts) {
    return this.http.put<IProducts>(`${this.productsUrl}/${product.id}`,product).pipe(
      catchError((err) => {
        return throwError(err)
      }),
      retry(2)
    );
  }

  // * Delete Product In Server
  deleteProduct(id:number) {
    return this.http.delete<IProducts>(`${this.productsUrl}/${id}`).pipe(
      catchError((err) => {
        return throwError(err)
      }),
      retry(2)
    );
  }
}
