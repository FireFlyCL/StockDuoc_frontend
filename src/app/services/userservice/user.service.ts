import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(usuario: any): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/usuariomodel/login`, usuario, { headers, observe: 'response' });
  }
  // getAll(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/usuariomodel`);
  // }

  getSolicitudesPorCorreo(correo: string): Observable<any> {
    const url = `${this.apiUrl}/solicitudmodel/solicitudes-por-correo/${correo}`;
    return this.http.get(url);
  }

  getUsuariosPorArea(idArea: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuariomodel/por-area/${idArea}`);
  }

}
