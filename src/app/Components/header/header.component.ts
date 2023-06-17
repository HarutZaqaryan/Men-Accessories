import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/Services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  cartItemCount:number = 0;

  constructor(private cartService:CartService){}

  ngOnInit(): void {
    this.cartService.getCartList().subscribe(res => {
      this.cartItemCount = res.length
      console.log(res.length);
    })
  }
}
