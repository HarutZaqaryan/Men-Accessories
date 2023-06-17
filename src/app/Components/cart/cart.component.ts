import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { IProducts } from 'src/app/Models/IProducts';
import { CartService } from 'src/app/Services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'image',
    'name',
    'price',
    'brand',
    'category',
    'description',
    'actions',
    'total-price',
  ];
  dataSource: MatTableDataSource<IProducts>;
  cartSubscription: Subscription;
  cart: IProducts[] = [];
  emptyCart: boolean = true;
  totalPrice:number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.getCartProducts();
    this.getTotalPrice();
  }

  getCartProducts(): void {
    this.totalPrice = 0
    this.cartSubscription = this.cartService
      .getCartProducts()
      .subscribe((res) => {
        this.cart = res;
        this.dataSource = new MatTableDataSource(res);
        if (this.cart.length > 0) {
          this.emptyCart = false;
        } else {
          this.emptyCart = true;
        }
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.getTotalPrice();
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  decrementQuantity(product: IProducts) {
    if (product.quantity === 1) {
      this.deleteProductFromCart(product);
    } else {
      product.quantity! -= 1;
      product.totalPrice! = product.quantity! * product.price;
      this.cartService.updateInCart(product).subscribe((data) => {
        console.log('Product quantity has been updated in cart');
      });
      this.getTotalPrice()
    }
  }

  incrementQuantity(product: IProducts) {
    product.quantity! += 1;
    product.totalPrice! = product.quantity! * product.price;
    this.cartService.updateInCart(product).subscribe((data) => {
      console.log('Product quantity has been updated in cart');
    });
    this.getTotalPrice()
  }

  deleteProductFromCart(product: IProducts) {
    this.totalPrice = 0;
    this.cartService.deleteProductFromCart(product.id).subscribe((data) => {
      this.cart = this.cart.filter((item) => item.id !== product.id);
      this.dataSource = new MatTableDataSource(this.cart);
      this.dataSource.paginator = this.paginator;
      if (this.cart.length === 0) {
        this.emptyCart = true;
      }
      this.getTotalPrice()
      console.log('product has been deleted from cart');
    });
  }

  buyProductFromCart(product: IProducts) {
    console.log(`${product.title} has been buyed from cart`);
    this.deleteProductFromCart(product);
  }

  getTotalPrice() {
    this.totalPrice = 0
    for(let i = 0; i< this.cart.length; i++) {
      this.totalPrice += this.cart[i].totalPrice!
    }
  }

  cleanCart() {
    this.cart = [];
    this.dataSource = new MatTableDataSource(this.cart);
    this.emptyCart = true;

    // ! return this.http.delete('http://localhost:3000/cart')
    // this.cartService.deleteAllProductsFromCart().subscribe((data) => {
    //   console.log('cart is cleaned');
    // });

    // ! return this.http.delete<IProducts>(`${this.cartUrl}/${id}`);
    // for (let i = 0; i <= this.cart.length; i++) {
    //   this.cartService
    //     .deleteProductFromCart(this.cart[i].id)
    //     .subscribe((data) => {
    //       console.log('cart is cleaned');
    //     });
    // }

    // this.cart.map((product) => {
    //   this.cartService.deleteProductFromCart(product.id).subscribe((data) => {
    //     console.log('cart is cleaned');
    //   });
    // });
  }

  buyAllProducts() {
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
