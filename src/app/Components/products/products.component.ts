import { DOCUMENT } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { IProducts } from 'src/app/Models/IProducts';
import { ProductsService } from 'src/app/Services/products.service';
import { PopupComponent } from '../popup/popup.component';
import { CartService } from 'src/app/Services/cart.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  private productSubscription?: Subscription;
  private cartSubscription: Subscription;
  public windowScrolled: boolean = false;
  public value: string = 'Search';
  public products: IProducts[] = [];
  public products_reserve: IProducts[] = [];
  public cart: IProducts[] = [];
  public searchInputValue: string = '';
  public filterValue: string = '';
  public noData: boolean = false;
  public isLoaded: boolean = false;
  public color: ThemePalette = 'primary';
  public mode: ProgressSpinnerMode = 'indeterminate';
  public _value = 50;
  public horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  public verticalPosition: MatSnackBarVerticalPosition = 'top';
  public hasServerError: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private productService: ProductsService,
    private cartService: CartService,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.getCartProducts();
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

  // * Listener For Window(scroll)
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop > 100
    ) {
      this.windowScrolled = true;
    } else if (
      (this.windowScrolled && window.scrollY) ||
      document.documentElement.scrollTop ||
      document.body.scrollTop < 10
    ) {
      this.windowScrolled = false;
    }
  }

  // * Scroll To Top
  scrollToTop() {
    this.document.body.scrollIntoView({ behavior: 'smooth' });
    this.windowScrolled = false;
  }

  // * Get All Products
  getAllProducts() {
    setTimeout(() => {
      this.productSubscription = this.productService.getAllProducts().subscribe(
        (res) => {
          this.products = res;
          this.products.reverse();
          this.products_reserve = res;
          this.isLoaded = true;
        },
        (err) => {
          this.hasServerError = true;
          console.log('HTTP Error', err);
        }
      );
    }, 1000);
  }

  // * Search for products
  search(searchInput: any, filterInput: any) {
    this.products = this.products_reserve.reverse();

    // When Searching with name
    if (searchInput.value !== '') {
      this.products = this.products.filter((item) =>
        item.title
          .trim()
          .toLowerCase()
          .includes(searchInput.value.trim().toLowerCase())
      ).reverse();
    }

    // When searching with category
    if (filterInput.value) {
      this.products = this.products.filter(
        (item) =>
          item.category.toLowerCase() === filterInput.value.toLowerCase()
      ).reverse();
    }

    // When searching & filtering together
    if (searchInput.value !== '' && filterInput.value) {
      this.products = this.products.filter(
        (item) =>
          item.title
            .trim()
            .toLowerCase()
            .includes(searchInput.value.trim().toLowerCase()) &&
          item.category.toLowerCase() === filterInput.value.toLowerCase()
      ).reverse();
    }

    if(searchInput.value === '' && !filterInput.value) {
      this.products = this.products_reserve.reverse();
      console.log('reserve reverse');
    }

    if (this.products.length < 1) {
      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  // * Open Pop Up
  openDialog(product?: IProducts) {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '470px',
      disableClose: true,
      data: product,
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        if (data && data.id) {
          this.editProduct(data);
          console.log(data);
        } else {
          this.addNewProduct(data);
        }
      }
    });
  }

  // * Add New Product
  addNewProduct(product: IProducts) {
    this.productService.addNewProduct(product).subscribe(
      (data) => {
        this.products.unshift(data);
        this.openSnackBar('New Product has been added');
      },
      (err) => {
        console.log(err);
        this.openSnackBar('ADDING PRODUCT IS FAILED. Something is wrong');
      }
    );
  }

  // * Edit Product
  editProduct(product: IProducts) {
    this.productService.editProduct(product).subscribe(
      (data) => {
        this.products = this.products.map((product) => {
          if (product.id === data.id) {
            return data;
          } else {
            return product;
          }
        });
        this.openSnackBar('Product has been edited');
      },
      (err) => {
        console.log(err);
        this.openSnackBar('PRODUCT NOT EDITED. Something is wrong');
      }
    );

    if (this.cart.length > 0) {
      this.cartService.updateInCart(product).subscribe((data) => {});
    }
  }

  // * Delete Product
  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(
      (data) => {
        this.products = this.products.filter((product) => product.id !== id);
        this.openSnackBar('Product has been deleted');
      },
      (err) => {
        console.log(err);
      }
    );
    this.cartService.deleteProductFromCart(id).subscribe((data) => {});
  }

  // * Get Products From Cart
  getCartProducts() {
    this.cartSubscription = this.cartService.getCartProducts().subscribe(
      (data) => {
        this.cart = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // * Add Product To Cart
  addToCart(product: IProducts) {
    product.quantity = 1;
    product.totalPrice = product.price;
    let foundItem;

    if (this.cart.length > 0) {
      foundItem = this.cart.find((item) => item.id === product.id);

      if (foundItem) {
        this.updateInCart(foundItem);
        this.openSnackBar('This product is already in your cart, its quantity has been increased');
      } else {
        this.cartService.addToCart(product).subscribe(
          (data) => {
            this.cart.push(data);
            this.openSnackBar('Product added to your cart');
          },
          (err) => {
            console.log(err);
            this.openSnackBar('ADDING TO CART FAILED, Something is wrong');
          }
        );
      }
    } else {
      this.cartService.addToCart(product).subscribe(
        (data) => {
          this.cart.push(data);
          this.openSnackBar('Product added to cart');
        },
        (err) => {
          console.log(err);
          this.openSnackBar('ADDING TO CART FAILED, Something is wrong');
        }
      );
    }
  }

  // * Update Product Quantity In Cart
  updateInCart(product: IProducts) {
    product.quantity! += 1;
    product.totalPrice! = product.quantity! * product.price;
    this.cartService.updateInCart(product).subscribe(
      (data) => {},
      (err) => {
        console.log(err);
      }
    );
  }

  // * Buy Product
  buyProduct(product: IProducts) {
    this.openSnackBar(`${product.title} Has been buyed`);
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
