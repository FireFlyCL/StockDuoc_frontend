import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StockService } from 'src/app/services/stock/stock.service';
import { DetalleProductoComponent } from '../detalle-producto/detalle-producto.component';
import { DetalleStockComponent } from '../detalle-stock/detalle-stock.component';
import { AgregarStockModalComponent } from '../agregar-stock-modal/agregar-stock-modal.component';

@Component({
    selector: 'app-stock',
    templateUrl: './stock.component.html',
    styleUrls: ['./stock.component.css'],
    standalone: false
})
export class StockComponent implements OnInit {

  stocks: any[] = []; // Asegúrate de tener una estructura adecuada para los datos del stock
  columnasMostradasStock = ['nombre_producto', 'stock', 'imagen', 'acciones']; //
  columnasMostradasSubtabla = ['numero_serie']; // Ajusta según las columnas de tu subtabla
  expandedElement: any | null;
  detallesStock: any[] = []; // Un diccionario para los detalles de stock
  expandedIndex: number | null = null; // Índice del producto cuyo stock se muestra

  constructor(private stockService: StockService,
    public dialog: MatDialog, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cargarStocks();
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

  errorCargarImagen($event: ErrorEvent) {
    return true
  }

  async cargarStocks(): Promise<void> {
    let token: any = await this.showData()
    let id = token.areaIdArea.id_area
    this.stockService.getStockByArea(id).subscribe(
      data => {
        this.stocks = data;
        console.log(this.stocks);
      },
      error => {
        console.error('Error al obtener el stock:', error);
      }
    );
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
      this.cargarStocks()
    });
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

  openStockDetails(stock: any): void {
    this.dialog.open(DetalleStockComponent, {
      width: '100%',
      data: stock
    });
  }

  async toggleRow(productoId: number) {

    let token: any = await this.showData(); // Esto no necesita ser await, a menos que showData sea una promesa
    let areaId = token.areaIdArea.id_area;
    // Si aún no se han cargado los detalles del stock, cárgalos
    this.stockService.getDetalleStock(areaId, productoId).subscribe(
      data => {
        this.detallesStock = data;
        console.log(this.detallesStock);
        this.openStockDetails(this.detallesStock)
      },
      error => {
        console.error('Hubo un error al obtener los detalles del stock:', error);
      }
    );

  }
}

