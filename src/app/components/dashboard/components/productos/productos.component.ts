import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductoService } from 'src/app/services/productoservice/producto.service';

// --- Componentes de los Modales ---
import { DetalleProductoComponent } from '../detalle-producto/detalle-producto.component';
import { AgregarProductoModalComponent } from '../agregar-producto-modal/agregar-producto-modal.component';
import { AgregarStockModalComponent } from '../agregar-stock-modal/agregar-stock-modal.component';
import { EditProductModalComponent } from '../edit-product-modal/edit-product-modal.component';
import { ExcelImporterComponent } from 'src/app/excel-importer/excel-importer.component'; // ✨ IMPORTACIÓN CLAVE

// --- Dependencias para el componente standalone ---
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Interfaz para el tipado fuerte de los productos
interface Producto {
  id_producto: number;
  nombre: string;
  marca: string;
  modelo: string;
  stock_critico: number;
  stock_actual: number;
  imagen: string;
  imagenUrl: string;
  area: {
    id_area: number;
    nombre_area: string;
  };
  deleteAt: string | null;
  descripcion: string;
  observaciones: string;
  fungible: boolean;
}


@Component({
  selector: 'app-productos',
    standalone: true, // <-- CONFIRMAMOS QUE ES STANDALONE
  imports: [ // <-- ✨ AÑADIMOS LAS DEPENDENCIAS QUE USA EL HTML
    CommonModule, // Para *ngIf, *ngFor, etc.
    FormsModule,  // Para los inputs y filtros
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  subArea: string = '';

  // Definición de las columnas que mostrará la tabla de Angular Material
  columnasMostradas: string[] = [
    'nombre',
    'marca_modelo',
    'stock_critico',
    'stock_actual',
    'descripcion',
    'observaciones',
    'fungible',
    'imagen',
    'acciones',
  ];

  // Variables para almacenar los valores de los filtros
  filtroPalabraClave: string = '';
  filtroStockCritico: number | null = null;
  filtroStockActual: number | null = null;
  filtroFungible: string | boolean = 'all';
  
  router = inject(Router);

  constructor(
    private productoService: ProductoService,
    public dialog: MatDialog
  ) {
    // Obtiene la sub-área ('informatica' o 'teleco') desde la URL actual
    const partes: string[] = this.router.url.split('/');
    this.subArea = partes[3];
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  /**
   * Método central para cargar y refrescar los productos de la tabla.
   * Determina qué servicio llamar basado en la sub-área de la URL.
   */
  cargarProductos(): void {
    const tokenString = sessionStorage.getItem('token');
    if (!tokenString) {
      console.error("No se encontró token en sessionStorage.");
      return;
    }
    const token = JSON.parse(tokenString);
    const id = token.areaIdArea.id_area;

    const servicioObservable = this.subArea === 'informatica' 
      ? this.productoService.getProductosByAreaIdInformatica(id)
      : this.productoService.getProductosByAreaIdTeleco(id);
    
    servicioObservable.subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data; // Al cargar, la lista filtrada es igual a la completa
        console.log(`Productos de '${this.subArea}' cargados/refrescados.`);
      },
      error: (error) => console.error('Hubo un error al obtener los productos', error)
    });
  }

  /**
   * Aplica los filtros a la lista de productos cada vez que el usuario interactúa con los inputs.
   */
  applyFilter(event: any, tipo: string) {
    let filterValue: any;

    if (tipo === 'fungible') {
      filterValue = event.value;
      this.filtroFungible = filterValue === 'true' ? true : filterValue === 'false' ? false : 'all';
    } else {
      filterValue = (event.target as HTMLInputElement)?.value;
    }

    if (tipo === 'keyword') this.filtroPalabraClave = filterValue.trim().toLowerCase();
    if (tipo === 'stock_critico') this.filtroStockCritico = filterValue ? parseInt(filterValue, 10) : null;
    if (tipo === 'stock_actual') this.filtroStockActual = filterValue ? parseInt(filterValue, 10) : null;
    
    this.filtrarProductos();
  }

  /**
   * Lógica interna que cruza todos los filtros activos contra la lista de productos.
   */
  filtrarProductos() {
    this.productosFiltrados = this.productos.filter((producto) => {
      const palabraClaveMatch = this.filtroPalabraClave === '' ||
        producto.nombre.toLowerCase().includes(this.filtroPalabraClave) ||
        producto.marca.toLowerCase().includes(this.filtroPalabraClave) ||
        producto.modelo.toLowerCase().includes(this.filtroPalabraClave) ||
        producto.descripcion.toLowerCase().includes(this.filtroPalabraClave);

      const stockCriticoMatch = this.filtroStockCritico === null || producto.stock_critico === this.filtroStockCritico;
      const stockActualMatch = this.filtroStockActual === null || Number(producto.stock_actual) === this.filtroStockActual;
      const fungibleMatch = this.filtroFungible === 'all' || !!Number(producto.fungible) === this.filtroFungible;

      return palabraClaveMatch && stockCriticoMatch && stockActualMatch && fungibleMatch;
    });
  }

  /**
   * Abre el modal para agregar un nuevo producto. Refresca la tabla si la operación es exitosa.
   */
  abrirModalAgregarProducto(): void {
    const dialogRef = this.dialog.open(AgregarProductoModalComponent, {
      width: '90vw',
      maxWidth: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarProductos();
      }
    });
  }

  /**
   * ✨ MÉTODO NUEVO: Abre el modal para importar productos desde un archivo Excel.
   * Refresca la tabla si la importación es exitosa.
   */
  abrirModalImportarExcel(): void {
    const dialogRef = this.dialog.open(ExcelImporterComponent, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        console.log('Importación exitosa, actualizando tabla de productos...');
        this.cargarProductos();
      }
    });
  }

  // --- El resto de tus métodos para abrir otros modales y acciones ---

  abrirModalDetalle(producto: Producto): void {
    this.dialog.open(DetalleProductoComponent, { width: '250px', data: producto });
  }

  abrirModalAgregarStockByproducto(id_producto: number) {
    const dialogRef = this.dialog.open(AgregarStockModalComponent, {
      width: '90vw',
      maxWidth: '600px',
      data: id_producto,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarProductos();
    });
  }

  abrirModalEditarProducto(id_producto: number) {
    const dialogRef = this.dialog.open(EditProductModalComponent, {
      width: '90vw',
      maxWidth: '600px',
      data: id_producto,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarProductos();
    });
  }

  onDeleteProducto(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productoService.deleteProducto(id).subscribe({
        next: () => this.cargarProductos(),
        error: (err) => console.error('Error al eliminar el producto', err),
      });
    }
  }

  
   /*errorCargarImagen(event: any): void {
    const defaultImagePath = 'assets/images/no-image.png';

    // Si la imagen que falla ya es la de por defecto,
    // no hacemos nada más para romper el ciclo infinito.
    if (event.target.src !== defaultImagePath) {
      event.target.src = defaultImagePath;
    }
  }*/
}