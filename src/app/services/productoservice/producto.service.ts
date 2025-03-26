import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  productos: Producto[] = [];

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAllProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productomodel`);
  }

  getProductoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/productomodel/${id}`);
  }

  createProducto(productoFormData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/productomodel`, productoFormData);
  }


  // updateProducto(producto: any): Observable<any> {
  //   return this.http.put<any>(`${this.apiUrl}/productomodel/${producto.id}`, producto);
  // }

  getProductosByAreaIdInformatica(areaId: number): Observable<Producto[]> {
    const url = `${this.apiUrl}/productomodel/area_informatica/${areaId}`;
    return this.http.get<Producto[]>(url);
  }

  getProductosByAreaIdTeleco(areaId: number): Observable<Producto[]> {
    const url = `${this.apiUrl}/productomodel/area_teleco/${areaId}`;
    return this.http.get<Producto[]>(url);
  }

  getProductosByAreaIdStock(areaId: number): Observable<Producto[]> {
    const url = `${this.apiUrl}/productomodel/area-stock/${areaId}`;
    return this.http.get<Producto[]>(url);
  }

  updateProducto(id: number, productoData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/productomodel/${id}`, productoData);
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productomodel/${id}`);
  }

}

interface Producto {
  id_producto: number;
  nombre: string;
  marca: string;
  modelo: string;
  stock_critico: number;
  stock_actual: number;
  imagen: string;
  imagenUrl: string;
  area: {
    id_area: number;
    nombre_area: string;
  };
  deleteAt: string | null;
  descripcion: string;
  observaciones: string;
  fungible: boolean;
}



