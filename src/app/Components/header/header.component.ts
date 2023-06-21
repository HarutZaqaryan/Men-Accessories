import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { CartService } from 'src/app/Services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public cartItemCount: number = 0;
  public isNavigated: boolean = false;
  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.getCartList().subscribe((res) => {
      this.cartItemCount = res.length;
    });
  }

  onNavigate() {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.isNavigated = true;
      }
    });
  }
}
