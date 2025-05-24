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

  initLogin(provider: 'google' | 'microsoft') {
    // 👇 Detenemos cualquier flujo previo
    this.oauthService.logOut(true);

    const config: AuthConfig = {
      issuer:
        provider === 'google'
          ? 'https://accounts.google.com'
          : 'https://login.microsoftonline.com/common/v2.0',
      strictDiscoveryDocumentValidation: false,
      requireHttps: false, // 👈 NECESARIO para entorno localhost sin HTTPS
      clientId:
        provider === 'google'
          ? environment.client_id
          : environment.client_id_microsoft,
      redirectUri: window.location.origin + '/redirect',
      scope: 'openid profile email',
      customQueryParams: {
        prompt: 'select_account',
      },
    };

    // 👇 Importante: configurar antes de todo lo demás
    this.oauthService.configure(config);

    // 👉 NO activar silent refresh hasta que el login funcione correctamente
    // this.oauthService.setupAutomaticSilentRefresh();

    this.oauthService
      .loadDiscoveryDocumentAndTryLogin()
      .then(() => {
        const isAuthenticated = this.oauthService.hasValidAccessToken();
        this.isAuthenticatedSubject.next(isAuthenticated);
        if (!isAuthenticated) {
          this.login(); // 👈 Si no está autenticado, iniciar el login manualmente
        }
      })
      .catch((error) => {
        console.error('Error en loadDiscoveryDocumentAndTryLogin:', error);
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

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    sessionStorage.clear();
    this.oauthService.revokeTokenAndLogout();
  }

  getProfile() {
    return this.oauthService.getIdentityClaims();
  }
}
