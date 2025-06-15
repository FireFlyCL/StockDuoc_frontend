import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthSSOService } from 'src/app/auth-sso.service';
import { UserService } from 'src/app/services/userservice/user.service';
import { AutentifacionService } from 'src/auth/autentifacion.service';

declare var google: any;
declare const googleUser: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent implements OnInit {
  loading = false;
  public loginForm!: FormGroup;
  errorMessage: string | null = null; // Propiedad para el mensaje de error

  constructor(
    private fb: FormBuilder,
    private loginPrd: AutentifacionService,
    private routerprd: Router,
    private usuarioService: UserService,
    private authSSOService: AuthSSOService,
    private route: ActivatedRoute
  ) {
    this.loginForm = new FormGroup({
      usuario: new FormControl('', Validators.required),
      contraseña: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    // Suscribirse a los queryParams para obtener el mensaje de error
    this.route.queryParams.subscribe((params) => {
      if (params['error']) {
        this.errorMessage = params['error'];
      }
    });
  }

  loginGoogle() {
    sessionStorage.setItem('sso_provider', 'google');
    this.authSSOService.login('google');
  }

  loginMicrosoft() {
    sessionStorage.setItem('sso_provider', 'microsoft');
    this.authSSOService.login('microsoft');
  }

  iniciarSesion(): void {
    this.loading = true;
    const usuarioModel = {
      correo: this.loginForm.value.usuario,
      contraseña: this.loginForm.value.contraseña,
    };

    this.usuarioService.login(usuarioModel).subscribe(
      (response: any) => {
        const usuario = response.body;
        sessionStorage.setItem('token', JSON.stringify(usuario));
        sessionStorage.setItem('area', usuario.areaIdArea.nombre_area);
        sessionStorage.setItem('correo', usuario.correo_institucional);
        sessionStorage.setItem('nombre', usuario.pnombre);
        console.log(usuario);
        this.loading = false;
        this.routerprd.navigateByUrl('/perfil');
      },
      (error: any) => {
        this.loading = false;
        console.error('Error al iniciar sesión:', error);
      }
    );
  }
}
