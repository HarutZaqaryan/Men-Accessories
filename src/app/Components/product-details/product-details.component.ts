import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProducts } from 'src/app/Models/IProducts';
import { PopupComponent } from '../popup/popup.component';
import { CartService } from 'src/app/Services/cart.service';
import { ProductsService } from 'src/app/Services/products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  requestedProductId: number = 0;
  productSubscription: Subscription;
  products: IProducts[] = [];
  product: IProducts;
  images: any;
  currentIndex: number = 0;
  timeoutId?: number;
  cartSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    public dialog: MatDialog,
    private productService: ProductsService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.getProductDetail();
    this.resetTimer();
  }

  openDialog(product?:IProducts) {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '455px',
      height: '520px',
      data:product
    });

    dialogRef.afterClosed().subscribe((data) => {
        if(data && data.id) {
          this.editProduct(data);
        }
    });
  }

  getAllProducts() {
    this.productSubscription = this.productService
      .getAllProducts()
      .subscribe((res) => {
        this.products = res;
      });
  }

  getProductDetail() {
    this.productSubscription = this.route.data.subscribe((res) => {
      this.product = res['data'];
      this.images = [
        { url: this.product?.image_detail_1, title: 'detail-1' },
        { url: this.product?.image_detail_2, title: 'detail-2' },
      ];
      console.log(this.product);
    });
  }

  resetTimer() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
    this.timeoutId = window.setTimeout(() => this.goToNext(), 5000);
  }

  goToPrevious(): void {
    const isFirstSlide = this.currentIndex === 0;
    const newIndex = isFirstSlide
      ? this.images.length - 1
      : this.currentIndex - 1;

    this.resetTimer();
    this.currentIndex = newIndex;
  }

  goToNext(): void {
    const isLastSlide = this.currentIndex === this.images.length - 1;
    const newIndex = isLastSlide ? 0 : this.currentIndex + 1;

    this.resetTimer();
    this.currentIndex = newIndex;
  }

  goToSlide(slideIndex: number): void {
    this.resetTimer();
    this.currentIndex = slideIndex;
  }

  getCurrentSlideUrl() {
    return this.images[this.currentIndex].url;
  }

  addToCart(product: IProducts) {
    this.cartSubscription = this.cartService
      .addToCart(product)
      .subscribe((res) => {
        console.log(res, 'successfully');
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
      this.product = data
    });
  }

  deleteProduct(id:number) {
    this.productService.deleteProduct(id).subscribe(data => {
      this.products = this.products.filter((product) => product.id !== id )
      this.router.navigate(['/','products']);
      console.log('delete');
      
    })
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
