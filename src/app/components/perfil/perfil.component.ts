import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGoogleService } from 'src/app/auth-google.service';
import { UserService } from 'src/app/services/userservice/user.service';
import { AutentifacionService } from 'src/auth/autentifacion.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  standalone: false,
})
export class PerfilComponent implements OnInit {
  public tipo = '';
  public user: any = {
    img: 'src/assets/datos-del-usuario.png',
    correo: '',
    area: '',
    nombre: '',
  };

  constructor(
    private authGoogleService: AuthGoogleService,
    private aut: AutentifacionService,
    private router: Router,
    private usuarioService: UserService
  ) {}

  ngOnInit(): void {
    this.authGoogleService.isAuthenticated$
      .subscribe(isAuth => isAuth && this.perfil());

    if (sessionStorage.getItem('token')) {
      this.perfil();
    }
  }

  private async showData(): Promise<any> {
    const profile = await this.authGoogleService.getProfile();
    if (profile) return profile;
    const token = sessionStorage.getItem('token');
    if (token) {
      try { return JSON.parse(token); }
      catch { console.error('Error al parsear token'); }
    }
    return null;
  }

  private async showDataCliente(): Promise<any> {
    const token = sessionStorage.getItem('clientedata');
    if (token) {
      try { return JSON.parse(token); }
      catch { console.error('Error al parsear clientedata'); }
    }
    return null;
  }

  public async perfil() {
    const data2 = await this.showData();
    if (!data2) {
      console.error('No se pudo obtener información del usuario');
      return;
    }

    // Limpiamos cualquier subÁrea previa
    sessionStorage.removeItem('subArea');

    // 1) Si es administrador (tiene correo_institucional)
    if ('correo_institucional' in data2) {
      this.tipo = 'admin';
      const nombreCompleto = [data2.pnombre, data2.snombre, data2.appaterno]
        .filter(Boolean).join(' ');
      const correoAdmin = data2.correo_institucional;

      // Extraemos el ID y nombre de área desde el token
      const areaObj = data2.areaIdArea;
      const areaId   = areaObj?.id_area ?? areaObj?.idArea;
      const nombreArea = areaObj?.nombre_area;

      if (!areaId) {
        console.error('No vino areaId en el perfil');
        return;
      }

      // --- GUARDAR EN SESSIONSTORAGE ---
      sessionStorage.setItem('area',     areaId.toString());
      sessionStorage.setItem('areaNombre', nombreArea);

      // Configuramos el objeto user
      this.user = {
        nombre: nombreCompleto,
        correo: correoAdmin,
        area: nombreArea,
        img: 'assets/datos-del-usuario.png'
      };

      // Finalmente redirigimos _después_ de haber guardado el areaId
   

    // 2) Si es usuario normal
    } else if ('email' in data2) {
      const clientedata = await this.showDataCliente();
      const nombreEscuela = clientedata?.escuela?.nombre_escuela;
      if (!nombreEscuela) {
        console.error('Faltan datos de clientedata');
        return;
      }

      this.tipo = 'user';
      this.user = {
        nombre: data2.name,
        correo: data2.email,
        area: nombreEscuela,
        img: data2.picture
      };

      // Guardamos también el nombre de "área" para consistencia
      sessionStorage.setItem('areaNombre', nombreEscuela);

      // Y redirigimos donde corresponda
      this.router.navigateByUrl('/perfil');
    } else {
      console.error('Tipo de usuario no identificado');
    }
  }

  solicitud() {
    //this.router.navigateByUrl('/user/addsolicitud');
    this.router.navigateByUrl('solicitud');
  }

  documento() {
    this.router.navigateByUrl('descarga-inventario');
  }

  solicitudes() {
    console.log('entramos a dashboard-solicitud');

    this.router.navigateByUrl('/dashboard-solicitud');
  }

  misSolicitudes(correo: string) {
    this.router.navigateByUrl('/user/misolicitud');
  }

  inventario() {
    this.router.navigateByUrl('/dashboard');
  }

  public cerrarSesion() {
    this.aut.limpiarToken();
    this.router.navigateByUrl('/');
  }
}
