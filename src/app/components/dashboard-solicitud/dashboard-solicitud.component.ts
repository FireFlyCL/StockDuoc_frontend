import { Component } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard-solicitud',
  templateUrl: './dashboard-solicitud.component.html',
  styleUrls: ['./dashboard-solicitud.component.css'],
  standalone: false,
})
export class DashboardSolicitudComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isSmallScreen: boolean = false;

  typesOfShoes: { name: string; route: string }[] = [
    { name: 'Solicitudes', route: '/dashboard/productos' },
    { name: 'Volver Atrás', route: '/perfil' },
  ];

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
      });
  }

  onSelection(event: MatSelectionListChange): void {
    if (event.options[0].selected) {
      const selectedShoe = event.options[0].value;
      this.router.navigate([selectedShoe.route]);

      if (this.isSmallScreen) {
        this.sidenav.close(); // Cierra el sidenav si es pantalla pequeña
      }
    }
  }
}
