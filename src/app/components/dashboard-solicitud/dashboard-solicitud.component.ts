import { Component } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard-solicitud',
    templateUrl: './dashboard-solicitud.component.html',
    styleUrls: ['./dashboard-solicitud.component.css'],
    standalone: false
})
export class DashboardSolicitudComponent {
  typesOfShoes: { name: string, route: string }[] = [
    { name: 'Solicitudes', route: '/dashboard/productos' },
    { name: 'Volver Atrás', route: '/perfil' }
  ];

  constructor(private router: Router) { }

  onSelection(event: MatSelectionListChange): void {
    if (event.options[0].selected) {
      const selectedShoe = event.options[0].value;
      this.router.navigate([selectedShoe.route]);
    }
  }

  
}
