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

  // * Get PRoducts From Cart
  getCartProducts() {
    return this.http.get<IProducts[]>(this.cartUrl);
  }

  // * Add Product To Cart
  addToCart(product: IProducts) {
    this.cart.push(product);
    this.cartList.next(this.cart);
    return this.http.post<IProducts>(this.cartUrl, product);
  }

  // * Update Product In Cart
  updateInCart(product: IProducts) {
    return this.http.put<IProducts>(`${this.cartUrl}/${product.id}`, product);
  }

  // * Delete Product From Cart
  deleteProductFromCart(id: number) {
    this.cart = this.cart.filter((item) => item.id !== id);
    this.cartList.next(this.cart);
    return this.http.delete<IProducts>(`${this.cartUrl}/${id}`);
  }

  // * Delete All Products From Cart
  deleteAllProductsFromCart() {
    this.cart = [];
    this.cartList.next(this.cart);
    return this.http.delete(this.cartUrl);
  }

  // * Get Cart Items
  getCartList(){
    return this.cartList.asObservable();
  }

}
