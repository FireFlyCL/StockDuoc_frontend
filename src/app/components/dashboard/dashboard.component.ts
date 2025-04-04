import { Component } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent {
  listaMenu: { name: string; route: string }[] = [
    { name: 'Inventario Informática', route: '/dashboard/productos/informatica' },
    { name: 'Inventario Teleco', route: '/dashboard/productos/teleco' },
    { name: 'Lugares', route: '/dashboard/lugar' },
    { name: 'Volver Atrás', route: '/perfil' }
  ];

  isMobile: boolean = false;

  constructor(private router: Router, private breakpointObserver: BreakpointObserver) {
    // Escuchar si es pantalla pequeña (móvil)
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  onSelection(event: MatSelectionListChange): void {
    if (event.options[0].selected) {
      const selectedMenu = event.options[0].value;

      if (selectedMenu.route.includes('informatica')) {
        sessionStorage.setItem('subArea', 'informatica');
      } else if (selectedMenu.route.includes('teleco')) {
        sessionStorage.setItem('subArea', 'teleco');
      }

      console.log('SubArea actualizada:', sessionStorage.getItem('subArea'));
      this.router.navigate([selectedMenu.route]);
    }
  }
}
