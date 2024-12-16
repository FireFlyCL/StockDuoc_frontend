import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = environment.apiUrl;

  private stockEliminadoSubject = new Subject<void>();
  productoEliminado$ = this.stockEliminadoSubject.asObservable();
  constructor(private http: HttpClient) { }
  getStockById(productoId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/stockmodel/${productoId}`);
  }
  getAllStock(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stockmodel`);
  }
  save(stockModel: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/stockmodel`, stockModel)
  }

  deleteStock(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/stockmodel/${id}`);
  }
  
  updateStock(id: number, stockData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/stockmodel/${id}`, stockData);
  }

  getStockByArea(areaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stockmodel/stockbyareea/${areaId}`);
  }

  getDetalleStock(areaId: number, productoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stockmodel/detallestock/${areaId}/${productoId}`);
  }

  getStockCriticoByArea(areaId: number): Observable<any[]> {
    const url = `${this.apiUrl}/productomodel/stockcritico/${areaId}`;
    return this.http.get<any[]>(url);
  }

  crearStock(stockData: Stock): Observable<Stock> {
    return this.http.post<Stock>(`${this.apiUrl}/stockmodel`, stockData);
  }

}

export interface Stock {
  numero_serie: string;
  serie_sap: number;
  idProducto: number;
  idLugar: number;
}


