import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductoService } from 'src/app/services/productoservice/producto.service';

@Component({
  selector: 'app-agregar-producto-modal',
  templateUrl: './agregar-producto-modal.component.html',
  styleUrls: ['./agregar-producto-modal.component.css'],
  standalone: false,
})
export class AgregarProductoModalComponent implements OnInit {
  productoForm: FormGroup;
  selectedFile: File | null = null;
  subAreaActiva: 'informatica' | 'teleco' = 'informatica';

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    public dialogRef: MatDialogRef<AgregarProductoModalComponent>
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      stock_critico: [0, [Validators.required, Validators.min(0)]],
      descripcion: ['', Validators.required],
      observaciones: [''],
      area: [0],
      fungible: [false],
      imagen_url: [''],
    });
  }

  ngOnInit(): void {}

  async showData() {
    let token = sessionStorage.getItem('token');
    if (token) {
      try {
        console.log(JSON.parse(token));

        return JSON.parse(token); // Parsea el token si es una cadena JSON
      } catch (error) {
        console.error('Error al parsear el token:', error);
      }
    }
    return null; // Retorna null si no hay datos
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFile = fileList[0];
    }
  }

  async onFormSubmit(): Promise<void> {
    if (this.productoForm.valid) {
      const areaId = Number(sessionStorage.getItem('area'));
      const subArea = sessionStorage.getItem('subArea');
      let token = await this.showData();
      let id = token.areaIdArea.id_area;
      // ✅ Obtén subArea del sessionStorage correctamente
      //let subAreaSeleccionada =
        //sessionStorage.getItem('subArea') || 'informatica';

      console.log('SubArea :', subArea);

      const formData = new FormData();
      formData.append('nombre', this.productoForm.value.nombre);
      formData.append('marca', this.productoForm.value.marca);
      formData.append('modelo', this.productoForm.value.modelo);
      formData.append('stock_critico', this.productoForm.value.stock_critico);
      formData.append('descripcion', this.productoForm.value.descripcion);
      formData.append('observaciones', this.productoForm.value.observaciones);
      formData.append('area', id.toString());
      formData.append(
        'fungible',
        this.productoForm.value.fungible ? 'true' : 'false'
      );
      // ✅ Asegúrate de enviar la subArea correcta
      // ✅ Verifica que subArea se envíe correctamente
      //console.log('SubArea seleccionada:', subAreaSeleccionada);
      // 3) Solo si es Pañol (areaId === 1) y hay subArea, lo añades
      if (areaId === 1 && subArea) {
        formData.append('subArea', subArea);
        console.log('👉 Enviando subArea:', subArea);
      }
      if (this.selectedFile) {
        formData.append('imagen', this.selectedFile, this.selectedFile.name);
      } else if (this.productoForm.value.imagen_url) {
        // si quieres soportar campo URL en lugar de archivo
        formData.append('imagen_url', this.productoForm.value.imagen_url);
      }
      this.productoService.createProducto(formData).subscribe(
        (data) => {
          console.log('Producto agregado', data);
          // Aquí puedes cerrar el modal si quieres
          // Cerrar el modal
          this.dialogRef.close(data);
        },
        (error) => {
          console.error('Error al agregar el producto', error);
        }
      );
    }
  }
}
