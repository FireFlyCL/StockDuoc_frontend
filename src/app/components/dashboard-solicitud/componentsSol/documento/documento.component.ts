import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SolproductService } from 'src/app/services/solproductservice/solproduct.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
    selector: 'app-documento',
    templateUrl: './documento.component.html',
    styleUrls: ['./documento.component.css'],
    standalone: false
})
export class DocumentoComponent {

  solicitudes: any[] = [];

  constructor(private solProdService: SolproductService, @Inject(MAT_DIALOG_DATA) public id_solicitud: number,) {
    this.cargarSolProdById()
  }

  async cargarSolProdById() {
    console.log(this.id_solicitud);

    await this.solProdService.getProductosBySolicitud(this.id_solicitud).subscribe(data => {
      this.solicitudes = data
      console.log(this.solicitudes);

    })
  }

  generarPDF() {
    const boletaElement = document.getElementById('boleta');
    if (boletaElement) {
      html2canvas(boletaElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a5'
        });
        doc.addImage(imgData, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());

        // Suponiendo que tienes acceso a la fecha de la solicitud y al ID de la solicitud
        const fechaSolicitud = this.formatoFecha(this.solicitudes[0].solicitud_producto.solicitud.fecha_entrega); // Asegúrate de tener una función que formatee la fecha correctamente
        const nombreArchivo = `doc_sol_${fechaSolicitud}_${this.solicitudes[0].solicitud_producto.solicitud.id_solicitud}.pdf`;
        doc.save(nombreArchivo);
      });
    } else {
      console.error('No se pudo encontrar el elemento para generar el PDF');
    }
  }

  // Función para formatear la fecha como 'YYYYMMDD'
  formatoFecha(fecha: Date): string {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  }
}
