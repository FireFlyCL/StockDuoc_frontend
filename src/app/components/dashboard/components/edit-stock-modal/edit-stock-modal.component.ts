import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LugarService } from 'src/app/services/lugarservice/lugar.service';
import { StockService } from 'src/app/services/stock/stock.service';

@Component({
    selector: 'app-edit-stock-modal',
    templateUrl: './edit-stock-modal.component.html',
    styleUrls: ['./edit-stock-modal.component.css'],
    standalone: false
})
export class EditStockModalComponent {
  editStockForm: FormGroup;
  lugares: any[] = []
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditStockModalComponent>,
    @Inject(MAT_DIALOG_DATA) public id_stock: number,
    private stockService: StockService,
    private lugarService: LugarService
  ) {
    this.editStockForm = this.fb.group({
      numero_serie: ['', Validators.required],
      serie_sap: ['', Validators.required],
      idLugar: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadStockData(this.id_stock);
    this.cargarLugares()
  }

  loadStockData(id: number): void {
    // Obtener datos del stock y actualizar el formulario
    this.stockService.getStockById(id).subscribe(stock => {
      this.editStockForm.patchValue(stock);
    });
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

  onSubmit(): void {
    if (this.editStockForm.valid) {
      if (this.editStockForm.value.serie_sap != null) {
        this.editStockForm.value.serie_sap = Number(this.editStockForm.value.serie_sap);
      }
      this.stockService.updateStock(this.id_stock, this.editStockForm.value).subscribe(
        response => {
          console.log('Stock actualizado', response);
          this.dialogRef.close(response);
        },
        error => {
          console.error('Error al actualizar el stock', error);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
