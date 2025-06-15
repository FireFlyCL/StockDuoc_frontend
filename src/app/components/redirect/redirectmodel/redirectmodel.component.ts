import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSSOService } from 'src/app/auth-sso.service';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { tap, catchError, throwError, Observable } from 'rxjs';
import { AutentifacionService } from 'src/auth/autentifacion.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-redirectmodel',
  templateUrl: './redirectmodel.component.html',
  styleUrls: ['./redirectmodel.component.css'],
  standalone: false,
})
export class RedirectmodelComponent {
  constructor(
    private authSSOService: AuthSSOService,
    private router: Router,
    private clienteService: ClienteService
  ) {}

  public user: any = {
    img: 'src/assets/datos-del-usuario.png',
    correo: '',
    area: '',
    nombre: '',
  };
  public tipo = '';
  public objetounico = {};

  ngOnInit(): void {
    const currentUrl = window.location.href;
    //console.log('URL actual:', currentUrl);

    // 1) Detectar si venimos de Google o de Microsoft
    const provider = sessionStorage.getItem('sso_provider') as 'google' | 'microsoft';
    //console.log('Provider almacenado en sessionStorage:', provider);

    if (provider === 'google') {
      // Reconfiguramos OAuthService para Google antes de procesar el token
      this.authSSOService.initLogin('google');
    } else if (provider === 'microsoft') {
      // Reconfiguramos OAuthService para Microsoft antes de procesar el token
      this.authSSOService.initLogin('microsoft');
    } else {
      //console.warn('No se encontró proveedor en sessionStorage. Asumiendo Google por defecto.');
      this.authSSOService.initLogin('google');
    }

    // 2) Ahora que ya reconfiguramos, procesamos el fragmento y obtenemos el token
    this.authSSOService.resumeLoginFlow();

    // 3) Nos suscribimos para ver si se autenticó correctamente
    this.authSSOService.isAuthenticated$.subscribe((isAuthenticated) => {
      //console.log('Usuario autenticado:', isAuthenticated);
      if (isAuthenticated) {
        this.perfil();
      } else {
        console.warn('No se autenticó al usuario después de resumeLoginFlow().');
      }
    });
  }

  async showData() {
    const profile = await this.authSSOService.getProfile();
    const datag = JSON.stringify(profile);
    //console.log(datag);
    return datag;
  }

  public async perfil() {
    const data = await this.showData();
    if (!data) {
      console.error('No se obtuvo información de perfil del usuario.');
      return;
    }
    let data2: any = JSON.parse(data);
    this.user.nombre = data2.name;
    this.user.correo = data2.email;
    this.user.area = data2.hd;

    const escuela = await this.escuelaByUser(this.user.correo);
    //console.log('ENTRAMOS AL REDIRECT, escuela:', escuela);

    if (data2.picture) {
      this.tipo = 'user';
      this.user.img = data2.picture;
    } else {
      this.tipo = 'admin';
      this.user.img = 'assets/datos-del-usuario.png';
    }

    const dominio = this.user.correo.split('@')[1];
    if (
      dominio === 'duoc.cl' ||
      dominio === 'duocuc.cl' ||
      dominio === 'profesor.duoc.cl'
    ) {
      if (escuela) {
        //console.log('SI TIENE ESCUELA');
        sessionStorage.setItem('area', this.user.area);
        sessionStorage.setItem('correo', this.user.correo);
        sessionStorage.setItem('nombre', this.user.nombre);
        sessionStorage.setItem('img', this.user.img);

        (await this.cliente(this.user.correo)).subscribe(
          (clientedata) => {
            sessionStorage.setItem('clientedata', JSON.stringify(clientedata));
            this.router.navigateByUrl('/perfil');
          },
          (err) => {
            console.error('Error obteniendo cliente:', err);
          }
        );
      } else {
        //console.log('NO TIENE ESCUELA');
        sessionStorage.setItem('area', this.user.area);
        sessionStorage.setItem('correo', this.user.correo);
        sessionStorage.setItem('nombre', this.user.nombre);
        sessionStorage.setItem('img', this.user.img);
        this.router.navigateByUrl('/alerta');
      }
    } else {
      console.log('EL CORREO NO PERTENECE A UN DOMINIO PERMITIDO');
      this.router.navigate(['/'], {
        queryParams: {
          error: 'El correo ingresado no pertenece a un dominio permitido.',
        },
      });
    }
  }

  escuelaByUser(email: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.clienteService.escuelaByCorreo(email).subscribe(
        (data) => resolve(data !== false),
        (error) => {
          //console.error('Error al obtener la escuela del usuario:', error);
          resolve(false);
        }
      );
    });
  }

  async cliente(email: string): Promise<Observable<any>> {
    return this.clienteService.escuelaByCorreo(email).pipe(
      tap((data) => console.log('Cliente obtenido:', data)),
      catchError((error) => {
        //console.log('Error al obtener cliente:', error);
        return throwError(() => new Error('Error al obtener los datos del cliente'));
      })
    );
  }

  logOut() {
    this.authSSOService.logout();
    this.router.navigate(['']);
  }
}


