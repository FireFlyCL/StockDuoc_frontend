import { Component } from '@angular/core';
import { ProductoService } from 'src/app/services/productoservice/producto.service';
import { StockService } from 'src/app/services/stock/stock.service';

@Component({
  selector: 'app-descarga-inventario',
  templateUrl: './descarga-inventario.component.html',
  styleUrls: ['./descarga-inventario.component.css']
})
export class DescargaInventarioComponent {
  constructor(private productoService: ProductoService, private stockService: StockService) { }

  generarCSV() {
    this.productoService.getAllProductos().subscribe(data => {
      const csvData = this.convertirAFormatoCSV(data);
      this.descargarCSV(csvData, 'productos.csv');
    });
  }

  private convertirAFormatoCSV(data: any[]): string {
    const columnas = ['id_producto', 'nombre', 'marca', 'modelo', 'stock_critico', 'descripcion', 'imagenUrl'];
    const csv = data.map(row => columnas.map(fieldName => JSON.stringify(row[fieldName], this.replacer)).join(','));
    csv.unshift(columnas.join(',')); // Añade los encabezados
    return csv.join('\r\n');
  }

  private replacer(key: any, value: any): any {
    return value === null ? '' : value;
  }

  private descargarCSV(csvData: string, nombreArchivo: string) {
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvData], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', nombreArchivo);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

  }
  //STOCK DESCARGA
  generarCSVStock() {
    this.stockService.getAllStock().subscribe(data => {
      const csvData = this.convertirAFormatoCSVStock(data);
      this.descargarCSVStock(csvData, 'stock.csv');
    });
  }

  private convertirAFormatoCSVStock(data: any[]): string {
    const columnas = ['id_stock', 'numero_serie', 'serie_sap', 'producto_id_producto', 'producto_nombre', 'producto_marca', 'producto_modelo', 'producto_stock_critico', 'producto_descripcion', 'producto_imagenUrl', 'area_nombre_area', 'lugar_nombre_lugar'];
    console.log(data);

    const csv = data.map(row => {
      const flatRow: FlatRow = {
        id_stock: row.id_stock,
        numero_serie: row.numero_serie,
        serie_sap: row.serie_sap,
        producto_id_producto: row.producto?.id_producto ?? '',
        producto_nombre: row.producto?.nombre ?? '',
        producto_marca: row.producto?.marca ?? '',
        producto_modelo: row.producto?.modelo ?? '',
        producto_stock_critico: row.producto?.stock_critico ?? '',
        producto_descripcion: row.producto?.descripcion ?? '',
        producto_imagenUrl: row.producto?.imagenUrl ?? '',
        area_nombre_area: row.producto?.area?.nombre_area ?? '',
        lugar_nombre_lugar: row.lugar?.nombre_lugar ?? ''
      };
      console.log(flatRow);

      return columnas.map(fieldName => {
        const value = flatRow[fieldName];
        // Usar JSON.stringify solo si el valor no es una cadena vacía
        return value !== '' ? JSON.stringify(value, this.replacerStock) : '';
      }).join(',');
    });
    csv.unshift(columnas.join(',')); // Añade los encabezados
    return csv.join('\r\n');
  }

  private replacerStock(key: any, value: any): any {
    return value === null ? '' : value;
  }

  private descargarCSVStock(csvData: string, nombreArchivo: string) {
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nombreArchivo;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export interface FlatRow {
  id_stock: number;
  numero_serie: string;
  serie_sap: string;
  producto_id_producto: number;
  producto_nombre: string;
  producto_marca: string;
  producto_modelo: string;
  producto_stock_critico: number;
  producto_descripcion: string;
  producto_imagenUrl: string;
  area_nombre_area: string;
  lugar_nombre_lugar: string;
  [key: string]: number | string; // Esta es la firma de índice
}
