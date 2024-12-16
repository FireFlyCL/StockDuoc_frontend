import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { EditStockModalComponent } from '../edit-stock-modal/edit-stock-modal.component';
import { StockService } from 'src/app/services/stock/stock.service';

@Component({
  selector: 'app-detalle-stock',
  templateUrl: './detalle-stock.component.html',
  styleUrls: ['./detalle-stock.component.css']
})
export class DetalleStockComponent {

  imagenUrl = '../assets/product.png'

  constructor(@Inject(MAT_DIALOG_DATA) public stockItems: any, public dialog: MatDialog, private stockService : StockService) { }
  displayedColumns: string[] = ['numero_serie', 'serie_sap', 'lugarIdLugar', 'opciones'];

  eliminar(_t44: any) {
    throw new Error('Method not implemented.');
  }
  editar(_t44: any) {
    throw new Error('Method not implemented.');
  }
  errorCargarImagen($event: ErrorEvent) {
    return true
  }

  abrirModalEditarLugar(id_stock: number): void {
    const dialogRef = this.dialog.open(EditStockModalComponent, {
      width: '100%',
      data : id_stock
      // Puedes pasar datos adicionales si es necesario
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de editar producto se ha cerrado');
      // Actualizar la lista de productos si es necesario
      this.dialog.closeAll();
    });
  }

  onDeleteStock(id: number): void {
    // Confirmar antes de eliminar
    if (confirm('¿Estás seguro de que quieres eliminar este stock?')) {
      this.stockService.deleteStock(id).subscribe(
        response => {
          console.log('Stock eliminado con éxito', response);
          // Aquí puedes actualizar la vista o la lista de stocks
          this.dialog.closeAll()
        },
        error => {
          console.error('Error al eliminar el stock', error);
        }
      );
    }
  }
}
