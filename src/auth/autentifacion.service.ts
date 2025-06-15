import { Injectable } from '@angular/core';
import { AuthSSOService } from 'src/app/auth-sso.service';

@Injectable({
  providedIn: 'root'
})
export class AutentifacionService {

  private ingresar = false;

  constructor(private authSSOService: AuthSSOService) {}

  public habilitarlogeo(): boolean {
    return this.ingresar;
  }

  public getAutenticationByToken(): string | null {
    // Dependiendo del proveedor, puede haber un "token" o un "id_token"
    return sessionStorage.getItem('token') || sessionStorage.getItem('id_token');
  }

  public limpiarToken(): boolean {
    sessionStorage.clear();

    // Llamada segura al logout SSO (Google o Microsoft)
    try {
      this.authSSOService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión en SSO:', error);
    }

    return true;
  }
}

