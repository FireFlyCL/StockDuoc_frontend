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

  listaMenu: { name: string, route: string }[] = [
    { name: 'Inventario Informática', route: '/dashboard/productos/informatica' },
    { name: 'Inventario Teleco', route: '/dashboard/productos/teleco' },    
 //   { name: 'Stock', route: '/dashboard/stock' },
 //   { name: 'Stock Crítico', route: '/dashboard/stock-critico' },
    { name: 'Lugares', route: '/dashboard/lugar' },
    { name: 'Volver Atras', route: '/perfil' }
  ];

  constructor(private router: Router) { }

  onSelection(event: MatSelectionListChange): void {
    if (event.options[0].selected) {
      const selectedMenu = event.options[0].value;
      
      // ✅ Detecta si es inventario de informática o teleco
      if (selectedMenu.route.includes('informatica')) {
        sessionStorage.setItem('subArea', 'informatica');
      } else if (selectedMenu.route.includes('teleco')) {
        sessionStorage.setItem('subArea', 'teleco');
      }
  
      console.log('SubArea actualizada:', sessionStorage.getItem('subArea')); // 👀 Verificar valor actualizado
  
      // Navega a la ruta seleccionada
      this.router.navigate([selectedMenu.route]);
    }
  }
}
