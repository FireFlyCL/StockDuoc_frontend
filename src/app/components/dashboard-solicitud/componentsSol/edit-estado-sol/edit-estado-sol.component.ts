import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MailService } from 'src/app/services/mailService/mail.service';
import { EstadoSolicitud, SolicitudService } from 'src/app/services/solicitudservice/solicitud.service';

@Component({
  selector: 'app-edit-estado-sol',
  templateUrl: './edit-estado-sol.component.html',
  styleUrls: ['./edit-estado-sol.component.css']
})
export class EditEstadoSolComponent implements OnInit {
  estados: any[] = [];
  form: FormGroup;
  loading: boolean = false

  constructor(private solicitudService: SolicitudService, public dialogRef: MatDialogRef<EditEstadoSolComponent>,
    @Inject(MAT_DIALOG_DATA) public id_solicitud: number, private mailService: MailService
  ) {
    this.form = new FormGroup({
      estado: new FormControl('', Validators.required) // Puedes establecer un valor predeterminado si es necesario
    });
  }

  ngOnInit(): void {
    this.cargarEstadosSolicitud()
  }

  async cambiarEstado(): Promise<void> {
    this.loading = true
    if (this.form.valid) {
      const body: EstadoSolicitud = {
        id_estado: this.form.value.estado,
        id_solicitud: this.id_solicitud
      };
      this.solicitudService.editarEstadoSolicitud(body).subscribe(
        async (response) => {

          this.solicitudService.getSolicitudById(this.id_solicitud).subscribe(
            async response => {
              console.log('Cancelar la solicitud:', response);
              let solicitud2 = {
                fecha_entrega: response.fecha_entrega,
                fecha_regreso: response.fecha_regreso,
                hora_inicio: response.hora_inicio,
                hora_termino: response.hora_termino,
                idArea: response.id_area, // Asegúrate de que el formulario tenga un campo 'area'
                nombre_solicitante: response.nombre_solicitante,
                correo_solicitante: response.correo_solicitante,
                seccion: response.seccion
              };
              switch (body.id_estado) {
                case 1: // Nueva
                  // await this.mailService.enviarEmailSolicitudCancelada(solicitud).subscribe({
                  //   next: response => {
                  //     console.log('Email de confirmación enviado con éxito', response);
                  //   },
                  //   error: error => {
                  //     console.error('Error al enviar email de confirmación', error);
                  //   }
                  // });
                  break;
                case 2: // Aprobado
                  await this.mailService.enviarEmailSolicitudAceptada(solicitud2).subscribe({
                    next: response => {
                      console.log('Email de APROBACIÓN enviado con éxito', response);
                    },
                    error: error => {
                      console.error('Error al enviar email de APROBACIÓN', error);
                    }
                  });
                  break;
                case 3: // Rechazado
                  await this.mailService.enviarEmailSolicitudRechazada(solicitud2).subscribe({
                    next: response => {
                      console.log('Email de RECHAZO enviado con éxito', response);
                    },
                    error: error => {
                      console.error('Error al enviar email de RECHAZO', error);
                    }
                  });
                  break;
                case 4: // Terminado
                  // await this.mailService.enviarEmailSolicitudCancelada(solicitud).subscribe({
                  //   next: response => {
                  //     console.log('Email de confirmación enviado con éxito', response);
                  //   },
                  //   error: error => {
                  //     console.error('Error al enviar email de confirmación', error);
                  //   }
                  // });
                  break;
                default:
                  throw new Error('Estado de solicitud no reconocido');
              }
            }
          );
          // Por ejemplo, podrías llamar a un servicio que envíe una solicitud DELETE al servidor
          console.log('Estado actualizado con éxito', response);
        },
        error => {
          console.error('Error al actualizar el estado', error);
        }
      )
    }
    this.loading = false
    this.dialogRef.close()
  }

  cargarEstadosSolicitud(): void {
    this.solicitudService.obtenerEstadosSolicitud().subscribe(
      data => {
        this.estados = data;
      },
      error => {
        console.error('Hubo un error al obtener los productos', error);
      }
    );
  }

  // onSubmit() {
  //   if (this.form.valid) {
  //     const body: EstadoSolicitud = {
  //       id_estado: this.form.value.estado,
  //       id_solicitud: this.id_solicitud
  //     };
  //     console.log(body);
  //   }
  // }

}
