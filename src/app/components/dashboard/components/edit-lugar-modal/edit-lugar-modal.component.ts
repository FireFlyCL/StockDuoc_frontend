import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LugarService } from 'src/app/services/lugarservice/lugar.service';

@Component({
  selector: 'app-edit-lugar-modal',
  templateUrl: './edit-lugar-modal.component.html',
  styleUrls: ['./edit-lugar-modal.component.css']
})
export class EditLugarModalComponent {
  editLugarForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditLugarModalComponent>,
    @Inject(MAT_DIALOG_DATA) public id_lugar: number,
    private lugarService: LugarService
  ) {
    this.editLugarForm = this.fb.group({
      nombre_lugar: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadLugarData(this.id_lugar);
  }

  loadLugarData(id: number): void {
    // Obtener datos del lugar y actualizar el formulario
    this.lugarService.getLugarById(id).subscribe(lugar => {
      this.editLugarForm.patchValue(lugar);
      console.log(this.editLugarForm.value);
      console.log(this.id_lugar);
      
      
    });
  }

  onSubmit(): void {
    if (this.editLugarForm.valid) {
      this.lugarService.updateLugar(this.id_lugar, this.editLugarForm.value).subscribe(
        response => {
          console.log('Lugar actualizado', response);
          this.dialogRef.close(response);
        },
        error => {
          console.error('Error al actualizar el lugar', error);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
