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

  // constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['mat-warn'],
    });
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.getCartProducts();
  }

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

  scrollToTop() {
    this.document.body.scrollIntoView({ behavior: 'smooth' });
    this.windowScrolled = false;
  }

  getAllProducts() {
    this.productSubscription = this.productService
      .getAllProducts()
      .subscribe((res) => {
        this.products = res;
        this.products.reverse();
        this.products_reserve = res;
      });
  }

  search(searchInput: any, filterInput: any) {
    this.products = this.products_reserve.reverse();

    if (searchInput.value !== '') {
      this.products = this.products.filter((item) =>
        item.title
          .trim()
          .toLowerCase()
          .includes(searchInput.value.trim().toLowerCase())
      );
    }

    if (filterInput.value) {
      this.products = this.products.filter(
        (item) =>
          item.category.toLowerCase() === filterInput.value.toLowerCase()
      );
    }

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

  addNewProduct(product: IProducts) {
    this.productService.addNewProduct(product).subscribe((data) => {
      // this.products.unshift(data);
      this.products.push(data);
      this.products.reverse();
    });
  }

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

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe((data) => {
      this.products = this.products.filter((product) => product.id !== id);
    });
  }

  getCartProducts() {
    this.cartSubscription = this.cartService
      .getCartProducts()
      .subscribe((data) => {
        this.cart = data;
      });
  }

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
