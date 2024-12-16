import { Injectable } from '@angular/core';
import { AuthGoogleService } from 'src/app/auth-google.service';

@Injectable({
  providedIn: 'root'
})
export class AutentifacionService {

  private ingresar:boolean = false;

  constructor(private authGoogleService: AuthGoogleService) { }


  // public  ingresarAplicativo(obj:any):boolean{
  //   this.ingresar = obj.usuario == 'samv' && obj.password=='123';
  //     return this.ingresar;
  // }

  public habilitarlogeo(){
    return this.ingresar;
  }


  public getAutenticationByToken(){
    //let token = sessionStorage.getItem("token")
    let token = sessionStorage.getItem("id_token")
    return token;
  }

  public limpiarToken(){
    sessionStorage.clear();
    sessionStorage.setItem("nombre",'')
    sessionStorage.setItem("correo",'')
    sessionStorage.setItem("area",'')
    sessionStorage.clear()
    // try {
    //   this.authGoogleService.logout()
    // } catch (error) {
    //   console.log(error);
      
    // }
    
    return true;
  }
}
