import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LugarService } from 'src/app/services/lugarservice/lugar.service';
import { StockService } from 'src/app/services/stock/stock.service';

@Component({
  selector: 'app-agregar-lugar-modal',
  templateUrl: './agregar-lugar-modal.component.html',
  styleUrls: ['./agregar-lugar-modal.component.css']
})
export class AgregarLugarModalComponent {
  lugarForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private lugarService: LugarService
  ) {
    this.lugarForm = this.fb.group({
      nombre_lugar: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit(): void {
    if (this.lugarForm.valid) {
      this.lugarService.crearLugar(this.lugarForm.value).subscribe(
        nuevoLugar => {
          console.log('Nuevo lugar creado:', nuevoLugar);
          // Aquí podrías redirigir al usuario o limpiar el formulario, etc.
        },
        error => {
          console.error('Error al crear el lugar:', error);
        }
      );
    }
  }
}
