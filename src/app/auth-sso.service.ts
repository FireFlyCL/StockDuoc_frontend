import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthSSOService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private oauthService: OAuthService, private router: Router) {}

  // Configuración predeterminada
  private provider: 'google' | 'microsoft' = 'google'; // Default to Google

  // Configuración común
  private config: AuthConfig = {
    strictDiscoveryDocumentValidation: false,
    redirectUri: window.location.origin + '/redirect',
    scope: 'openid profile email',
    customQueryParams: {
      prompt: 'select_account',
    },
  };

  // Inicializa el login según el proveedor seleccionado
  initLogin(provider: 'google' | 'microsoft') {
    this.provider = provider;

    const config: AuthConfig = {
      ...this.config,
      clientId:
        provider === 'google'
          ? environment.client_id_google // Usar el client_id para Google
          : environment.client_id_microsoft, // Usar el client_id para Microsoft
      issuer:
        provider === 'google'
          ? 'https://accounts.google.com' // Issuer para Google
          : `https://login.microsoftonline.com/${environment.tenant_id_microsoft}/v2.0`, // Issuer para Microsoft
    };

    // Configura OAuthService con los parámetros
    this.oauthService.configure(config);
    this.oauthService.setupAutomaticSilentRefresh();

    // Intenta cargar el documento de descubrimiento y realizar el login
    this.oauthService
      .loadDiscoveryDocumentAndTryLogin()
      .then((result) => {
        console.log('Resultado de la redirección:', result);
        const isAuthenticated = this.oauthService.hasValidAccessToken();
        this.isAuthenticatedSubject.next(isAuthenticated);
      })
      .catch((error) => {
        console.error('Error en la redirección:', error);
      });
  }

  public resumeLoginFlow() {
  this.oauthService
    .loadDiscoveryDocumentAndTryLogin()
    .then(() => {
      const isAuthenticated = this.oauthService.hasValidAccessToken();
      this.isAuthenticatedSubject.next(isAuthenticated);
    })
    .catch((error) => {
      console.error('Error en resumeLoginFlow:', error);
    });
}

  // Función de login (para Google o Microsoft)
  login(provider: 'google' | 'microsoft') {
    this.initLogin(provider); // Cambia el proveedor
    this.oauthService.initLoginFlow();
  }

  // Función para cerrar sesión
  logout() {
    sessionStorage.clear();
    this.oauthService.revokeTokenAndLogout();
  }

  // Obtener el perfil del usuario autenticado
  getProfile() {
    return this.oauthService.getIdentityClaims();
  }
}


