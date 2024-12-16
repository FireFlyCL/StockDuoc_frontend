import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutentifacionService } from 'src/auth/autentifacion.service';
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { UserService } from 'src/app/services/userservice/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  
  gapi: any;
  sesion = sessionStorage.getItem('token');
  json_sesion: { [key: string]: any } = {};
  usuarios: any[] = [];
  correo: any[] = [];
  estado = false;
  constructor(private router: Router, private aut: AutentifacionService,
    private userS: UserService) { }


  goToPerfil() {
    this.router.navigateByUrl('/perfil');
  }
  goToSolicitudes() {
    this.router.navigateByUrl('/admin/solicitudes');
  }
  goToInventario() {
    this.router.navigateByUrl('/admin/inventario');
  }
  cerrarSesion() {
    this.aut.limpiarToken();
    this.router.navigateByUrl("/sinsesion/login");
    const auth2 = this.gapi.auth2.getAuthInstance();
    try {
      auth2.signOut().then(() => {
        console.log('User signed out.');
      });
    } catch (error) {
      console.log(error); 
    }
    location.reload();
  }

  ngOnInit(): void {
    
  }

  signOut() {
    const auth2 = this.gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      console.log('User signed out.');
    });
  }

}
