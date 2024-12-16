import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthGoogleService } from 'src/app/auth-google.service';
import { UserService } from 'src/app/services/userservice/user.service';
import { AutentifacionService } from 'src/auth/autentifacion.service';

declare var google: any;
declare const googleUser: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loading = false
  public loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private loginPrd: AutentifacionService,
    private routerprd: Router, private usuarioService: UserService, private authGoogleService: AuthGoogleService) {
    this.loginForm = new FormGroup({
      usuario: new FormControl('', Validators.required),
      contraseña: new FormControl('', Validators.required)
    });
  }

  login() {
    this.authGoogleService.login();
  }

  // handleCredentialResponse(response: any) {
  //   this.loading = true
  //   //console.log(response);
  //   //console.log(this.routerprd);
  //   if (response.credential) {
  //     var base64Url = response.credential.split('.')[1];
  //     var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //     var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
  //       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  //     }).join(''));
  //     // if(jsonPayload[""]){
  //     jsonPayload = JSON.parse(jsonPayload);
  //     if (Boolean(jsonPayload)) {
  //       let data = JSON.parse(JSON.stringify(jsonPayload));
  //       if (data.hd === 'duoc.cl' || data.hd === 'duocuc.cl' || data.hd === 'profesor.duoc.cl') {
  //         sessionStorage.setItem("token", JSON.stringify(jsonPayload));
  //         //console.log("user: " + data.hd);
  //         sessionStorage.setItem("area", data.hd);
  //         sessionStorage.setItem("correo", data.email);
  //         sessionStorage.setItem("nombre", data.name);
  //         this.loading = false
  //         this.routerprd.navigateByUrl("/perfil");
  //       } else {
  //         //console.log("user negado: " + data.hd);
  //         this.loading = false
  //         this.routerprd.navigateByUrl("/login");
  //       }
  //     }
  //   }
  // }

  // decodificarToken(token: string): any {
  //   var base64Url = token.split('.')[1];
  //   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //   var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
  //     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  //   }).join(''));
  //   return JSON.parse(jsonPayload);
  // }
  //usuario : any = {"correo_institucional" : "", "contraseña" : ""}
  // onSignIn(googleUser: { getBasicProfile: () => any; }) {
  //   const profile = googleUser.getBasicProfile();
  //   console.log(profile);
  //   // Aquí puedes manejar la autenticación adicional en tu backend
  //   if (profile.hd === 'duoc.cl' || profile.hd === 'duocuc.cl' || profile.hd === 'profesor.duoc.cl') {
  //     console.log('ID: ' + profile.getId());
  //     console.log('Name: ' + profile.getName());
  //     console.log('Image URL: ' + profile.getImageUrl());
  //     console.log('Email: ' + profile.getEmail());
  //     this.loading = false
  //     this.routerprd.navigateByUrl("/perfil");
  //   } else {
  //     //console.log("user negado: " + profile.hd);
  //     this.loading = false
  //     this.routerprd.navigateByUrl("/login");
  //   }
  // }

  iniciarSesion(): void {
    //console.error('Entramos al login');
    this.loading = true
    const usuarioModel = {
      correo: this.loginForm.value.usuario,
      contraseña: this.loginForm.value.contraseña
    };

    this.usuarioService.login(usuarioModel).subscribe(
      (response: HttpResponse<any>) => {
        const usuario = response.body;
        //console.log('Inicio de sesión exitoso:', response);
        // Realizar las acciones necesarias con el nombre del área
        sessionStorage.setItem("token", JSON.stringify(usuario));
        sessionStorage.setItem('area', usuario.areaIdArea.nombre_area)
        sessionStorage.setItem('correo', usuario.correo_institucional)
        sessionStorage.setItem("nombre", usuario.pnombre);
        //location.reload();
        console.log(usuario);
        this.loading = false
        //document.location.href = "/perfil";
        console.log('Exito al iniciar sesión:');
        this.routerprd.navigateByUrl("/perfil");
      },
      (error: any) => {
        this.loading = false
        console.error('Error al iniciar sesión:', error);
      }
    );
  }

}
