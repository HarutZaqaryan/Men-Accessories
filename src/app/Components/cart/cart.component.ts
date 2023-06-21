import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
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
  private cartSubscription: Subscription;
  public displayedColumns: string[] = [
    'image',
    'name',
    'price',
    'brand',
    'category',
    'description',
    'actions',
    'total-price',
  ];
  public dataSource: MatTableDataSource<IProducts>;
  public cart: IProducts[] = [];
  public emptyCart: boolean = false;
  public totalPrice: number = 0;
  public isLoaded: boolean = false;
  public color: ThemePalette = 'primary';
  public mode: ProgressSpinnerMode = 'indeterminate';
  public _value = 50;
  public horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  public verticalPosition: MatSnackBarVerticalPosition = 'top';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private cartService: CartService,
    public _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getCartProducts();
    this.getTotalPrice();
  }

  // * Show Notification(snackar)
  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['mat-warn'],
    });
  }

  // * Get Products From Cart
  getCartProducts(): void {
    this.totalPrice = 0;
    this.cartSubscription = this.cartService
      .getCartProducts()
      .subscribe((res) => {
        this.cart = res;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.getTotalPrice();
        setTimeout(() => {
          this.isLoaded = true;
          if (this.cart.length > 0 && this.isLoaded) {
            this.emptyCart = false;
          } else {
            this.emptyCart = true;
          }
        }, 2000);
      });
  }

  // * Filter Products
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  // * Decrement product quantity
  decrementQuantity(product: IProducts) {
    if (product.quantity === 1) {
      this.deleteProductFromCart(product);
    } else {
      product.quantity! -= 1;
      product.totalPrice! = product.quantity! * product.price;
      this.cartService.updateInCart(product).subscribe((data) => {
        console.log('Product quantity has been updated in cart');
      });
      this.getTotalPrice();
    }
  }

  // * Increment product quantity
  incrementQuantity(product: IProducts) {
    product.quantity! += 1;
    product.totalPrice! = product.quantity! * product.price;
    this.cartService.updateInCart(product).subscribe((data) => {
      console.log('Product quantity has been updated in cart');
    });
    this.getTotalPrice();
  }

  // * Delete Product From Cart
  deleteProductFromCart(product: IProducts, action?: string) {
    this.totalPrice = 0;
    this.cartService.deleteProductFromCart(product.id).subscribe((data) => {
      this.cart = this.cart.filter((item) => item.id !== product.id);
      this.dataSource = new MatTableDataSource(this.cart);
      this.dataSource.paginator = this.paginator;
      if (this.cart.length === 0) {
        this.emptyCart = true;
      }
      this.getTotalPrice();

      if (action === 'buy') {
        this.openSnackBar(`${product.title} Has Been Buyed From Cart`);
      }

      if (action === 'delete') {
        this.openSnackBar(`${product.title} Has Been Deleted From Cart`);
      }
    });
  }

  // * Buy Product From Cart
  buyProductFromCart(product: IProducts) {
    this.deleteProductFromCart(product, 'buy');
  }

  // * Get Total Price
  getTotalPrice() {
    this.totalPrice = 0;
    for (let i = 0; i < this.cart.length; i++) {
      this.totalPrice += this.cart[i].totalPrice!;
    }
  }

  // * Delete All Products From Cart
  cleanCart() {
    this.cart = [];
    this.dataSource = new MatTableDataSource(this.cart);
    this.emptyCart = true;
    this.openSnackBar('All Products Has Been Deleted From Cart');

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

  // * Buy All Products From Cart
  buyAllProducts() {
    this.openSnackBar('All Products Has Been Buyed From Cart');
  }

  // * Destroy
  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
