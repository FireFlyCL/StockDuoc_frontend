import { Component, OnInit } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

interface MenuItem {
  name: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  listaMenu: MenuItem[] = [];
  isMobile = false;
  private areaId!: number;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => (this.isMobile = result.matches));
  }

  ngOnInit(): void {
    const raw = sessionStorage.getItem('area');
    console.log('Dashboard — area en sesión:', raw);
    this.areaId = raw ? parseInt(raw, 10) : 0;

    if (this.areaId === 1) {
      // Pañol: ya no hay "Inventario" genérico, sino dos subáreas
      this.listaMenu = [
        {
          name: 'Inventario Informática',
          route: '/dashboard/productos/informatica',
        },
        { name: 'Inventario Teleco', route: '/dashboard/productos/teleco' },
        { name: 'Lugares', route: '/dashboard/lugar' },
        { name: 'Volver Atrás', route: '/perfil' },
      ];
    } else {
      // Otras áreas: sí aparece Inventario, más Lugares y Volver Atrás
      this.listaMenu = [
        { name: 'Inventario', route: '/dashboard/productos' },
        { name: 'Lugares', route: '/dashboard/lugar' },
        { name: 'Volver Atrás', route: '/perfil' },
      ];
    }
  }

  onSelection(event: MatSelectionListChange): void {
    const selected = event.options[0].value as MenuItem;

    // Solo setea subArea si es informática o teleco
    if (selected.route.includes('informatica')) {
      sessionStorage.setItem('subArea', 'informatica');
    } else if (selected.route.includes('teleco')) {
      sessionStorage.setItem('subArea', 'teleco');
    } else {
      sessionStorage.removeItem('subArea');
    }

        // IMPORTANTE: usar navigateByUrl para rutas absolutas
    this.router.navigateByUrl(selected.route);
  }
}
