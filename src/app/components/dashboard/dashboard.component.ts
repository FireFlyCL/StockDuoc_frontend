import { Component } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { Router } from '@angular/router';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: false
})
export class DashboardComponent {
  typesOfShoes: { name: string, route: string }[] = [
    { name: 'Productos', route: '/dashboard/productos' },
    { name: 'Stock', route: '/dashboard/stock' },
    { name: 'Stock Crítico', route: '/dashboard/stock-critico' },
    { name: 'Lugares', route: '/dashboard/lugar' },
    { name: 'Volver Atras', route: '/perfil' }
  ];

  constructor(private router: Router) { }

  onSelection(event: MatSelectionListChange): void {
    if (event.options[0].selected) {
      const selectedShoe = event.options[0].value;
      this.router.navigate([selectedShoe.route]);
    }
  }
}
