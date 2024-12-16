import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { AddsolicitudComponent } from './components/addsolicitud/addsolicitud.component';
import { AdminGuard } from './guard/gadmin/admin.guard';
import { RedirectmodelComponent } from './components/redirect/redirectmodel/redirectmodel.component';
import { ProductosComponent } from './components/dashboard/components/productos/productos.component';
import { StockComponent } from './components/dashboard/components/stock/stock.component';
import { StockCriticoComponent } from './components/dashboard/components/stock-critico/stock-critico.component';
import { LugarComponent } from './components/dashboard/components/lugar/lugar.component';
import { DashboardSolicitudComponent } from './components/dashboard-solicitud/dashboard-solicitud.component';
import { SolicitudesComponent } from './components/dashboard-solicitud/componentsSol/solicitudes/solicitudes.component';
import { DocumentoComponent } from './components/dashboard-solicitud/componentsSol/documento/documento.component';
import { AlertaComponent } from './components/alerta/alerta.component';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { MisolicitudComponent } from './components/misolicitud/misolicitud.component';
import { DescargaInventarioComponent } from './components/descarga-inventario/descarga-inventario.component';

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "redirect", component: RedirectmodelComponent },
  { path: "perfil", component: PerfilComponent, canActivate: [AdminGuard], data: { roles: ['profesor', 'alumno', 'admin'] } },
  { path: "alerta", component: AlertaComponent, canActivate: [AdminGuard], data: { roles: ['profesor', 'alumno', 'admin'] } },
  { path: "user/misolicitud", component: MisolicitudComponent, canActivate: [AdminGuard], data: { roles: ['profesor', 'alumno'] } },
  { path: "solicitud", component: SolicitudComponent, canActivate: [AdminGuard], data: { roles: ['profesor', 'alumno'] } },
  {
    path: 'descarga-inventario',
    component: DescargaInventarioComponent,
    canActivate: [AdminGuard], data: { roles: ['admin'] }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AdminGuard], data: { roles: ['admin'] },
    children: [
      { path: '', redirectTo: 'productos', pathMatch: 'full' }, // Redirige a 'productos' por defecto
      { path: 'productos', component: ProductosComponent },
      { path: 'stock', component: StockComponent },
      { path: 'stock-critico', component: StockCriticoComponent },
      { path: 'lugar', component: LugarComponent }
    ]
  },
  {
    path: 'dashboard-solicitud',
    component: DashboardSolicitudComponent,
    canActivate: [AdminGuard], data: { roles: ['admin'] },
    children: [
      { path: '', redirectTo: 'solicitudes', pathMatch: 'full' }, // Redirige a 'productos' por defecto
      { path: 'solicitudes', component: SolicitudesComponent },
      { path: 'documento', component: DocumentoComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// canActivate : [PermisosRutasService]