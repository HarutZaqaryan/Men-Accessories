import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProducts } from 'src/app/Models/IProducts';
import { PopupComponent } from '../popup/popup.component';
import { CartService } from 'src/app/Services/cart.service';
import { ProductsService } from 'src/app/Services/products.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private productSubscription: Subscription;
  private cartSubscription: Subscription;
  public requestedProductId: number = 0;
  public products: IProducts[] = [];
  public cart: IProducts[] = [];
  public product: IProducts;
  public images: any;
  public currentIndex: number = 0;
  public timeoutId?: number;
  public verticalPosition: MatSnackBarVerticalPosition = 'top';
  public horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  public hasServerError: boolean = false;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductsService,
    private cartService: CartService,
    public _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getProductDetail();
    this.getCartProducts();
    this.resetTimer();
  }

  // * Open Pop Up
  openDialog(product?: IProducts) {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '455px',
      height: '520px',
      data: product,
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.id) {
        this.editProduct(data);
      }
    });
  }

  // * Open Snack Bar
  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  // * Get All Products
  getAllProducts() {
    this.productSubscription = this.productService.getAllProducts().subscribe(
      (res) => {
        this.products = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // * Get Individual Product With ID
  getProductDetail() {
    this.productSubscription = this.route.data.subscribe(
      (res) => {
        this.product = res['data'];
        this.images = [
          {
            url:
              this.product?.image_detail_1 ??
              '../../../assets/Images/image-not-found.png',
            title: 'detail-1',
          },
          {
            url:
              this.product?.image_detail_2 ??
              '../../../assets/Images/image-not-found.png',
            title: 'detail-2',
          },
        ];
      },
      (err) => {
        console.log(err);
      }
    );
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

  // * Reset Timer (Gallery)
  resetTimer() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
    this.timeoutId = window.setTimeout(() => this.goToNext(), 5000);
  }

  // * Previous Image Button
  goToPrevious(): void {
    const isFirstSlide = this.currentIndex === 0;
    const newIndex = isFirstSlide
      ? this.images.length - 1
      : this.currentIndex - 1;

    this.resetTimer();
    this.currentIndex = newIndex;
  }

  // * Next Image Button
  goToNext(): void {
    const isLastSlide = this.currentIndex === this.images.length - 1;
    const newIndex = isLastSlide ? 0 : this.currentIndex + 1;

    this.resetTimer();
    this.currentIndex = newIndex;
  }

  // * Slide Gallery
  goToSlide(slideIndex: number): void {
    this.resetTimer();
    this.currentIndex = slideIndex;
  }

  // * Get Current Slide Url
  getCurrentSlideUrl() {
    return this.images[this.currentIndex].url;
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
        this.openSnackBar(
          'This product is already in your cart, its quantity has been increased'
        );
      } else {
        this.cartService.addToCart(product).subscribe(
          (data) => {
            this.cart.push(data);
            this.openSnackBar('Product added to cart');
          },
          (err) => {
            console.log(err);
            this.openSnackBar('ADDING TO CART FAILED. Something is wrong');
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
          this.openSnackBar('ADDING TO CART FAILED. Something is wrong');
        }
      );
    }
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
        this.product = data;
        this.openSnackBar('Product has been edited');
      },
      (err) => {
        this.openSnackBar('EDITING PRODUCT IS FAILED. Something is wrong');
      }
    );
    if (this.cart.length > 0) {
      this.cartService.updateInCart(product).subscribe(
        (data) => {},
        (err) => {
          console.log(err);
          this.openSnackBar('EDITING PRODUCT IS FAILED. Something is wrong');
        }
      );
    }
  }

  // * Update Product In Cart
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

  // * Delete Product
  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe((data) => {
      this.products = this.products.filter((product) => product.id !== id);
      this.router.navigate(['/', 'products']);
      this.openSnackBar('Product has been deleted');
    });
    this.cartService.deleteProductFromCart(id).subscribe(
      (data) => {},
      (err) => {
        console.log(err);
        this.openSnackBar('DELETING PRODUCT IS FAILED. Something is wrong');
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
