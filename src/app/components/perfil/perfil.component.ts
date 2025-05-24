import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { type } from 'os';
import { map } from 'rxjs';
import { AuthSSOService } from 'src/app/auth-sso.service';
import { UserService } from 'src/app/services/userservice/user.service';
import { AutentifacionService } from 'src/auth/autentifacion.service';

@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.component.html',
    styleUrls: ['./perfil.component.css'],
    standalone: false
})
export class PerfilComponent implements OnInit {

  public tipo = ''
  public objetounico = {};
  public user: any = {
    img: 'src/assets/datos-del-usuario.png',
    correo: '',
    area: '',
    nombre: ''
  };

  constructor(private authSSOService: AuthSSOService, private aut: AutentifacionService, private router: Router,
    private usuarioService: UserService) { }
  ngOnInit(): void {
    this.authSSOService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.perfil();
      }
    });
    let data = this.showData();
    if (data != null) {
      this.perfil()
    }
  }

  async showData() {
    let profile = await this.authSSOService.getProfile();
    if (profile) {
      return profile; // Retorna directamente el objeto si existe
    } else {
      let token = sessionStorage.getItem('token');
      if (token) {
        try {
          return JSON.parse(token); // Parsea el token si es una cadena JSON
        } catch (error) {
          console.error("Error al parsear el token:", error);
        }
      }
    }
    return null; // Retorna null si no hay datos
  }

  async showDataCleinte() {

    let token = sessionStorage.getItem('clientedata');
    if (token) {
      try {
        return JSON.parse(token); // Parsea el token si es una cadena JSON
      } catch (error) {
        console.error("Error al parsear el token:", error);
      }
    }

    return null; // Retorna null si no hay datos
  }


  public async perfil() {
    let data2 = await this.showData();

    if (data2) {
      try {
        let clientedata = await this.showDataCleinte()
        console.log("Datos cliente recibidos:", clientedata);
        if (typeof data2 === 'object' && data2 !== null) {
          if ('correo_institucional' in data2) {
            // Procesar como administrador
            this.tipo = 'admin';
            const nombreCompleto = [data2.pnombre, data2.snombre, data2.appaterno].filter(Boolean).join(' ');
            this.user = {
              nombre: nombreCompleto,
              correo: data2.correo_institucional,
              area: data2.areaIdArea?.nombre_area,
              img: 'assets/datos-del-usuario.png'
            };
          } else if ('email' in data2 && 'escuela' in clientedata) {

            let areacliente = clientedata.escuela.nombre_escuela || ""
            // Procesar como usuario regular
            this.tipo = 'user';
            this.user = {
              nombre: data2.name,
              correo: data2.email,
              area: areacliente,
              img: data2.picture
            };

          } else {
            console.error("Tipo de usuario no identificado");
          }
        } else {
          console.error("Los datos parseados no son un objeto");
        }
        console.log(this.tipo);
        console.log(this.user);
      } catch (error) {
        console.error("Error al parsear los datos:", error);
      }
    } else {
      console.error("No se pudo obtener información del usuario");
    }
  }

  cargarUsuarios(idArea: number) {
    return this.usuarioService.getUsuariosPorArea(idArea).pipe(
      map(usuarios => {
        // Suponiendo que el correo del administrador es el primer usuario
        return usuarios.length > 0 ? usuarios[0].area.nombre_area : null;
      })
    );
  }

  solicitud() {
    //this.router.navigateByUrl('/user/addsolicitud');
    this.router.navigateByUrl('solicitud');
  }

  documento(){
    this.router.navigateByUrl('descarga-inventario');
  }

  solicitudes() {
    console.log("entramos a dashboard-solicitud");

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
    this.router.navigateByUrl("/");
  }
}
