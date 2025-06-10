import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// --- MÓDULOS DE ANGULAR MATERIAL ---
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// --- MÓDULOS DE TERCEROS Y OTROS ---
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BarcodeScannerLivestreamModule } from 'ngx-barcode-scanner';
import { OAuthModule } from 'angular-oauth2-oidc';
import { CdkTableModule } from '@angular/cdk/table';

// --- COMPONENTES DE LA APLICACIÓN ---
import { NavbarComponent } from './components/navbar/navbar.component';
import { AddproductoComponent } from './components/addproducto/addproducto.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddsolicitudComponent } from './components/addsolicitud/addsolicitud.component';
import { AlertaComponent } from './components/alerta/alerta.component';
import { RedirectmodelComponent } from './components/redirect/redirectmodel/redirectmodel.component';
import { ProductosComponent } from './components/dashboard/components/productos/productos.component';
import { StockComponent } from './components/dashboard/components/stock/stock.component';
import { StockCriticoComponent } from './components/dashboard/components/stock-critico/stock-critico.component';
import { DetalleProductoComponent } from './components/dashboard/components/detalle-producto/detalle-producto.component';
import { AgregarProductoModalComponent } from './components/dashboard/components/agregar-producto-modal/agregar-producto-modal.component';
import { DetalleStockComponent } from './components/dashboard/components/detalle-stock/detalle-stock.component';
import { AgregarStockModalComponent } from './components/dashboard/components/agregar-stock-modal/agregar-stock-modal.component';
import { AgregarLugarModalComponent } from './components/dashboard/components/agregar-lugar-modal/agregar-lugar-modal.component';
import { LugarComponent } from './components/dashboard/components/lugar/lugar.component';
import { EditProductModalComponent } from './components/dashboard/components/edit-product-modal/edit-product-modal.component';
import { EditStockModalComponent } from './components/dashboard/components/edit-stock-modal/edit-stock-modal.component';
import { EditLugarModalComponent } from './components/dashboard/components/edit-lugar-modal/edit-lugar-modal.component';
import { DashboardSolicitudComponent } from './components/dashboard-solicitud/dashboard-solicitud.component';
import { DocumentoComponent } from './components/dashboard-solicitud/componentsSol/documento/documento.component';
import { DetalleSolicitudComponent } from './components/dashboard-solicitud/componentsSol/detalle-solicitud/detalle-solicitud.component';
import { SolicitudesComponent } from './components/dashboard-solicitud/componentsSol/solicitudes/solicitudes.component';
import { EditEstadoSolComponent } from './components/dashboard-solicitud/componentsSol/edit-estado-sol/edit-estado-sol.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { NavbarcartComponent } from './components/navbarcart/navbarcart.component';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { MisolicitudComponent } from './components/misolicitud/misolicitud.component';
import { DescargaInventarioComponent } from './components/descarga-inventario/descarga-inventario.component';
import { ExcelImporterComponent } from './excel-importer/excel-importer.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PerfilComponent,
    NavbarComponent,
    AddproductoComponent,
    DashboardComponent,
    AddsolicitudComponent,
    AlertaComponent,
    RedirectmodelComponent,
    StockComponent,
    StockCriticoComponent,
    DetalleProductoComponent,
    AgregarProductoModalComponent,
    DetalleStockComponent,
    AgregarStockModalComponent,
    AgregarLugarModalComponent,
    LugarComponent,
    EditProductModalComponent,
    EditStockModalComponent,
    EditLugarModalComponent,
    DashboardSolicitudComponent,
    DocumentoComponent,
    DetalleSolicitudComponent,
    SolicitudesComponent,
    EditEstadoSolComponent,
    CarritoComponent,
    NavbarcartComponent,
    SolicitudComponent,
    MisolicitudComponent,
    DescargaInventarioComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatGridListModule,
    FontAwesomeModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatMomentDateModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    BarcodeScannerLivestreamModule,
    MatSidenavModule,
    OAuthModule.forRoot(),
    CdkTableModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatProgressBarModule,
    ExcelImporterComponent,
    ProductosComponent
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class AppModule {}
