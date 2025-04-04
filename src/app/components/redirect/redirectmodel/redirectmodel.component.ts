import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AuthGoogleService } from 'src/app/auth-google.service';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { AutentifacionService } from 'src/auth/autentifacion.service';

@Component({
    selector: 'app-redirectmodel',
    templateUrl: './redirectmodel.component.html',
    styleUrls: ['./redirectmodel.component.css'],
    standalone: false
})
export class RedirectmodelComponent {
  constructor(
    private authGoogleService: AuthGoogleService,
    private router: Router,
    private clienteService: ClienteService,
    private oauthService: OAuthService,
    // private aut: AutentifacionService,
  ) { //this.perfil() 
  }

  public user: any = {
    img: 'src/assets/datos-del-usuario.png',
    correo: '',
    area: '',
    nombre: ''
  };

  public tipo = ''
  public objetounico = {};

  ngOnInit(): void {
    // this.authGoogleService.isAuthenticated$.subscribe(isAuthenticated => {
    //   if (isAuthenticated) {
    //     this.perfil();
    //   }
    // });
    // Registrar la URL actual
    const currentUrl = window.location.href; // Alternativamente, usa this.location
    console.log('URL actual:', currentUrl);

    // Suscribirse al estado de autenticación
    this.authGoogleService.isAuthenticated$.subscribe(isAuthenticated => {
      console.log('Usuario autenticado:', isAuthenticated);
      if (isAuthenticated) {
        this.perfil();
      }
    });

    // Verificar si loadDiscoveryDocumentAndTryLogin se ejecutó correctamente
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then((result) => {
      console.log('Resultado de loadDiscoveryDocumentAndTryLogin:', result);
    }).catch(error => {
      console.error('Error en loadDiscoveryDocumentAndTryLogin:', error);
    });
  }

  async showData() {
    const profile = await this.authGoogleService.getProfile();
    const datag = JSON.stringify(profile);
    console.log(datag);
    return datag;
  }

  public async perfil() {
    // let img="https://www.flaticon.es/iconos-gratis/iniciar-sesion"
    let data = await this.showData();

    if (data) {
      let data2: any = JSON.parse(data);
      this.user.nombre = data2.name;
      this.user.correo = data2.email;
      this.user.area = data2.hd;

      let escuela = await this.escuelaByUser(this.user.correo)
      console.log(escuela);
      console.log("ENTRAMOS AL REDIRECT");
      if (data2.picture) {
        this.tipo = 'user'
        this.user.img = data2.picture;
      } else {
        this.tipo = 'admin'
        if (this.user.area == 'CTCOM') {
          this.user.img = 'assets/datos-del-usuario.png';
        } else if (this.user.area == 'DDHUB') {
          this.user.img = 'assets/datos-del-usuario.png';
        } else if (this.user.area == 'PAÑOL') {
          this.user.img = 'assets/datos-del-usuario.png';
        } else if (this.user.area == 'CTA') {
          this.user.img = 'assets/datos-del-usuario.png';
        } else if (this.user.area == 'FINANZAS') {
          this.user.img = 'assets/datos-del-usuario.png';
        }
      }
      console.log(this.user);
      if (this.user.area === 'duoc.cl' || this.user.area === 'duocuc.cl' || this.user.area === 'profesor.duoc.cl') {

        if (escuela) {

          //console.log(clientedata);
          console.log("SI TIENE ESCUELA");
          //this.guardarEnSessionStorage(clientedata);
          sessionStorage.setItem('area', this.user.area)
          sessionStorage.setItem('correo', this.user.correo)
          sessionStorage.setItem("nombre", this.user.nombre);
          sessionStorage.setItem("img", this.user.img);
          (await this.cliente(this.user.correo)).subscribe(clientedata => {
            // Ahora puedes usar clientedata aquí
            // Por ejemplo, para guardarlo en sessionStorage
            sessionStorage.setItem('clientedata', JSON.stringify(clientedata));
            this.router.navigateByUrl("/perfil");
          });

        } else {
          console.log("NO TIENE ESCUELA");
          sessionStorage.setItem('area', this.user.area)
          sessionStorage.setItem('correo', this.user.correo)
          sessionStorage.setItem("nombre", this.user.nombre);
          sessionStorage.setItem("img", this.user.img);
          this.router.navigateByUrl("/alerta");
        }

      } else {
        console.log("ELSE DEL LOGIN");
        //this.loading = false
        this.router.navigate(['/'], { queryParams: { error: 'El correo ingresado no pertenece a un dominio permitido.' } });
      }
    } else {
      console.error("no imprime info usuario");
    }
  }

  escuelaByUser(email: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.clienteService.escuelaByCorreo(email).subscribe(
        data => {
          // Si data es diferente de false, resuelve la promesa con true.
          resolve(data !== false);
        },
        error => {
          console.error('Error al obtener la escuela del usuario:', error);
          // En caso de error, también resuelve la promesa pero con false.
          resolve(false);
        }
      );
    });
  }

  guardarEnSessionStorage(clientedata: Clientedata) {
    sessionStorage.setItem('clientedata', JSON.stringify(clientedata));
  }

  async cliente(email: string): Promise<Observable<Clientedata>> {
    // Retorna el observable directamente
    return await this.clienteService.escuelaByCorreo(email).pipe(
      tap(data => console.log("---------PASAMOS--------", data)),
      catchError(error => {
        console.log(error);
        return throwError(() => new Error('Error al obtener los datos del cliente'));
      })
    );
  }


  logOut() {
    this.authGoogleService.logout();
    this.router.navigate(['']);
  }
}

export interface Clientedata {
  "correo": string,
  "deleteAt": null,
  "escuela": {
    "id_escuela": number,
    "nombre_escuela": string,
    "deleteAt": null
  }
};