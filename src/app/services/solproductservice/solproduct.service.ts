import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SolicitudProducto } from 'src/app/components/addproducto/addproducto.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolproductService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  crearSolicitudProducto(solicitudProducto: SolicitudProducto): Observable<any> {
    const url = `${this.apiUrl}/solicitudproductomodel`;
    return this.http.post(url, solicitudProducto);
  }

  detalleSolicitud(id_solicitud: number): Observable<any> {
    const url = `${this.apiUrl}/solicitudproductomodel/detalle/${id_solicitud}`;
    return this.http.get<any>(url);
  }

  getProductosBySolicitud(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/solicitudproductomodel/productosbysol/${id}`);
  }

}

export interface Solicitud {
  fecha_entrega: string;
  fecha_regreso: string;
  hora_inicio: string;
  hora_termino: string;
  seccion: string;
  idArea: number;
  nombre_solicitante: string;
  correo_solicitante: string;
  observaciones?: string;
}
