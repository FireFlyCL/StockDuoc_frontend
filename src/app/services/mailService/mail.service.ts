import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  enviarEmail(datosEmail: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/mail/send`, datosEmail);
  }

  enviarEmailSolicitudCreada(datosSolicitud: any): Observable<any> {
    const emailData = {
      to: `${datosSolicitud.correo_solicitante}`, 
      subject: 'Aviso de Solicitud Creada',
      text: `Tu solicitud para la sección ${datosSolicitud.seccion} ha sido creada con éxito.`,
      html: this.crearHtmlSolicitudCreada(datosSolicitud)
    };
    console.log(emailData.to);
    return this.enviarEmail(emailData);
  }

  enviarEmailSolicitudCreadaAdmin(datosSolicitud: any, correoAdmin : string): Observable<any> {
    const emailData = {
      to: `${correoAdmin}`, 
      subject: `Aviso de Solicitud Creada por ${datosSolicitud.correo_solicitante}`,
      text: `${datosSolicitud.nombre_solicitante} creó una solicitud para la sección ${datosSolicitud.seccion} ha sido creada con éxito.`,
      html: this.crearHtmlSolicitudCreada(datosSolicitud)
    };
    console.log(emailData.to);
    return this.enviarEmail(emailData);
  }

  enviarEmailSolicitudRechazada(datosSolicitud: any): Observable<any> {
    // Similar a enviarEmailSolicitudCreada, pero con un mensaje de rechazo
    const emailData = {
      to: datosSolicitud.correo_solicitante,
      subject: 'Aviso de Solicitud RECHAZADA',
      text: `Tu solicitud para la sección ${datosSolicitud.seccion} ha sido creada con éxito.`,
      html: this.crearHtmlSolicitudRechazada(datosSolicitud)
    };
    return this.enviarEmail(emailData);
  }

  enviarEmailSolicitudAceptada(datosSolicitud: any): Observable<any> {
    // Similar a enviarEmailSolicitudCreada, pero con un mensaje de aceptación
    const emailData = {
      to: datosSolicitud.correo_solicitante,
      subject: 'Aviso de Solicitud ACEPTADA',
      text: `Tu solicitud para la sección ${datosSolicitud.seccion} ha sido creada con éxito.`,
      html: this.crearHtmlSolicitudConfirmada(datosSolicitud)
    };
    return this.enviarEmail(emailData);
  }

  enviarEmailSolicitudCancelada(datosSolicitud: any): Observable<any> {
    // Similar a enviarEmailSolicitudCreada, pero con un mensaje de aceptación
    const emailData = {
      to: datosSolicitud.correo_solicitante,
      subject: 'Aviso de Solicitud CANCELADA',
      text: `Tu solicitud para la sección ${datosSolicitud.seccion} ha sido CANCELADA con éxito.`,
      html: this.crearHtmlSolicitudCancelada(datosSolicitud)
    };
    return this.enviarEmail(emailData);
  }
  
  private crearHtmlSolicitudCancelada(datos: any): string {
    // Aquí puedes crear tu HTML basado en los datos de la solicitud
    return `
      <h1>Solicitud CANCELADA</h1>
      <p>Estimado/a ${datos.nombre_solicitante},</p>
      <p>Tu solicitud para la sección ${datos.seccion} ha sido CANCELADA con éxito para las fechas ${datos.fecha_entrega} a ${datos.fecha_regreso}.</p>
      // ... más detalles ...
    `;
  }

  private crearHtmlSolicitudCreada(datos: any): string {
    // Aquí puedes crear tu HTML basado en los datos de la solicitud
    return `
      <h1>Solicitud Creada</h1>
      <p>Estimado/a ${datos.nombre_solicitante},</p>
      <p>Tu solicitud para la sección ${datos.seccion} ha sido creada con éxito para las fechas ${datos.fecha_entrega} a ${datos.fecha_regreso}.</p>
      // ... más detalles ...
    `;
  }

  private crearHtmlSolicitudRechazada(datos: any): string {
    // Aquí puedes crear tu HTML basado en los datos de la solicitud
    return `
      <h1>Solicitud Rechazada</h1>
      <p>Estimado/a ${datos.nombre_solicitante},</p>
      <p>Tu solicitud para la sección ${datos.seccion} ha sido rechazada con éxito para las fechas ${datos.fecha_entrega} a ${datos.fecha_regreso}.</p>
      // ... más detalles ...
    `;
  }

  private crearHtmlSolicitudConfirmada(datos: any): string {
    // Aquí puedes crear tu HTML basado en los datos de la solicitud
    return `
      <h1>Solicitud Confirmada</h1>
      <p>Estimado/a ${datos.nombre_solicitante},</p>
      <p>Tu solicitud para la sección ${datos.seccion} ha sido confirmada con éxito para las fechas ${datos.fecha_entrega} a ${datos.fecha_regreso}.</p>
      // ... más detalles ...
    `;
  }
}
