import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductoService } from 'src/app/services/productoservice/producto.service';

@Component({
    selector: 'app-edit-product-modal',
    templateUrl: './edit-product-modal.component.html',
    styleUrls: ['./edit-product-modal.component.css'],
    standalone: false
})
export class EditProductModalComponent {
  editProductForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public id_producto: number,
    private productoService: ProductoService
  ) {
    this.editProductForm = this.fb.group({
      nombre: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      stock_critico: [0, [Validators.required, Validators.min(0)]],
      descripcion: ['', Validators.required],
      area: [0],
      imagen_url: ['']
    });
  }

  ngOnInit(): void {
    // Aquí deberías cargar los datos del producto usando this.data como ID
    this.loadProductData(this.id_producto);
  }

  loadProductData(id: number): void {
    // Obtener datos del producto y actualizar el formulario
    this.productoService.getProductoById(id).subscribe(producto => {
      this.editProductForm.patchValue(producto);
      console.log(this.editProductForm.value);
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFile = fileList[0];
    }
  }

  onSubmit(): void {
    if (this.editProductForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('nombre', this.editProductForm.value.nombre);
      formData.append('marca', this.editProductForm.value.marca);
      formData.append('modelo', this.editProductForm.value.modelo);
      formData.append('stock_critico', this.editProductForm.value.stock_critico);
      formData.append('descripcion', this.editProductForm.value.descripcion);
      formData.append('imagen', this.selectedFile , this.selectedFile.name);
      // Llamada al servicio para actualizar el producto
      this.productoService.updateProducto(this.id_producto, formData).subscribe(
        response => {
          console.log('Producto actualizado', response);
          this.dialogRef.close(response);
        },
        error => {
          console.error('Error al actualizar el producto', error);
        }
      );
    }
  }

  updateProduct(): void {
    if (this.editProductForm.valid) {
      const formData = new FormData();
      formData.append('nombre', this.editProductForm.value.nombre);
      formData.append('marca', this.editProductForm.value.marca);
      formData.append('modelo', this.editProductForm.value.modelo);
      formData.append('stock_critico', this.editProductForm.value.stock_critico);
      formData.append('descripcion', this.editProductForm.value.descripcion);
      if (this.selectedFile) {
        formData.append('imagen', this.selectedFile , this.selectedFile.name);
      }
      
      this.productoService.updateProducto(this.id_producto, formData).subscribe(
        response => {
          console.log('Producto actualizado', response);
          this.dialogRef.close(response);
        },
        error => {
          console.error('Error al actualizar el producto', error);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
