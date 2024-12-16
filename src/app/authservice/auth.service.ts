import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getRole(): string {
    const correo = sessionStorage.getItem('correo');
    if (correo != null) {
      if (correo.endsWith('@profesor.duoc.cl')) return 'profesor';
      if (correo.endsWith('@duocuc.cl')) return 'alumno';
      if (correo.endsWith('@duoc.cl')) return 'profesor';
      if (correo.endsWith('@stockduocpv.cl')) return 'admin';
    }
    return '';
  }
}
