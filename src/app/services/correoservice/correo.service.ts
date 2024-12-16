import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CorreoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  sendMail(to: string, subject: string, text: string): Observable<any> {
    const body = { to, subject, text };
    return this.http.post(`${this.apiUrl}/mail/sendmail`, body);
  }
}


// Como darle uso
 /**
import { Component } from '@angular/core';
import { CorreoService } from './email.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mi aplicación Angular';

  constructor(private emailService: EmailService) { }

  sendEmail() {
    this.emailService.sendMail('destinatario@example.com', 'Asunto del correo', 'Texto del correo')
      .subscribe(response => {
        console.log(response);
      }, error => {
        console.error(error);
      });
  }
}
 */
