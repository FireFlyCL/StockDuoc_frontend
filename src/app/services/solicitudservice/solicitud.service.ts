import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllSolicitudes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/solicitudmodel`);
  }

  getSolicitudById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/solicitudmodel/${id}`);
  }

  crearSolicitud(datosSolicitud: Solicitud): Observable<Solicitud> {
    return this.http.post<Solicitud>(`${this.apiUrl}/solicitudmodel`, datosSolicitud);
  }

  updateSolicitud(solicitud: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/solicitudmodel/${solicitud.id}`, solicitud);
  }

  deleteSolicitud(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/solicitudmodel/${id}`);
  }

  obtenerSolicitudesPorArea(areaId: number): Observable<any[]> {
    const url = `${this.apiUrl}/solicitudmodel/solicitudes-por-area/${areaId}`;
    return this.http.get<any[]>(url);
  }

  actualizarEstadoSolicitud(id: number, estado: number, observaciones: string): Observable<HttpResponse<any>> {
    const url = `${this.apiUrl}/solicitudmodel/editarestado/${id}`;
    const body = { estado: estado, observaciones: observaciones};
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(url, body, { headers, observe: 'response' });
  }

  obtenerSolicitudesPorCliente(correo: string): Observable<any[]> {
    const url = `${this.apiUrl}/solicitudmodel/cliente/${correo}`;
    return this.http.get<any[]>(url);
  }

  getSolicitudesPorArea(idArea: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/solicitudmodel/solicitudes-por-area/${idArea}`);
  }
  editarEstadoSolicitud(data: EstadoSolicitud): Observable<any> {
    const url = `${this.apiUrl}/solicitudmodel/editarestado`;
    return this.http.put(url, data);
  }

  obtenerEstadosSolicitud(): Observable<EstadoSolicitud[]> {
    return this.http.get<EstadoSolicitud[]>(`${this.apiUrl}/estadosolicitudes`);
  }

 
}
export interface EstadoSolicitud {
  id_estado: number;
  id_solicitud: number;
  observaciones?: string;
}

export interface Solicitud {
  id_solicitud? : number;
  fecha_entrega: string;
  fecha_regreso: string;
  hora_inicio: string;
  hora_termino: string;
  seccion: string;
  nombre_solicitante: string;
  correo_solicitante: string;
}
