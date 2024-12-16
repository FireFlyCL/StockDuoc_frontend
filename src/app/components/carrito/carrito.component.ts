import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { CarritoService } from 'src/app/services/carritoService/carrito.service';
import { ProductoService } from 'src/app/services/productoservice/producto.service';
import { AddsolicitudComponent } from '../addsolicitud/addsolicitud.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
  myCart$ = this.cartService.myCart$;
  myCartWithDetails$: Observable<any[]>;
  viewCart: boolean = false;

  constructor(private cartService: CarritoService, private productoService: ProductoService,
    public dialog: MatDialog, private router: Router) {



    this.myCartWithDetails$ = this.cartService.myCart$.pipe(
      switchMap(cartItems => {
        // Si el carrito está vacío, devuelve un array vacío.
        if (cartItems.length === 0) {
          return of([]);
        }

        // Mapea cada elemento del carrito a una petición HTTP para obtener los detalles del producto.
        const productDetailsRequests = cartItems.map(cartItem =>
          this.productoService.getProductoById(cartItem.productoId.producto.id_producto).pipe(
            map(producto => ({
              ...cartItem,
              producto: producto
            }))
          ), tap(data => console.log('Datos recibidos:', data))
        );
        // Usa forkJoin para ejecutar todas las peticiones HTTP en paralelo y combinar los resultados.
        return forkJoin(productDetailsRequests);
      })
    );
  }

  updateUnits(operation: string, id: number, stockActual: number) {
    console.log(operation + " | " + id);

    this.cartService.updateProduct(id, operation, stockActual);
  }

  totalProduct(price: number, units: number) {
    return price * units
  }
  deleteProduct(id: number) {
    this.cartService.deleteProduct(id);
  }
  totalCart() {
    const result = this.cartService.totalCart();
    return result;
  }

  onConfirmarProductosClick() {
    this.myCartWithDetails$.subscribe(cart => {
      this.confirmarSolProd(cart);
    });
  }



  confirmarSolProd(solProd: any[]) {
    console.log(solProd);
    const dialogRef = this.dialog.open(AddsolicitudComponent, {
      width: '50%',
      data: solProd
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de editar producto se ha cerrado');
      // Actualizar la lista de productos si es necesario
      this.router.navigateByUrl('/perfil');

    });
  }
}

