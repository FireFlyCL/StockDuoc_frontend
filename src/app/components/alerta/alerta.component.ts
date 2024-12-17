import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService, Cliente, Escuela } from 'src/app/services/cliente/cliente.service';

@Component({
    selector: 'app-alerta',
    templateUrl: './alerta.component.html',
    styleUrls: ['./alerta.component.css'],
    standalone: false
})
export class AlertaComponent {
  escuelas: Escuela[] = [];
  clienteForm: FormGroup;

  constructor(private clienteService: ClienteService , private router: Router,) {
    this.clienteForm = new FormGroup({
      idEscuela: new FormControl('')
    });
  }

  ngOnInit() {
    this.cargarEscuelas();
  }

  agregarCliente() {
    if (this.clienteForm.valid) {
      let idEscuela = this.clienteForm.get('idEscuela')?.value;
      let correo = sessionStorage.getItem('correo');
      if (correo) {
        const nuevoCliente = { correo, idEscuela };
        this.clienteService.crearCliente(nuevoCliente).subscribe({
          next: (clienteCreado) => {
            console.log('Cliente creado con éxito', clienteCreado);
            this.router.navigateByUrl("/perfil");
          },
          error: (error) => {
            console.error('Hubo un error al crear el cliente', error);
          }
        });
      }
    }
  }

  cargarEscuelas() {
    this.clienteService.listarEscuelas().subscribe({
      next: (escuelas) => {
        this.escuelas = escuelas;
      },
      error: (error) => {
        console.error('Hubo un error al obtener las escuelas', error);
      }
    });
  }
}
