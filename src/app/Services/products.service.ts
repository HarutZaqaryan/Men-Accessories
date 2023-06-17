import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProducts } from '../Models/IProducts';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  productsUrl: string = 'http://localhost:3000/products';

  constructor(private http:HttpClient) {}

  getAllProducts() {
    return this.http.get<IProducts[]>(this.productsUrl);
  }

  getProductDetail(id:number) {
    return this.http.get<IProducts[]>(`${this.productsUrl}/${id}`);
  }

  addNewProduct(product:IProducts) {
    return this.http.post<IProducts>(this.productsUrl,product);
  }  

  editProduct(product:IProducts) {
    return this.http.put<IProducts>(`${this.productsUrl}/${product.id}`,product);
  }

  deleteProduct(id:number) {
    return this.http.delete<IProducts>(`${this.productsUrl}/${id}`);
  }
}
