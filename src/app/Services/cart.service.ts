import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProducts } from '../Models/IProducts';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartUrl: string = 'http://localhost:3000/cart';
  cart: IProducts[] = [];
  cartList = new BehaviorSubject<IProducts[]>([]);

  constructor(private http: HttpClient) {}

  getCartProducts() {
    return this.http.get<IProducts[]>(this.cartUrl);
  }

  addToCart(product: IProducts) {
    this.cart.push(product);
    this.cartList.next(this.cart);
    return this.http.post<IProducts>(this.cartUrl, product);
  }

  updateInCart(product: IProducts) {
    return this.http.put<IProducts>(`${this.cartUrl}/${product.id}`, product);
  }

  deleteProductFromCart(id: number) {
    this.cart = this.cart.filter((item) => item.id !== id);
    this.cartList.next(this.cart);
    return this.http.delete<IProducts>(`${this.cartUrl}/${id}`);
  }

  deleteAllProductsFromCart() {
    this.cart = [];
    this.cartList.next(this.cart);
    return this.http.delete(this.cartUrl);
  }

  getCartList(){
    return this.cartList.asObservable();
  }

}
