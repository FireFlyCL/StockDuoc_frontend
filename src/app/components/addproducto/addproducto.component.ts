import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
} from '@angular/material-moment-adapter';
import {
  MAT_DATE_LOCALE,
  DateAdapter,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { CarritoService } from 'src/app/services/carritoService/carrito.service';
import { ProductoService } from 'src/app/services/productoservice/producto.service';
import { StockService } from 'src/app/services/stock/stock.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-addproducto',
  templateUrl: './addproducto.component.html',
  styleUrls: ['./addproducto.component.css'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'es-CL' },
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  standalone: false,
})
export class AddproductoComponent {
  solicitudForm!: FormGroup;
  isLoading = false; // Asumiendo que tienes una variable para manejar la carga
  minDate!: Date;
  products: any[] = [];
  seleccionados: Array<[number, number]> = [];
  horas: string[] = [];
  productosSinStock$: Observable<number[]>;
  // 🔎 Filtro y paginación
  searchTerm: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 6;

  productosFiltrados: StockProducto[] = [];
  productosPaginados: StockProducto[] = [];

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private router: Router,
    private carritoService: CarritoService,
    private snackBar: MatSnackBar,
    private stockService: StockService
  ) {
    this.minDate = new Date(); // Obtener la fecha actual
    this.minDate.setDate(this.minDate.getDate() + 2);
    this.productosSinStock$ = carritoService.getProductosSinStock();
  } // Añadir 2 días

  ngOnInit(): void {
    this.inicializarHoras();
    this.obtenerProductos();
    this.solicitudForm = this.fb.group({
      area: [''],
      fechaEntrega: ['', Validators.required],
      fechaRegreso: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaTermino: ['', Validators.required],
      seccion: ['', Validators.required],
      comentario: [''],
    });

    this.filtrarProductos(); // <- aplicar filtro y paginación inicial
  }

  obtenerProductos(): void {
    let areaId = 1;
    this.stockService.getStockByArea(areaId).subscribe((data: any) => {
      this.products = data;
      this.filtrarProductos();
      console.log(this.products);
    });
  }

  async addToCart(producto: StockProducto) {
    if (!producto || producto.stock < 1) {
      this.snackBar.open('Producto sin stock disponible', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
      return;
    }

    let solProd: SolicitudProducto = {
      cantidad: 1,
      productoId: producto,
      descripcion: '',
      observacion: '',
      solicitudId: 0,
    };

    let res = await this.carritoService.addProduct(solProd);

    if (!res) {
      this.carritoService.actualizarProductosSinStock(
        solProd.productoId.producto.id_producto,
        true
      );
      this.snackBar.open(
        'No hay stock suficiente para este producto',
        'Cerrar',
        {
          duration: 3000,
          panelClass: ['snackbar-error'],
        }
      );
      return false;
    } else {
      this.carritoService.actualizarProductosSinStock(
        solProd.productoId.producto.id_producto,
        false
      );
      this.snackBar.open('Producto agregado al carrito', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-success'],
      });
      return true;
    }
  }

  atras() {
    this.router.navigateByUrl('/perfil');
  }

  inicializarHoras() {
    // Llena el array con horas (por ejemplo, de 0 a 23)
    for (let i = 9; i < 21; i++) {
      this.horas.push(i.toString().padStart(2, '0') + ':00'); // Añade ceros a la izquierda si es necesario
    }
  }

  toggleSelection(productId: number): void {
    //console.log(this.getCantidad(productId));
    const selectedProductIndex = this.seleccionados.some(
      ([id, cant]) => id === productId && cant === this.getCantidad(productId)
    );
    //console.log(selectedProductIndex);
    if (selectedProductIndex) {
      this.seleccionados = this.seleccionados.filter(
        ([id, cant]) =>
          !(id === productId && cant === this.getCantidad(productId))
      );
    } else {
      this.seleccionados.push([productId, 1]);
    }
    //console.log(this.seleccionados);
  }

  getCantidad(productId: number): number {
    const selectedProduct = this.seleccionados.find(
      (product) => product[0] === productId
    );
    return selectedProduct ? selectedProduct[1] : 1;
  }

  getMaximaCantidad(productId: number): number {
    const selectedProduct = this.products.find(
      (product) => product[0] === productId
    );
    return selectedProduct ? selectedProduct[4] : 0;
  }

  updateCantidad(productId: number, event: any): void {
    const cantidad = parseInt(event.target.value, 10);
    const selectedProductIndex = this.seleccionados.findIndex(
      (product) => product[0] === productId
    );
    if (selectedProductIndex !== -1) {
      this.seleccionados[selectedProductIndex][1] = cantidad;
    }
    //console.log(this.seleccionados);
  }

  filtrarProductos() {
    const keyword = this.searchTerm.toLowerCase().trim();
    this.productosFiltrados = this.products.filter(
      (p) =>
        p.producto.nombre.toLowerCase().includes(keyword) ||
        p.producto.modelo?.toLowerCase().includes(keyword) ||
        p.producto.marca?.toLowerCase().includes(keyword) ||
        p.producto.descripcion?.toLowerCase().includes(keyword)
    );

    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  actualizarPaginacion() {
    const start = (this.paginaActual - 1) * this.elementosPorPagina;
    const end = start + this.elementosPorPagina;
    this.productosPaginados = this.productosFiltrados.slice(start, end);
  }

  get totalPaginas(): number {
    return Math.ceil(this.productosFiltrados.length / this.elementosPorPagina);
  }

  anteriorPagina() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPaginacion();
    }
  }

  siguientePagina() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPaginacion();
    }
  }
}

export interface Area {
  id_area: number;
  nombre_area: string;
  deleteAt: null | Date; // Utiliza 'Date' si 'deleteAt' es una fecha, de lo contrario, puedes usar 'any'
}

export interface StockProducto {
  producto: Producto;
  stock: number;
}

export interface Producto {
  id_producto: number;
  nombre: string;
  marca: string;
  modelo: string;
  stock_critico: number;
  imagen: string;
  imagenUrl: string;
  area: Area;
  deleteAt: null | Date; // Igual que en la interfaz Area
  descripcion: string;
}

export interface SolicitudProducto {
  cantidad: number;
  descripcion: string;
  productoId: StockProducto;
  solicitudId: number;
  observacion: string;
}
