import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  constructor(private oauthService: OAuthService, private router: Router) {
    this.initLogin();
  }

  // En AuthGoogleService
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  initLogin() {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: environment.production
        ? environment.client_id_prod
        : environment.client_id,
      redirectUri: window.location.origin + '/redirect',
      scope: 'openid profile email',
      customQueryParams: {
        prompt: 'select_account',
      },
    };
    //secreto: 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
    this.oauthService.configure(config);
    this.oauthService.setupAutomaticSilentRefresh();
    // this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
    //   const isAuthenticated = this.oauthService.hasValidAccessToken();
    //   this.isAuthenticatedSubject.next(isAuthenticated);
    // });
    // Modificación aquí
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

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    // Limpiar el sessionStorage
    sessionStorage.clear();
    // Opcionalmente, si el método revokeTokenAndLogout está disponible, úsalo para revocar el token
    this.oauthService.revokeTokenAndLogout();
  }
  getProfile() {
    return this.oauthService.getIdentityClaims();
  }
}
