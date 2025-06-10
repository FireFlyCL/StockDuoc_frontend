import { Component, Inject } from '@angular/core'; // Importar Inject
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog'; // <-- IMPORTAR
import * as XLSX from 'xlsx';
// ---STANDALONE ---
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-excel-importer',
  standalone: true, 
  imports: [ 
    CommonModule, 
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './excel-importer.component.html',

})
export class ExcelImporterComponent {
  
  parsedData: any[] = [];
  isLoading: boolean = false;
  statusMessage: string = '';
  fileName: string = ''; // Para mostrar el nombre del archivo
  private apiUrl = 'http://localhost:8001/api/productomodel/bulk';

  // Inyectamos MatDialogRef para controlar este diálogo
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<ExcelImporterComponent> // <-- INYECTAR
  ) {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.fileName = file.name;
    this.statusMessage = 'Procesando archivo...';
    this.isLoading = true;

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const sheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
      this.parsedData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.statusMessage = `${this.parsedData.length} productos leídos. Listo para importar.`;
      this.isLoading = false;
    };
    reader.readAsBinaryString(file);
  }

  uploadData(): void {
    if (this.parsedData.length === 0) { /* ... */ return; }

    this.isLoading = true;
    this.statusMessage = `Enviando ${this.parsedData.length} productos...`;

    this.http.post(this.apiUrl, this.parsedData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.statusMessage = `¡Éxito! ${response.data.count} productos creados.`;
        // Cerramos el modal y enviamos 'true' para indicar que la tabla debe refrescarse
        setTimeout(() => this.dialogRef.close(true), 1500);
      },
      error: (error) => {
        this.isLoading = false;
        this.statusMessage = `Error: ${error.error.message || 'Ocurrió un error.'}`;
      }
    });
  }
}