import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SolicitudService } from 'src/app/services/solicitudservice/solicitud.service';
import { DetalleSolicitudComponent } from '../detalle-solicitud/detalle-solicitud.component';
import { EditEstadoSolComponent } from '../edit-estado-sol/edit-estado-sol.component';
import { DocumentoComponent } from '../documento/documento.component';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {

  solicitudes: any[] = [];
  displayedColumns: string[] = ['nombre_solicitante', 'correo_solicitante', 'fecha_entrega', 'nombre_estado', 'acciones'];

  constructor(private solicitudService: SolicitudService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  async showData() {
    let token = sessionStorage.getItem('token');
    if (token) {
      try {
        console.log(JSON.parse(token));

        return JSON.parse(token); // Parsea el token si es una cadena JSON
      } catch (error) {
        console.error("Error al parsear el token:", error);
      }
    }
    return null; // Retorna null si no hay datos
  }

  async cargarSolicitudes(): Promise<void> {
    let token: any = await this.showData()
    let id_area = token.areaIdArea.id_area
    await this.solicitudService.getSolicitudesPorArea(id_area).subscribe(
      data => {
        this.solicitudes = data;
        console.log(this.solicitudes);

      },
      error => {
        console.error('Error al obtener las solicitudes:', error);
      }
    );
  }
  abrirModalDetalleSolicitud(id_solicitud: number): void {
    const dialogRef = this.dialog.open(DetalleSolicitudComponent, {
      width: '70%',
      data: id_solicitud
      // Puedes pasar datos adicionales si es necesario
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de agregar producto se ha cerrado');
      // Actualizar la lista de productos si es necesario
      this.cargarSolicitudes();
    });
  }

  abrirModaleditarSolicitud(id_solicitud: number) {
    const dialogRef = this.dialog.open(EditEstadoSolComponent, {
      width: '70%',
      data: id_solicitud
      // Puedes pasar datos adicionales si es necesario
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de agregar producto se ha cerrado');
      // Actualizar la lista de productos si es necesario
      this.cargarSolicitudes();
    });
  }

  abrirModalPdfSolicitud(id_solicitud: number) {
    const dialogRef = this.dialog.open(DocumentoComponent, {
      width: '70%',
      data: id_solicitud
      // Puedes pasar datos adicionales si es necesario
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de agregar producto se ha cerrado');
      // Actualizar la lista de productos si es necesario
      this.cargarSolicitudes();
    });
  }
}
