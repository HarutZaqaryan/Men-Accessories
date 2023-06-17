import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProducts } from '../Models/IProducts';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  productsUrl: string = 'http://localhost:3000/products';

  constructor(private http:HttpClient) {}

  // * Get All Products From Server
  getAllProducts() {
    return this.http.get<IProducts[]>(this.productsUrl);
  }

  // * Get Individual Product Details
  getProductDetail(id:number) {
    return this.http.get<IProducts[]>(`${this.productsUrl}/${id}`);
  }

  // * Add New Product & Post To Server
  addNewProduct(product:IProducts) {
    return this.http.post<IProducts>(this.productsUrl,product);
  }  

  // * Edit Product In Server
  editProduct(product:IProducts) {
    return this.http.put<IProducts>(`${this.productsUrl}/${product.id}`,product);
  }

  // * Delete Product In Server
  deleteProduct(id:number) {
    return this.http.delete<IProducts>(`${this.productsUrl}/${id}`);
  }
}
