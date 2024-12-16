import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LugarService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getLugarById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/lugarmodel/${id}`);
  }

  // Método para obtener lugares
  getLugares(): Observable<Lugar[]> {
    const url = `${this.apiUrl}/lugarmodel`; // Ajusta la URL según la ruta de tu API para obtener lugares
    return this.http.get<Lugar[]>(url);
  }
  crearLugar(datosLugar: CrearLugarDTO): Observable<Lugar> {
    const url = `${this.apiUrl}/lugarmodel`; // Ajusta esta URL a la ruta de tu API para crear lugares
    return this.http.post<Lugar>(url, datosLugar);
  }

  updateLugar(id: number, lugarData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/lugarmodel/${id}`, lugarData);
  }

}
export interface Lugar {
  id_lugar: number;
  nombre_lugar: string;
  deleteAt: string | null;
}
export interface CrearLugarDTO {
  nombre_lugar: string;
}


