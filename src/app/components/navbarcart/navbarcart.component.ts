import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from 'src/app/services/carritoService/carrito.service';

@Component({
    selector: 'app-navbarcart',
    templateUrl: './navbarcart.component.html',
    styleUrls: ['./navbarcart.component.css'],
    standalone: false
})
export class NavbarcartComponent {
  viewCart: boolean = false;
  myCart$ = this.cartService.myCart$;

  constructor(private cartService: CarritoService, private router: Router) { }

  onToggleCart() {
    this.viewCart = !this.viewCart

  };

  atras() {
    this.router.navigateByUrl('/perfil');
  }
}
