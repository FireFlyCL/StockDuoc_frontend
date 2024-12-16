import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Lugar, LugarService } from 'src/app/services/lugarservice/lugar.service';
import { AgregarLugarModalComponent } from '../agregar-lugar-modal/agregar-lugar-modal.component';
import { EditLugarModalComponent } from '../edit-lugar-modal/edit-lugar-modal.component';

@Component({
  selector: 'app-lugar',
  templateUrl: './lugar.component.html',
  styleUrls: ['./lugar.component.css']
})
export class LugarComponent {
  lugares: Lugar[] = []; // Debes tener una interfaz Lugar definida
  displayedColumns: string[] = ['nombre_lugar', 'acciones'];

  constructor(
    private lugarService: LugarService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cargarLugares();
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

  abrirModalAgregarLugar(): void {
    const dialogRef = this.dialog.open(AgregarLugarModalComponent, {
      width: '70%'
      // Puedes pasar datos adicionales si es necesario
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de agregar producto se ha cerrado');
      // Actualizar la lista de productos si es necesario
      this.cargarLugares();
    });
  }

  abrirModalEditarLugar(id_lugar: number): void {
    const dialogRef = this.dialog.open(EditLugarModalComponent, {
      width: '70%',
      data : id_lugar
      // Puedes pasar datos adicionales si es necesario
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de editar producto se ha cerrado');
      // Actualizar la lista de productos si es necesario
      this.cargarLugares();
    });
  }

  editarLugar(id_lugar: number): void {
    // Implementa la lógica para editar un lugar
  }

  eliminarLugar(idLugar: number): void {
    // Implementa la lógica para eliminar un lugar
  }
}
