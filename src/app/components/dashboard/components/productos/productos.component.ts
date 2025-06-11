import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductoService } from 'src/app/services/productoservice/producto.service';
import { DetalleProductoComponent } from '../detalle-producto/detalle-producto.component';
import { AgregarProductoModalComponent } from '../agregar-producto-modal/agregar-producto-modal.component';
import { AgregarStockModalComponent } from '../agregar-stock-modal/agregar-stock-modal.component';
import { EditProductModalComponent } from '../edit-product-modal/edit-product-modal.component';
import { ExcelImporterComponent } from 'src/app/excel-importer/excel-importer.component';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  standalone: false,
})
export class ProductosComponent {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  usuario: any;

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

  router = inject(Router);

  subArea = '';

  filtroPalabraClave: string = '';
  filtroStockCritico: number | null = null;
  filtroStockActual: number | null = null;
  filtroFungible: string | boolean = 'all';

  constructor(
    private productoService: ProductoService,
    public dialog: MatDialog
  ) {
    let partes: string[] = this.router.url.split('/');
    this.subArea = partes[3];
    console.log('subarea: ', this.subArea);
  }

  ngOnInit(): void {
    this.getProductosByArea();
  }

  async showData() {
    let token = sessionStorage.getItem('token');
    if (token) {
      try {
        return JSON.parse(token);
      } catch (error) {
        console.error('Error al parsear el token:', error);
      }
    }
    return null;
  }

  async getProductosByArea() {
    let token: any = await this.showData();
    let id = token.areaIdArea.id_area;

    if (this.subArea == 'informatica') {
      this.productoService.getProductosByAreaIdInformatica(id).subscribe(
        (data) => {
          this.productos = data;
          this.productosFiltrados = data;
          console.log(this.productos);
        },
        (error) => {
          console.error('Hubo un error al obtener los productos', error);
        }
      );
    } else {
      this.productoService.getProductosByAreaIdTeleco(id).subscribe(
        (data) => {
          this.productos = data;
          this.productosFiltrados = data;
          console.log(this.productos);
        },
        (error) => {
          console.error('Hubo un error al obtener los productos', error);
        }
      );
    }
  }

  cargarProductos(): void {
    const tokenString = sessionStorage.getItem('token');
    if (!tokenString) {
      console.error('No se encontró token en sessionStorage.');
      return;
    }
    const token = JSON.parse(tokenString);
    const id = token.areaIdArea.id_area;

    const servicioObservable =
      this.subArea === 'informatica'
        ? this.productoService.getProductosByAreaIdInformatica(id)
        : this.productoService.getProductosByAreaIdTeleco(id);

    servicioObservable.subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data; // Al cargar, la lista filtrada es igual a la completa
        console.log(`Productos de '${this.subArea}' cargados/refrescados.`);
      },
      error: (error) =>
        console.error('Hubo un error al obtener los productos', error),
    });
  }

  exportarTablaExcel(): void {
    // Paso 1: transformar productos a un objeto plano
    const datosParaExcel = this.productosFiltrados.map((p) => ({
      Nombre: p.nombre,
      Marca: p.marca,
      Modelo: p.modelo,
      'Stock Crítico': p.stock_critico,
      'Stock Actual': p.stock_actual,
      Descripción: p.descripcion,
      Observaciones: p.observaciones,
      Fungible: p.fungible ? 'Sí' : 'No',
    }));

    // Paso 2: crear hoja de cálculo
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExcel);

    // Paso 3: crear libro y agregar la hoja
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');

    // Paso 4: generar buffer
    const wbout: ArrayBuffer = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Paso 5: disparar descarga
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `productos_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  // Filtros
  applyFilter(event: any, tipo: string) {
    let filterValue: any;

    if (tipo === 'fungible') {
      filterValue = event.value;
      // Verifica y convierte el valor de 'fungible' correctamente
      if (filterValue === 'true') {
        this.filtroFungible = true;
      } else if (filterValue === 'false') {
        this.filtroFungible = false;
      } else {
        this.filtroFungible = 'all';
      }
    } else {
      filterValue = (event.target as HTMLInputElement)?.value;
    }

    if (tipo === 'keyword') {
      this.filtroPalabraClave = filterValue.toLowerCase();
    } else if (tipo === 'stock_critico') {
      this.filtroStockCritico = filterValue ? parseInt(filterValue) : null;
    } else if (tipo === 'stock_actual') {
      this.filtroStockActual = filterValue ? parseInt(filterValue, 10) : null;
    }

    this.filtrarProductos();
  }

  filtrarProductos() {
    console.log('Aplicando filtros...');
    console.log('Filtro de fungible:', this.filtroFungible);

    this.productosFiltrados = this.productos.filter((producto) => {
      const palabraClaveMatch =
        this.filtroPalabraClave === '' ||
        producto.nombre.toLowerCase().includes(this.filtroPalabraClave) ||
        producto.marca.toLowerCase().includes(this.filtroPalabraClave) ||
        producto.modelo.toLowerCase().includes(this.filtroPalabraClave) ||
        producto.descripcion.toLowerCase().includes(this.filtroPalabraClave);

      const stockCriticoMatch =
        this.filtroStockCritico === null ||
        producto.stock_critico === this.filtroStockCritico;

      const stockActualMatch =
        this.filtroStockActual === null ||
        Number(producto.stock_actual) === Number(this.filtroStockActual);

      // Convierte el valor a booleano si viene como número
      const fungibleBoolean = Number(producto.fungible) === 1 ? true : false;

      const fungibleMatch =
        this.filtroFungible === 'all' ||
        fungibleBoolean === this.filtroFungible;

      return (
        palabraClaveMatch &&
        stockCriticoMatch &&
        stockActualMatch &&
        fungibleMatch
      );
    });

    console.log('Productos filtrados:', this.productosFiltrados);
  }

  abrirModalAgregarProducto(): void {
    const dialogRef = this.dialog.open(AgregarProductoModalComponent, {
      width: '90vw',
      maxWidth: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El modal de agregar producto se ha cerrado');
      this.getProductosByArea();
    });
  }

  abrirModalImportarExcel(): void {
    const dialogRef = this.dialog.open(ExcelImporterComponent, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        console.log('Importación exitosa, actualizando tabla de productos...');
        this.cargarProductos();
      }
    });
  }

  abrirModalDetalle(producto: any): void {
    const dialogRef = this.dialog.open(DetalleProductoComponent, {
      width: '250px',
      data: producto,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El modal de detalles se ha cerrado');
    });
  }

  errorCargarImagen(event: any) {
    return true;
  }

  abrirModalAgregarStockByproducto(id_producto: number) {
    const dialogRef = this.dialog.open(AgregarStockModalComponent, {
      width: '90vw',
      maxWidth: '600px',
      data: id_producto,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El modal de agregar stock se ha cerrado');
      this.getProductosByArea();
    });
  }

  abrirModalEditarProducto(id_producto: number) {
    const dialogRef = this.dialog.open(EditProductModalComponent, {
      width: '90vw',
      maxWidth: '600px',
      data: id_producto,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El modal de editar producto se ha cerrado');
      this.getProductosByArea();
    });
  }

  onDeleteProducto(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productoService.deleteProducto(id).subscribe(
        (response) => {
          console.log('Producto eliminado con éxito', response);
          this.getProductosByArea();
        },
        (error) => {
          console.error('Error al eliminar el producto', error);
        }
      );
    }
  }
}

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
