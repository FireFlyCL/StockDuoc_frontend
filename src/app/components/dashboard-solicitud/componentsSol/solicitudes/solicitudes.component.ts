import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SolicitudService } from 'src/app/services/solicitudservice/solicitud.service';
import { DetalleSolicitudComponent } from '../detalle-solicitud/detalle-solicitud.component';
import { EditEstadoSolComponent } from '../edit-estado-sol/edit-estado-sol.component';
import { DocumentoComponent } from '../documento/documento.component';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css'],
  standalone: false,
})
export class SolicitudesComponent implements OnInit {
  solicitudes: any[] = [];
  displayedColumns: string[] = [
    'id_solicitud',
    'nombre_solicitante',
    'correo_solicitante',
    'fecha_entrega',
    'nombre_estado',
    'observaciones',
    'acciones',
  ];
  dataSource = new MatTableDataSource<any>();
  sortOrder: 'asc' | 'desc' = 'asc';
  filterControl = new FormControl('');
  estadoControl = new FormControl('');
  estadosUnicos: string[] = [];

  constructor(
    private solicitudService: SolicitudService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  filters = {
    keyword: '',
    estado: '',
  };

  ngOnInit(): void {
    this.cargarSolicitudes();
    this.setupCombinedFilter();
  }

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

  async cargarSolicitudes(): Promise<void> {
    let token: any = await this.showData();
    let id_area = token.areaIdArea.id_area;
    this.solicitudService.getSolicitudesPorArea(id_area).subscribe(
      (data) => {
        this.solicitudes = data;
        this.dataSource.data = data;
        this.estadosUnicos = [
          ...new Set(
            data.map((s) => s.solicitud.estadosolicitud.nombre_estado)
          ),
        ];
        console.log(this.solicitudes);
      },
      (error) => {
        console.error('Error al obtener las solicitudes:', error);
      }
    );
  }

  setupCombinedFilter() {
    // 1) Al cambiar la caja de texto de palabra clave…
    this.filterControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((text) => {
        this.filters.keyword = (text ?? '').trim().toLowerCase();
        this.applyCombinedFilter();
      });

    // 2) estado
    this.estadoControl.valueChanges.subscribe((estado) => {
      this.filters.estado = (estado ?? '').trim().toLowerCase();
      this.applyCombinedFilter();
    });

    // 3) predicate único
    this.dataSource.filterPredicate = (data: any, filterJson: string) => {
      const { keyword, estado } = JSON.parse(filterJson);
      const s = data.solicitud;
      const matchKeyword =
        !keyword ||
        s.nombre_solicitante.toLowerCase().includes(keyword) ||
        s.correo_solicitante.toLowerCase().includes(keyword) ||
        s.fecha_entrega.toString().includes(keyword) ||
        s.estadosolicitud.nombre_estado.toLowerCase().includes(keyword);
        (s.observaciones && s.observaciones.toLowerCase().includes(keyword));
      const matchEstado =
        !estado || s.estadosolicitud.nombre_estado.toLowerCase() === estado;
      return matchKeyword && matchEstado;
    };
  }

  applyCombinedFilter() {
    // Dispara el predicate leyendo nuestro objeto filters
    this.dataSource.filter = JSON.stringify(this.filters);
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
      data: id_solicitud,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El modal de agregar producto se ha cerrado');
      this.cargarSolicitudes();
    });
  }

  abrirModaleditarSolicitud(id_solicitud: number) {
    const dialogRef = this.dialog.open(EditEstadoSolComponent, {
      width: '70%',
      data: id_solicitud,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El modal de agregar producto se ha cerrado');
      if (result) {
        this.cargarSolicitudes();
      }
    });
  }

  abrirModalPdfSolicitud(id_solicitud: number) {
    const dialogRef = this.dialog.open(DocumentoComponent, {
      width: '70%',
      data: id_solicitud,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El modal de agregar producto se ha cerrado');
      this.cargarSolicitudes();
    });
  }

  eliminarSolicitud(id: number) {
    const confirmacion = confirm(
      '¿Estás seguro de que deseas eliminar esta solicitud?'
    );
    if (!confirmacion) return;

    this.solicitudService.deleteSolicitud(id).subscribe({
      next: () => {
        this.snackBar.open('Solicitud eliminada con éxito.', 'Cerrar', {
          duration: 3000,
        });
        this.recargarSolicitudes(); // actualiza la tabla
      },
      error: (err) => {
        console.error('Error al eliminar la solicitud:', err);
        this.snackBar.open('Error al eliminar la solicitud.', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  // Este método actualiza la lista
  recargarSolicitudes() {
    this.solicitudService.getAllSolicitudes().subscribe((data) => {
      this.dataSource.data = data;
    });
  }
}
