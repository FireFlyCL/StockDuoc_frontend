import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/userservice/user.service';
import { DetalleSolicitudComponent } from '../dashboard-solicitud/componentsSol/detalle-solicitud/detalle-solicitud.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MailService } from 'src/app/services/mailService/mail.service';

@Component({
  selector: 'app-misolicitud',
  templateUrl: './misolicitud.component.html',
  styleUrls: ['./misolicitud.component.css']
})
export class MisolicitudComponent implements OnInit {
  solicitudes: any[] = [];
  displayedColumns: string[] = ['fecha_retiro', 'hora_retiro', 'fecha_devolucion', 'hora_devolucion', 'nombre_estado', 'seccion', 'opciones'];
  loading : boolean = false

  constructor(private usuarioService: UserService,private router: Router, public dialog: MatDialog,
    private mailService : MailService) { }

  ngOnInit() {
    this.cargarSolicitudes();
  }

  atras() {
    this.router.navigateByUrl('/perfil');
  }

  async cargarSolicitudes() {
    let correo = sessionStorage.getItem('correo') || ''
    await this.usuarioService.getSolicitudesPorCorreo(correo).subscribe({
      next: (solicitudes) => {
        this.solicitudes = solicitudes;
        console.log(this.solicitudes);
      },
      error: (error) => {
        console.error('Hubo un error al obtener las solicitudes', error);
      }
    });
  }

  verDetalle(id_solicitud: number): void {    
    const dialogRef = this.dialog.open(DetalleSolicitudComponent, {
      width: '50%',
      data: id_solicitud
      // Puedes pasar datos adicionales si es necesario
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de agregar producto se ha cerrado');
      // Actualizar la lista de productos si es necesario
      this.cargarSolicitudes();
    });
  }

  cancelarSolicitud(solicitud: any) {
    // Aquí puedes implementar la lógica para cancelar la solicitud
    
    const solicitud2 = {
      fecha_entrega: solicitud.fecha_entrega,
      fecha_regreso: solicitud.fecha_regreso,
      hora_inicio: solicitud.hora_inicio,
      hora_termino: solicitud.hora_termino,
      idArea: solicitud.id_area, // Asegúrate de que el formulario tenga un campo 'area'
      nombre_solicitante: solicitud.nombre_solicitante,
      correo_solicitante: solicitud.correo_solicitante,
      seccion: solicitud.seccion,
    };
    console.log('Cancelar la solicitud:', solicitud2);
    // Por ejemplo, podrías llamar a un servicio que envíe una solicitud DELETE al servidor
    this.cancelarSolicitudMail(solicitud2);
  }

  async cancelarSolicitudMail(datosSolicitud: any) {
    await this.mailService.enviarEmailSolicitudCancelada(datosSolicitud).subscribe({
      next: response => {
        console.log('Email de confirmación enviado con éxito', response);
      },
      error: error => {
        console.error('Error al enviar email de confirmación', error);
      }
    });
  }
}
