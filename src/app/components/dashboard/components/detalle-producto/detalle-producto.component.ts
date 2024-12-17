import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-detalle-producto',
    templateUrl: './detalle-producto.component.html',
    styleUrls: ['./detalle-producto.component.css'],
    standalone: false
})
export class DetalleProductoComponent {
  constructor(
    public dialogRef: MatDialogRef<DetalleProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public producto: any // Usa una interfaz específica en lugar de any si es posible
  ) { }

  cerrar(): void {
    this.dialogRef.close();
  }
}
