import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SolicitudProducto } from 'src/app/components/addproducto/addproducto.component';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  //lista carrito
  private myList: SolicitudProducto[] = [];

  //carrito observable
  private myCart = new BehaviorSubject<SolicitudProducto[]>([]);
  myCart$ = this.myCart.asObservable();

  addProduct(solProd: SolicitudProducto): boolean {
    const productIndex = this.myList.findIndex((element) => element.productoId === solProd.productoId);

    if (productIndex !== -1) {
      // Si el producto ya está en el carrito, incrementa su cantidad
      if (this.myList[productIndex].cantidad + 1 <= this.myList[productIndex].productoId.stock) {
        this.myList[productIndex].cantidad += 1;
        this.myCart.next(this.myList);
        // console.log(this.myList);
        // console.log("CASO 1");

        return true;
      } else {
        console.error('No puedes agregar más de este producto debido al stock limitado.');
        this.myCart.next(this.myList);
        return false;
      }
    } else {
      // Si el producto no está en el carrito y hay stock suficiente, agrégalo
      if (solProd.cantidad <= solProd.productoId.stock) {
        this.myList.push({ ...solProd, cantidad: 1, productoId: solProd.productoId });
        this.myCart.next(this.myList);
        // console.log("CASO 2");
        // console.log(this.myList);
        return true;
      } else {
        console.error('No hay stock suficiente para agregar este producto.');
        this.myCart.next(this.myList);
        return false;
      }
    }

    // Actualiza el BehaviorSubject con la nueva lista de carrito
    // Esta línea debe ejecutarse sin importar cuál sea el caso de arriba
    this.myCart.next(this.myList);
    return true;
  }

  // Lista para mantener los IDs de productos sin stock
  private productosSinStock = new BehaviorSubject<number[]>([]);

  // Método para obtener el Observable de productos sin stock
  getProductosSinStock(): Observable<number[]> {
    return this.productosSinStock.asObservable();
  }

  // Método para agregar o quitar un ID de producto de la lista de sin stock
  actualizarProductosSinStock(idProducto: number, sinStock: boolean): void {
    const productosSinStockActual = this.productosSinStock.value;
    if (sinStock && !productosSinStockActual.includes(idProducto)) {
      this.productosSinStock.next([...productosSinStockActual, idProducto]);
    } else if (!sinStock && productosSinStockActual.includes(idProducto)) {
      this.productosSinStock.next(productosSinStockActual.filter(id => id !== idProducto));
    }
  }

  updateProduct(productoId: number, operation: string, stockActual: number): boolean {
    let productList = this.myCart.value;
    const index = productList.findIndex(p => p.productoId.producto.id_producto === productoId);
  
    if (index !== -1) {
      if (operation === 'add') {
        if (productList[index].cantidad < stockActual) {
          productList[index].cantidad++;
          this.myCart.next(productList);
          return true;
        } else {
          console.warn('No hay más stock disponible para este producto.');
          return false;
        }
      } else if (operation === 'minus') {
        if (productList[index].cantidad > 1) {
          productList[index].cantidad--;
          this.myCart.next(productList);
          return true;
        } else {
          productList.splice(index, 1);
          this.myCart.next(productList);
          return true;
        }
      }
    }
  
    return false; // Si no se encuentra el producto o no se puede actualizar
  }


  findProductById(productoId: number) {

    return this.myList.find((element) => {

      return element.productoId.producto.id_producto === productoId
    })

  }

  deleteProduct(productoId: number) {
    this.actualizarProductosSinStock(productoId, false)
    this.myList = this.myList.filter((product) => {
      //console.log(this.myList);
      return product.productoId.producto.id_producto != productoId
    })
    this.myCart.next(this.myList);
  }

  totalCart() {
    const total = this.myList.reduce(function (acc, product) { return acc + (product.cantidad * 1); }, 0)
    return total
  }
}
