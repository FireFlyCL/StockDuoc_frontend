import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductoService } from 'src/app/services/productoservice/producto.service';
import { DetalleProductoComponent } from '../detalle-producto/detalle-producto.component';
import { AgregarProductoModalComponent } from '../agregar-producto-modal/agregar-producto-modal.component';
import { AgregarStockModalComponent } from '../agregar-stock-modal/agregar-stock-modal.component';
import { EditProductModalComponent } from '../edit-product-modal/edit-product-modal.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  standalone: false
})


export class ProductosComponent {

  productos: Producto[] = [];
  usuario: any

  columnasMostradas: string[] = ['nombre', 'marca_modelo', 'stock_critico','stock_actual', 'imagen', 'acciones'];

  router = inject(Router);

  subArea = '';

  constructor(private productoService: ProductoService,
    public dialog: MatDialog) {

    let partes: string[] = this.router.url.split('/');
    this.subArea = partes[3];
    console.log('subarea: ', this.subArea)

  }

  ngOnInit(): void {


    this.getProductosByArea()


  }

  async showData() {
    let token = sessionStorage.getItem('token');
    if (token) {
      try {

        return JSON.parse(token); // Parsea el token si es una cadena JSON

      } catch (error) {
        console.error("Error al parsear el token:", error);
      }
    }
    return null; // Retorna null si no hay datos
  }

  async getProductosByArea() {
    let token: any = await this.showData()
    let id = token.areaIdArea.id_area


    if (this.subArea == 'informatica') {

      this.productoService.getProductosByAreaIdInformatica(id).subscribe(
        data => {
          this.productos = data;
          console.log(this.productos)
        },
        error => {
          console.error('Hubo un error al obtener los productos', error);
        }
      );

    } else {


      this.productoService.getProductosByAreaIdTeleco(id).subscribe(
        data => {
          this.productos = data;
          console.log(this.productos)
        },
        error => {
          console.error('Hubo un error al obtener los productos', error);
        }
      );



    }



  }

  abrirModalAgregarProducto(): void {
    const dialogRef = this.dialog.open(AgregarProductoModalComponent, {
      width: '25%',
      // Puedes pasar datos adicionales si es necesario
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de agregar producto se ha cerrado');
      // Actualizar la lista de productos si es necesario
      this.getProductosByArea()
    });
  }

  abrirModalDetalle(producto: any): void {
    const dialogRef = this.dialog.open(DetalleProductoComponent, {
      width: '250px',
      data: producto
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de detalles se ha cerrado');
    });
  }

  errorCargarImagen(event: any) {
    return true
  }


  editarProducto(producto: any) {
    // Lógica para editar un producto
  }


  abrirModalAgregarStockByproducto(id_producto: number) {
    const dialogRef = this.dialog.open(AgregarStockModalComponent, {
      width: '70%',
      data: id_producto
      // Puedes pasar datos adicionales si es necesario
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de agregar producto se ha cerrado');
      // Actualizar la lista de productos si es necesario
    });
  }

  abrirModalEditarProducto(id_producto: number) {
    const dialogRef = this.dialog.open(EditProductModalComponent, {
      width: '70%',
      data: id_producto
      // Puedes pasar datos adicionales si es necesario
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de editar producto se ha cerrado');
      // Actualizar la lista de productos si es necesario
      this.getProductosByArea()
    });
  }

  onDeleteProducto(id: number): void {
    // Confirmar antes de eliminar
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productoService.deleteProducto(id).subscribe(
        response => {
          console.log('Producto eliminado con éxito', response);
          // Aquí puedes actualizar la vista o la lista de productos
          this.getProductosByArea()
        },
        error => {
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
  imagen: string;
  imagenUrl: string;
  area: {
    id_area: number;
    nombre_area: string;
  };
  deleteAt: string | null;
  descripcion: string;
}