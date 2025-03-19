import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SolicitudService } from 'src/app/services/solicitudservice/solicitud.service';
import { DetalleSolicitudComponent } from '../detalle-solicitud/detalle-solicitud.component';
import { EditEstadoSolComponent } from '../edit-estado-sol/edit-estado-sol.component';
import { DocumentoComponent } from '../documento/documento.component';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-solicitudes',
    templateUrl: './solicitudes.component.html',
    styleUrls: ['./solicitudes.component.css'],
    standalone: false
})
export class SolicitudesComponent implements OnInit {

  solicitudes: any[] = [];
  displayedColumns: string[] = ['nombre_solicitante', 'correo_solicitante', 'fecha_entrega', 'nombre_estado', 'acciones'];
  dataSource = new MatTableDataSource<any>();
  sortOrder: 'asc' | 'desc' = 'asc';
  filterControl = new FormControl('');
  estadoControl = new FormControl('');
  estadosUnicos: string[] = [];

  constructor(private solicitudService: SolicitudService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.cargarSolicitudes();
    this.setupFilter();
  }

  async showData() {
    let token = sessionStorage.getItem('token');
    if (token) {
      try {
        console.log(JSON.parse(token));
        return JSON.parse(token); // Parsea el token si es una cadena JSON
      } catch (error) {
        console.error("Error al parsear el token:", error);
      }
    }
    return null; // Retorna null si no hay datos
  }

  async cargarSolicitudes(): Promise<void> {
    let token: any = await this.showData()
    let id_area = token.areaIdArea.id_area
    this.solicitudService.getSolicitudesPorArea(id_area).subscribe(
      data => {
        this.solicitudes = data;
        this.dataSource.data = data;
        this.estadosUnicos = [...new Set(data.map(s => s.solicitud.estadosolicitud.nombre_estado))];
        console.log(this.solicitudes);
      },
      error => {
        console.error('Error al obtener las solicitudes:', error);
      }
    );
  }

  setupFilter() {
    this.filterControl.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      const filterValue = value ? value.trim().toLowerCase() : '';
      this.dataSource.filter = filterValue;
    });

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.solicitud.nombre_solicitante?.toLowerCase().includes(filter) ||
             data.solicitud.correo_solicitante?.toLowerCase().includes(filter) ||
             data.solicitud.fecha_entrega?.toString().includes(filter) ||
             data.solicitud.estadosolicitud.nombre_estado?.toLowerCase().includes(filter);
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  filterByEstado(estado: string) {
    if (!estado) {
      this.dataSource.filter = '';
      return;
    }
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.solicitud.estadosolicitud.nombre_estado.toLowerCase() === filter;
    };
    this.dataSource.filter = estado.trim().toLowerCase();
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortSolicitudesByDate();
  }

  resetFilters() {
    this.filterControl.setValue('');
    this.estadoControl.setValue('');
    this.dataSource.filter = '';
  }

  sortSolicitudesByDate() {
    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const dateA = new Date(a.solicitud.fecha_entrega).getTime();
      const dateB = new Date(b.solicitud.fecha_entrega).getTime();
      return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  abrirModalDetalleSolicitud(id_solicitud: number): void {
    const dialogRef = this.dialog.open(DetalleSolicitudComponent, {
      width: '70%',
      data: id_solicitud
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de agregar producto se ha cerrado');
      this.cargarSolicitudes();
    });
  }

  abrirModaleditarSolicitud(id_solicitud: number) {
    const dialogRef = this.dialog.open(EditEstadoSolComponent, {
      width: '70%',
      data: id_solicitud
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de agregar producto se ha cerrado');
      this.cargarSolicitudes();
    });
  }

  abrirModalPdfSolicitud(id_solicitud: number) {
    const dialogRef = this.dialog.open(DocumentoComponent, {
      width: '70%',
      data: id_solicitud
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de agregar producto se ha cerrado');
      this.cargarSolicitudes();
    });
  }
}



