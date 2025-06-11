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
import { Observable } from 'rxjs';
import { CarritoService } from 'src/app/services/carritoService/carrito.service';
import { ProductoService } from 'src/app/services/productoservice/producto.service';
import { StockService } from 'src/app/services/stock/stock.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-addproducto',
  templateUrl: './addproducto.component.html',
  styleUrls: ['./addproducto.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-CL' },
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
  isLoading = false;
  minDate!: Date;
  products: StockProducto[] = [];               // Array de StockProducto
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
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 2);
    this.productosSinStock$ = carritoService.getProductosSinStock();
  }

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
    const areaId = 1;

    // Usamos `data: any[]` para evitar incompatibilidades de tipo al recibir el JSON
    this.productoService
      .getProductosByAreaIdStock(areaId)
      .subscribe((data: any[]) => {
        // Cada `p` viene con `p.stock_actual`. Lo mapeamos a StockProducto.
        this.products = data.map((p: any) => ({
          producto: p as Producto,
          stock: p.stock_actual,
        }));

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

    const solProd: SolicitudProducto = {
      cantidad: 1,
      productoId: producto,
      descripcion: '',
      observacion: '',
      solicitudId: 0,
    };

    const res = await this.carritoService.addProduct(solProd);

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
    for (let i = 9; i < 21; i++) {
      this.horas.push(i.toString().padStart(2, '0') + ':00');
    }
  }

  toggleSelection(productId: number): void {
    const cantidadActual = this.getCantidad(productId);
    const existe = this.seleccionados.some(
      ([id, cant]) => id === productId && cant === cantidadActual
    );
    if (existe) {
      this.seleccionados = this.seleccionados.filter(
        ([id, cant]) =>
          !(id === productId && cant === cantidadActual)
      );
    } else {
      this.seleccionados.push([productId, 1]);
    }
  }

  getCantidad(productId: number): number {
    const selectedProduct = this.seleccionados.find(
      (product) => product[0] === productId
    );
    return selectedProduct ? selectedProduct[1] : 1;
  }

  getMaximaCantidad(productId: number): number {
    const sel = this.products.find(
      (p) => p.producto.id_producto === productId
    );
    return sel ? sel.stock : 0;
  }

  updateCantidad(productId: number, event: any): void {
    const cantidad = parseInt(event.target.value, 10);
    const idx = this.seleccionados.findIndex(
      (product) => product[0] === productId
    );
    if (idx !== -1) {
      this.seleccionados[idx][1] = cantidad;
    }
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
    return Math.ceil(
      this.productosFiltrados.length / this.elementosPorPagina
    );
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
  deleteAt: null | Date; // Puede quedar así, pues al usar `data: any` no se valida estrictamente
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
  stock_actual: number;    // Lo usaremos para poblar `stock`
  imagen: string;
  imagenUrl: string;
  area: Area;
  deleteAt: null | Date;
  descripcion: string;
}

export interface SolicitudProducto {
  cantidad: number;
  descripcion: string;
  productoId: StockProducto;
  solicitudId: number;
  observacion: string;
}


