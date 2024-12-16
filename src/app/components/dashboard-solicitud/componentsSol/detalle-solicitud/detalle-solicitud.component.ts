import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SolicitudService } from 'src/app/services/solicitudservice/solicitud.service';
import { SolproductService } from 'src/app/services/solproductservice/solproduct.service';

@Component({
  selector: 'app-detalle-solicitud',
  templateUrl: './detalle-solicitud.component.html',
  styleUrls: ['./detalle-solicitud.component.css']
})
export class DetalleSolicitudComponent {
  solicitud: any; // Aquí almacenarás los datos de la solicitud
  productos: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public id_solicitud: number,
    private solicitudService: SolicitudService,
    private solicitudProdService: SolproductService
  ) { }

  ngOnInit(): void {
    this.cargarDetalleSolicitud();
    this.cargarProductos();
  }

  cargarDetalleSolicitud(): void {
    this.solicitudService.getSolicitudById(this.id_solicitud).subscribe(
      data => {
        this.solicitud = data; // Asegúrate de que la respuesta es la estructura esperada
      },
      error => {
        console.error('Error al obtener los detalles de la solicitud:', error);
      }
    );
  }

  cargarProductos() {
    this.solicitudProdService.getProductosBySolicitud(this.id_solicitud).subscribe(
      data => {
        this.productos = data;
        console.log(this.productos);
      },
      error => {
        console.error('Error al obtener los productos', error);
      }
    );
  }

}
