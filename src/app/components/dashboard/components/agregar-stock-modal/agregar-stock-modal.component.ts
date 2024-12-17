import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LugarService } from 'src/app/services/lugarservice/lugar.service';
import { StockService } from 'src/app/services/stock/stock.service';

@Component({
    selector: 'app-agregar-stock-modal',
    templateUrl: './agregar-stock-modal.component.html',
    styleUrls: ['./agregar-stock-modal.component.css'],
    standalone: false
})
export class AgregarStockModalComponent implements OnInit {

  imagenUrl = '../assets/product.png'
  stockForm: FormGroup;
  lugares: any[] = []

  constructor(
    private fb: FormBuilder,
    private lugarService: LugarService,
    private stockService: StockService,
    public dialogRef: MatDialogRef<AgregarStockModalComponent>,
    @Inject(MAT_DIALOG_DATA) public id_producto: number
  ) {
    this.stockForm = this.fb.group({
      numero_serie: ['', Validators.required],
      serie_sap: ['', Validators.required],
      idProducto: [id_producto],
      idLugar: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarLugares()
  }

  onFormSubmit(): void {
    if (this.stockForm.valid) {
      // Clona los valores actuales del formulario
      const formData = { ...this.stockForm.value };

      // Convierte serie_sap a un número si no es null o undefined
      if (formData.serie_sap != null) {
        formData.serie_sap = Number(formData.serie_sap);
      }
      console.log(formData.serie_sap);
      
      this.stockService.crearStock(formData).subscribe(
        data => {
          console.log('Stock agregado', data);
          this.dialogRef.close(data);
        },
        error => {
          console.error('Error al agregar stock', error);
        }
      );
    }
  }

  cargarLugares(): void {
    this.lugarService.getLugares().subscribe(
      data => {
        this.lugares = data;
      },
      error => {
        console.error('Hubo un error al obtener los lugares:', error);
      }
    );
  }

  errorCargarImagen($event: ErrorEvent) {
    return true
  }
}
