import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { CarritoService } from 'src/app/services/carritoService/carrito.service';
import { ProductoService } from 'src/app/services/productoservice/producto.service';
import { AddsolicitudComponent } from '../addsolicitud/addsolicitud.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
  standalone: false,
})
export class CarritoComponent {
  myCart$ = this.cartService.myCart$;
  myCartWithDetails$: Observable<any[]>;
  viewCart: boolean = false;
  mostrarCarrito: boolean = false;

  constructor(
    private cartService: CarritoService,
    private productoService: ProductoService,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.myCartWithDetails$ = this.cartService.myCart$.pipe(
      switchMap((cartItems) => {
        // Si el carrito está vacío, devuelve un array vacío.
        if (cartItems.length === 0) {
          return of([]);
        }

        // Mapea cada elemento del carrito a una petición HTTP para obtener los detalles del producto.
        const productDetailsRequests = cartItems.map(
          (cartItem) =>
            this.productoService
              .getProductoById(cartItem.productoId.producto.id_producto)
              .pipe(
                map((producto) => ({
                  ...cartItem,
                  producto: producto,
                }))
              ),
          tap((data) => console.log('Datos recibidos:', data))
        );
        // Usa forkJoin para ejecutar todas las peticiones HTTP en paralelo y combinar los resultados.
        return forkJoin(productDetailsRequests);
      })
    );
  }

  updateUnits(operation: string, id: number, stockActual: number) {
    const result = this.cartService.updateProduct(id, operation, stockActual);

    // 👉 Mostrar mensaje si no hay más stock disponible
    if (operation === 'add' && !result) {
      this.snackBar.open(
        'No hay más stock disponible para este producto.',
        'Cerrar',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-warning'],
        }
      );
    }
  }

  totalProduct(price: number, units: number) {
    return price * units;
  }
  deleteProduct(id: number) {
    this.cartService.deleteProduct(id);
  }
  totalCart() {
    const result = this.cartService.totalCart();
    return result;
  }

  onConfirmarProductosClick() {
    this.myCartWithDetails$.subscribe((cart) => {
      this.confirmarSolProd(cart);
    });
  }

  abrirCarrito(): void {
    this.mostrarCarrito = true;
  }

  cerrarCarrito(): void {
    this.mostrarCarrito = false;
  }

  confirmarSolProd(solProd: any[]) {
    console.log(solProd);
    const dialogRef = this.dialog.open(AddsolicitudComponent, {
      width: '50%',
      data: solProd,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El modal de editar producto se ha cerrado');
      // Actualizar la lista de productos si es necesario-
    });
  }
}
