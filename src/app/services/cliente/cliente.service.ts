import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, Subject, tap, BehaviorSubject, catchError, throwError } from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = environment.apiUrl;
  private clienteEliminadoSubject = new Subject<void>();
  clienteEliminado$ = this.clienteEliminadoSubject.asObservable();

  constructor(private http: HttpClient) { }

  saveCliente(clienteData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientemodel`, clienteData);
  }

  getClienteById(clienteId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientemodel/${clienteId}`);
  }
  getClienteAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientemodel`);
  }

  deleteCliente(clienteId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clientemodel/${clienteId}`).pipe(
      tap(() => {
        this.clienteEliminadoSubject.next();
      })
    )
  }

  escuelaByCorreo(correo: string): Observable<any> {
    const url = `${this.apiUrl}/clientemodel/buscar-por-correo`;
    return this.http.post(url, { correo }).pipe(
      catchError(this.handleError)
    );;
  }

  private handleError(error: HttpErrorResponse) {
    // Aquí puedes manejar el error, mostrar un mensaje al usuario, registrar el error, etc.
    console.error('An error occurred:', error.message);
    return throwError('Algo salió mal; por favor, inténtalo de nuevo más tarde.');
  }

  crearCliente(clienteData: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/clientemodel`, clienteData);
  }

  listarEscuelas(): Observable<Escuela[]> {
    return this.http.get<Escuela[]>(`${this.apiUrl}/escuelamodel`);
  }

}
export interface Cliente {
  correo: string;
  idEscuela: number;
}
// escuela.model.ts
export interface Escuela {
  id_escuela: number;
  nombre_escuela: string;
  deleteAt?: any; // O la fecha si corresponde
}
