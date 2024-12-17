import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import 'moment/locale/ja';
import 'moment/locale/fr';
import moment from 'moment';
import {
  Solicitud,
  SolicitudService,
} from 'src/app/services/solicitudservice/solicitud.service';
import { ProductoService } from 'src/app/services/productoservice/producto.service';
import { SolproductService } from 'src/app/services/solproductservice/solproduct.service';
import { Router } from '@angular/router';
import { CarritoService } from 'src/app/services/carritoService/carrito.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SolicitudProducto } from '../addproducto/addproducto.component';
import { catchError, map, throwError } from 'rxjs';
import { MailService } from 'src/app/services/mailService/mail.service';
import { UserService } from 'src/app/services/userservice/user.service';

@Component({
  selector: 'app-addsolicitud',
  templateUrl: './addsolicitud.component.html',
  styleUrls: ['./addsolicitud.component.css'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'es-CL' },
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
//@Inject(MAT_DIALOG_DATA) public id_lugar: number,
export class AddsolicitudComponent implements OnInit {
  solicitudForm!: FormGroup;
  isLoading = false; // Asumiendo que tienes una variable para manejar la carga
  minDate!: Date;
  products!: [];
  seleccionados: Array<[number, number]> = [];
  horas: string[] = [];
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public solProd: any[],
    private carritoService: CarritoService,
    private solicitudService: SolicitudService,
    private solProductosService: SolproductService,
    public dialog: MatDialog,
    private mailService: MailService,
    private usuarioService: UserService
  ) {
    this.minDate = new Date(); // Obtener la fecha actual
    this.minDate.setDate(this.minDate.getDate() + 2);
  } // Añadir 2 días

  ngOnInit(): void {
    this.inicializarHoras();
    this.solicitudForm = this.fb.group({
      area: [''],
      fechaEntrega: ['', Validators.required],
      fechaRegreso: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaTermino: ['', Validators.required],
      seccion: ['', Validators.required],
    });
  }

  // atras() {
  //   this.router.navigateByUrl('/perfil');
  // }

  async submitForm() {
    if (this.solicitudForm?.valid) {
      // Obtener el item 'clientedata' de sessionStorage y parsearlo a un objeto
      let clientedataJSON = sessionStorage.getItem('clientedata');
      let clientedata = clientedataJSON ? JSON.parse(clientedataJSON) : null;
      //console.log("clientedata");
      //console.log(clientedata);
      // Asegúrate de que clientedata y clientedata.escuela no sean null o undefined antes de acceder a id_escuela
      let areaId =
        clientedata && clientedata.escuela
          ? clientedata.escuela.id_escuela
          : null;
      let res_nombre_solicitante = sessionStorage.getItem('nombre');
      let res_correo_solicitante =
        clientedata && clientedata.correo ? clientedata.correo : null;
      console.log(areaId);

      //console.log(areaId);
      // Obtén los valores de fecha de Moment y formatearlos
      const fechaEntrega = this.solicitudForm.get('fechaEntrega')?.value;
      const fechaRegreso = this.solicitudForm.get('fechaRegreso')?.value;

      // Formatear las fechas de Moment a string en formato 'YYYY-MM-DD'
      const fechaEntregaFormatted = fechaEntrega
        ? moment(fechaEntrega).format('YYYY-MM-DD')
        : null;
      const fechaRegresoFormatted = fechaRegreso
        ? moment(fechaRegreso).format('YYYY-MM-DD')
        : null;

      // Crear un objeto con los datos del formulario y las fechas formateadas
      if (
        fechaEntregaFormatted &&
        fechaRegresoFormatted &&
        res_correo_solicitante &&
        res_nombre_solicitante
      ) {
        const solicitud = {
          fecha_entrega: fechaEntregaFormatted?.toString(),
          fecha_regreso: fechaRegresoFormatted?.toString(),
          hora_inicio: this.solicitudForm.get('horaInicio')?.value,
          hora_termino: this.solicitudForm.get('horaTermino')?.value,
          idArea: areaId, // Asegúrate de que el formulario tenga un campo 'area'
          nombre_solicitante: res_nombre_solicitante,
          correo_solicitante: res_correo_solicitante,
          seccion: this.solicitudForm.get('seccion')?.value,
        };
        console.log('Formulario válido, enviar datos:', solicitud);

        //AQUI OCUPO MIS SERVICIOS PARA CREAR LA SOLICITUD Y LUEGO LA SOLICITUD_PRODUCTO
        await this.solicitudService
          .crearSolicitud(solicitud)
          .pipe(
            catchError((error) => {
              console.error('Error al crear la solicitud:', error);
              return throwError(() => new Error('Error al crear la solicitud'));
            })
          )
          .subscribe({
            next: (respuestaSolicitud) => {
              // Asumiendo que la respuesta incluye el ID de la nueva solicitud
              const solicitudId = respuestaSolicitud.id_solicitud;

              if (solicitudId) {
                // Ahora crea las solicitudes de producto asociadas a la solicitud creada
                this.solProd.forEach(async (element) => {
                  let nuevaSolicitudProducto: SolicitudProducto = {
                    cantidad: element.cantidad,
                    descripcion: element.descripcion || 'editable',
                    productoId: element.producto.id_producto,
                    solicitudId: solicitudId, // Usa el ID de la solicitud recién creada
                    observacion: element.observacion || 'editable',
                  };

                  await this.solProductosService
                    .crearSolicitudProducto(nuevaSolicitudProducto)
                    .pipe(
                      catchError((error) => {
                        console.error(
                          'Error al crear la solicitud de producto:',
                          error
                        );
                        return throwError(
                          () =>
                            new Error('Error al crear la solicitud de producto')
                        );
                      })
                    )
                    .subscribe({
                      next: async (respuestaProducto) => {
                        console.log(
                          'Solicitud de producto creada con éxito',
                          respuestaProducto
                        );

                        await this.confirmarSolicitud(solicitud);
                        // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
                        this.dialog.closeAll();
                      },
                      error: (error) => {
                        // Manejar errores específicos de la solicitud de producto aquí
                        console.error(error);
                      },
                    });
                });
              } else {
                console.log('NO DEVOLVIO IDSOLICITUD');
              }
            },
            error: (error) => {
              // Manejar errores específicos de la solicitud aquí
              console.error(error);
            },
          });
      }
    } else {
      console.error('Formulario no válido');
    }
  }

  async cargarUsuarios(idArea: number) {
    return await this.usuarioService.getUsuariosPorArea(idArea).pipe(
      map((usuarios) => {
        // Suponiendo que el correo del administrador es el primer usuario
        return usuarios.length > 0 ? usuarios[0].correo_institucional : null;
      })
    );
  }

  async confirmarSolicitud(datosSolicitud: any) {
    (await this.cargarUsuarios(datosSolicitud.idArea)).subscribe({
      next: (correoAdmin) => {
        console.log(correoAdmin);
        if (correoAdmin) {
          this.mailService
            .enviarEmailSolicitudCreada(datosSolicitud)
            .subscribe({
              next: (response) => {
                console.log(
                  'Email de confirmación enviado con éxito',
                  response
                );
                this.mailService
                  .enviarEmailSolicitudCreadaAdmin(datosSolicitud, correoAdmin)
                  .subscribe({
                    next: (response) => {
                      console.log(
                        'Email de confirmación enviado con éxito',
                        response
                      );
                    },
                    error: (error) => {
                      console.error(
                        'Error al enviar email de confirmación',
                        error
                      );
                    },
                  });
              },
              error: (error) => {
                console.error('Error al enviar email de confirmación', error);
              },
            });
        } else {
          console.error('No se encontró el correo del administrador');
        }
      },
      error: (error) => {
        console.error(
          'Hubo un error al obtener el correo del administrador',
          error
        );
      },
    });
  }

  inicializarHoras() {
    // Llena el array con horas (por ejemplo, de 0 a 23)
    for (let i = 9; i < 21; i++) {
      this.horas.push(i.toString().padStart(2, '0') + ':00'); // Añade ceros a la izquierda si es necesario
    }
  }
}

export interface Area {
  id_area: number;
  nombre_area: string;
  deleteAt: null | Date; // Utiliza 'Date' si 'deleteAt' es una fecha, de lo contrario, puedes usar 'any'
}

export interface Producto {
  id_producto: number;
  nombre: string;
  marca: string;
  modelo: string;
  stock_critico: number;
  imagen: string;
  imagenUrl: string;
  area: Area;
  deleteAt: null | Date; // Igual que en la interfaz Area
  descripcion: string;
}

// export interface Producto {
//   id_Producto: number;
//   nombre: string;
//   marca: string;
//   modelo: string;
//   imagen: string;
// }

// export interface solicitud_producto {
//   cantidad: number;
//   descripcion: string;
//   solicitud: {
//     id_Solicitud: number;
//   };
//   producto: {
//     id_Producto: number;
//   };
//   observacion: string;
// }

// solicitudForm!: FormGroup;
//   products!: [];
//   //seleccionados: { id: number}[] = [];
//   seleccionados: Array<[number, number]> = [];
//   isLoading = false;
//   minDate: Date;
//   //solicitudForm2: FormGroup;

//   constructor(private formBuilder: FormBuilder, private _adapter: DateAdapter<any>,
//     @Inject(MAT_DATE_LOCALE) private _locale: string, private soliS: SolicitudService,
//     private productS: ProductoService, private solprodtucS: SolproductService,
//     private router: Router) {

//     this.minDate = new Date(); // Obtener la fecha actual
//     this.minDate.setDate(this.minDate.getDate() + 2); // Añadir 2 días
//     // const current = new Date(); //obtengo fecha actual para el datepicker
//     // this.minDate = new Date(current.setDate(current.getDate() + 2)); //le doy 2 dias mas, para generar el limite de fecha
//     // console.log(this.minDate)
//     // this.solicitudForm2 = new FormGroup({
//     //   fechaEntrega1: new FormControl(null, Validators.required),
//     //   fechaRegreso1: new FormControl(null, Validators.required)
//     // });
//   }

//   dateFilter = (d: Date | null): boolean => {
//     // Permitir fechas nulas (si son válidas en tu contexto) y fechas después de la fecha mínima
//     return !d || d >= this.minDate;
//   };

//   ngOnInit() {
//     this.solicitudForm = this.formBuilder.group({
//       fechaEntrega: ['', Validators.required],
//       fechaRegreso: ['', Validators.required],
//       horaInicio: ['', Validators.required],
//       horaTermino: ['', Validators.required],
//       seccion: ['', Validators.required],
//       area: ['', Validators.required],
//       comentario: ['']
//     });
//   }

//   french() {
//     this._locale = 'es';
//     this._adapter.setLocale(this._locale);
//   }

//   getDateFormatString(): string {
//     if (this._locale === 'es-CL') {
//       return 'DD/MM/YYYY';
//     } else if (this._locale === 'es') {
//       return 'DD/MM/YYYY';
//     }
//     return '';
//   }

//   obtenerProductos(): void {
//     const areaId = this.solicitudForm.value.area;
//     this.productS.getProductosByAreaId(areaId)
//       .subscribe((data: any) => {
//         this.products = data;
//         console.log(this.products)
//       });
//   }

//   toggleSelection(productId: number): void {
//     //console.log(this.getCantidad(productId));
//     const selectedProductIndex = this.seleccionados.some(([id, cant]) => id === productId && cant === this.getCantidad(productId));
//     //console.log(selectedProductIndex);
//     if (selectedProductIndex) {
//       this.seleccionados = this.seleccionados.filter(([id, cant]) => !(id === productId && cant === this.getCantidad(productId)));
//     } else {
//       this.seleccionados.push([productId, 1]);
//     }
//     //console.log(this.seleccionados);
//   }

//   updateCantidad(productId: number, event: any): void {
//     const cantidad = parseInt(event.target.value, 10);
//     const selectedProductIndex = this.seleccionados.findIndex(product => product[0] === productId);
//     if (selectedProductIndex !== -1) {
//       this.seleccionados[selectedProductIndex][1] = cantidad;
//     }
//     //console.log(this.seleccionados);
//   }

//   getCantidad(productId: number): number {
//     const selectedProduct = this.seleccionados.find(product => product[0] === productId);
//     return selectedProduct ? selectedProduct[1] : 1;
//   }

//   getMaximaCantidad(productId: number): number {
//     const selectedProduct = this.products.find(product => product[0] === productId);
//     return selectedProduct ? selectedProduct[4] : 0;
//   }

//   async submitForm(): Promise<any> {
//     this.isLoading = true
//     let data = {}
//     if (this.solicitudForm.valid) {
//       const fechaEntrega = moment(this.solicitudForm.value.fechaEntrega._i).format('YYYY-MM-DD');
//       const fechaRegreso = moment(this.solicitudForm.value.fechaRegreso._i).format('YYYY-MM-DD');
//       this.solicitudForm.get("fechaEntrega")?.setValue(fechaEntrega);
//       this.solicitudForm.get("fechaRegreso")?.setValue(fechaRegreso);
//       //console.log(this.solicitudForm.value.fechaEntrega);
//       //console.log(this.solicitudForm.value.fechaRegreso);
//       const fechaActual = moment().format('YYYY-MM-DD');
//       let nombre_solicitante = sessionStorage.getItem("nombre")
//       let correo_solicitante = sessionStorage.getItem("correo")
//       data = {
//         "fecha_entrega": this.solicitudForm.value.fechaEntrega,
//         "fecha_regreso": this.solicitudForm.value.fechaRegreso,
//         "fecha_solicitud": fechaActual,
//         "hora_inicio": this.solicitudForm.value.horaInicio,
//         "hora_termino": this.solicitudForm.value.horaTermino,
//         "seccion": this.solicitudForm.value.seccion,
//         "estado_solicitud": {
//           "id_Estado_solicitud": 1
//         },
//         "usuario": {
//           "id_Usuario": 2
//         },
//         "nombre_solicitante": nombre_solicitante,
//         "correo_solicitante": correo_solicitante
//       }
//       let mensaje = this.solicitudForm.value.seccion + " " + this.solicitudForm.value.comentario
//       // let response = await this.soliS.createSolicitud(data).subscribe(async (res) => {
//       //   console.log("res: " + res);
//       //   let respuesta2 = await this.soliProducto(res, mensaje)
//       // })
//     } else {
//       console.error("form invalido");
//       this.isLoading = false
//     }
//   }

//   soliProducto(id_solicitude: number, mensaje: string) {//, mensaje: string
//     try {
//       const solicitudproductomodels: Array<solicitud_producto> = []
//       let nombre = sessionStorage.getItem("nombre")
//       if (this.seleccionados.length >= 1) {
//         //console.log("hay: " + this.seleccionados.length);
//         for (let index = 0; index < this.seleccionados.length; index++) {
//           //console.log("index: " + this.seleccionados[index]);

//           let solprod: solicitud_producto = {
//             cantidad: this.seleccionados[index][1],
//             descripcion: nombre + " " + mensaje,
//             solicitud: {
//               id_Solicitud: id_solicitude
//             },
//             producto: {
//               id_Producto: this.seleccionados[index][0]
//             },
//             observacion: ''
//           }
//           solicitudproductomodels.push(solprod)
//           console.log("agregamos el numero: " + index);
//         }
//         solicitudproductomodels.forEach(solicitudproductomodel => {
//           console.log(solicitudproductomodel);
//           this.solprodtucS.saveSolicitudProductoModel(solicitudproductomodel)
//             .subscribe(response => {
//               this.isLoading = false
//               console.log('SolicitudProductoModel guardado:', response);
//               this.router.navigateByUrl('/perfil');
//             }, error => {
//               this.isLoading = false
//               console.error('Error al guardar SolicitudProductoModel:', error);
//             });
//         });
//         this.isLoading = false

//       } else {
//         console.error("no hay productos que solicitar");
//         this.isLoading = false
//       }
//       this.isLoading = false
//     } catch (error) {
//       console.log(error);
//       this.isLoading = false
//     }
//   }
