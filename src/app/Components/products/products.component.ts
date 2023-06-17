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
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  public windowScrolled: boolean = false;
  public value: string = 'Search';
  public products: IProducts[] = [];
  public products_reserve: IProducts[] = [];
  private productSubscription?: Subscription;
  public searchInputValue: string = '';
  public filterValue: string = '';
  public noData: boolean = false;
  public cart: IProducts[] = [];
  private cartSubscription: Subscription;

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
    this.productSubscription = this.productService
      .getAllProducts()
      .subscribe((res) => {
        this.products = res;
        this.products.reverse();
        this.products_reserve = res;
      });
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
      );
    }

    // When searching with category
    if (filterInput.value) {
      this.products = this.products.filter(
        (item) =>
          item.category.toLowerCase() === filterInput.value.toLowerCase()
      );
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
      );
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
    this.productService.addNewProduct(product).subscribe((data) => {
      this.products.push(data);
      this.products.reverse();
    });
  }

  // * Edit Product
  editProduct(product: IProducts) {
    this.productService.editProduct(product).subscribe((data) => {
      this.products = this.products.map((product) => {
        if (product.id === data.id) {
          return data;
        } else {
          return product;
        }
      });
    });
  }

  // * Delete Product
  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe((data) => {
      this.products = this.products.filter((product) => product.id !== id);
    });
  }

  // * Get Products From Cart
  getCartProducts() {
    this.cartSubscription = this.cartService
      .getCartProducts()
      .subscribe((data) => {
        this.cart = data;
      });
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
      } else {
        this.cartService.addToCart(product).subscribe((data) => {
          this.cart.push(data);
          this.openSnackBar('Product added to cart');
        });
      }
    } else {
      this.cartService.addToCart(product).subscribe((data) => {
        this.cart.push(data);
      });
    }
  }

  // * Update Product In Cart
  updateInCart(product: IProducts) {
    product.quantity! += 1;
    product.totalPrice! = product.quantity! * product.price;
    this.cartService.updateInCart(product).subscribe((data) => {});
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
