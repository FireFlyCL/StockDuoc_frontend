import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductoService } from 'src/app/services/productoservice/producto.service';

@Component({
  selector: 'app-edit-product-modal',
  templateUrl: './edit-product-modal.component.html',
  styleUrls: ['./edit-product-modal.component.css'],
  standalone: false,
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
      observaciones: [''],
      area: [0],
      fungible: [false],
      imagen_url: [''],
    });
  }

  ngOnInit(): void {
    // Aquí deberías cargar los datos del producto usando this.data como ID
    this.loadProductData(this.id_producto);
  }

  loadProductData(id: number): void {
    // Obtener datos del producto y actualizar el formulario
    this.productoService.getProductoById(id).subscribe((producto) => {
      producto.fungible = !!producto.fungible;
      this.editProductForm.patchValue(producto);
      console.log(this.editProductForm.value);
    });
  }

  onFileSelected(event: Event): void {
    event.preventDefault(); // ✅ Evita cierre del modal
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFile = fileList[0];
      console.log('Archivo seleccionado:', this.selectedFile.name);
    }
  }

  updateProduct(): void {
    if (this.editProductForm.valid) {
      const formData = new FormData();
  
      formData.append('nombre', this.editProductForm.value.nombre);
      formData.append('marca', this.editProductForm.value.marca);
      formData.append('modelo', this.editProductForm.value.modelo);
      formData.append(
        'stock_critico',
        this.editProductForm.value.stock_critico.toString()
      );
      formData.append('descripcion', this.editProductForm.value.descripcion);
  
      if (this.editProductForm.value.observaciones) {
        formData.append(
          'observaciones',
          this.editProductForm.value.observaciones
        );
      }
  
      formData.append(
        'fungible',
        this.editProductForm.value.fungible ? 'true' : 'false'
      );
  
      // ✅ Si hay una nueva imagen seleccionada, actualizarla
      if (this.selectedFile) {
        formData.append('imagen', this.selectedFile, this.selectedFile.name);
      } 
      // ✅ Si no se selecciona imagen, enviar la URL existente para conservarla
      else if (this.editProductForm.value.imagen_url) {
        formData.append('imagen_url', this.editProductForm.value.imagen_url);
      }
  
      // ✅ Enviar subArea si existe
      if (this.editProductForm.value.subArea) {
        formData.append('subArea', this.editProductForm.value.subArea);
      }
  
      this.productoService.updateProducto(this.id_producto, formData).subscribe(
        (response) => {
          console.log('Producto actualizado', response);
          this.dialogRef.close(response);
        },
        (error) => {
          console.error('Error al actualizar el producto', error);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
