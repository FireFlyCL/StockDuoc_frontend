import { Component, OnInit } from '@angular/core';
import { StockService } from 'src/app/services/stock/stock.service';
import { DetalleProductoComponent } from '../detalle-producto/detalle-producto.component';
import { MatDialog } from '@angular/material/dialog';
import { AgregarStockModalComponent } from '../agregar-stock-modal/agregar-stock-modal.component';

@Component({
  selector: 'app-stock-critico',
  templateUrl: './stock-critico.component.html',
  styleUrls: ['./stock-critico.component.css']
})
export class StockCriticoComponent implements OnInit {

  stockCritico: any[] = []
  expandedIndex: any;
  columnasMostradasStock = ['nombre_producto', 'stock_critico', 'cantidad_actual', 'imagen', 'acciones']; //
  constructor(private stockService: StockService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.cargarStockCritico(); // Suponiendo que el ID del área es 1
  }

  async showData() {
    let token = sessionStorage.getItem('token');
    if (token) {
      try {
        //console.log(JSON.parse(token));

        return JSON.parse(token); // Parsea el token si es una cadena JSON
      } catch (error) {
        console.error("Error al parsear el token:", error);
      }
    }
    return null; // Retorna null si no hay datos
  }

  async cargarStockCritico(): Promise<void> {
    let token: any = await this.showData()
    let id_area = token.areaIdArea.id_area
    this.stockService.getStockCriticoByArea(id_area).subscribe(
      data => {
        this.stockCritico = data;
        console.log(this.stockCritico);
      },
      error => {
        console.error('Hubo un error al obtener el stock crítico:', error);
      }
    );
  }

  errorCargarImagen($event: ErrorEvent) {
    return true
  }
  abrirModalDetalle(producto: any) {
    const dialogRef = this.dialog.open(DetalleProductoComponent, {
      width: '25%',
      data: producto
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de detalles se ha cerrado');
    });
  }

  toggleRow(arg0: any) {
    throw new Error('Method not implemented.');
  }

  abrirModalAgregarStockByproducto(id_producto: number) {
    const dialogRef = this.dialog.open(AgregarStockModalComponent, {
      width: '50%',
      data: id_producto
      // Puedes pasar datos adicionales si es necesario
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de agregar producto se ha cerrado');
      // Actualizar la lista de productos si es necesario
      this.cargarStockCritico(); 
    });
  }
}
