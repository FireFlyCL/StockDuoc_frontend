import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Producto {
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

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private base = `${environment.apiUrl}/productomodel`;

  constructor(private http: HttpClient) { }

  // Todos los productos
  getAllProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.base}`);
  }

  // Un producto por ID
  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.base}/${id}`);
  }

  // Crear (multipart/form-data)
  createProducto(productoFormData: FormData): Observable<Producto> {
    return this.http.post<Producto>(`${this.base}`, productoFormData);
  }

  // Actualizar (multipart/form-data)
  updateProducto(id: number, productoData: FormData): Observable<Producto> {
    return this.http.put<Producto>(`${this.base}/${id}`, productoData);
  }

  // Borrar
  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  // ——— Inventario genérico por área (áreas ≠ 1) ———
  getProductosByAreaId(areaId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.base}/area-stock/${areaId}`);
  }

  // ——— Subárea Informática (área 1/informatica) ———
  getProductosByAreaIdInformatica(areaId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.base}/area_informatica/${areaId}`);
  }

  // ——— Subárea Teleco (área 1/teleco) ———
  getProductosByAreaIdTeleco(areaId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.base}/area_teleco/${areaId}`);
  }
}




