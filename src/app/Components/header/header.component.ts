import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/Services/cart.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public cartItemCount: number = 0;
  public isNavigated: boolean = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCartProducts().subscribe((res) => {
      this.cartItemCount = res.length;
    });

    this.cartService.getCartList().subscribe((res) => {
      this.cartItemCount = res.length;
    });
  }

  onNavigate(menuCheckBox:any) {
    if(menuCheckBox) {
      menuCheckBox.checked  = false
    }
  }
}
