import { Component, inject } from '@angular/core';
import { WOMPI } from '../../../../core/data/configurador/catalogo.data';
import { Solicitud } from '../../../../core/models/solicitud.model';
import { SolicitudStore } from '../../../../core/services/solicitud.store';
import { CampoComentario } from '../../campo-comentario/campo-comentario';
import { InfoTip } from '../../info-tip/info-tip';

type Pagos = Solicitud['pagos'];

@Component({
  selector: 'app-paso-pagos',
  imports: [CampoComentario, InfoTip],
  templateUrl: './paso-pagos.html',
})
export class PasoPagos {
  protected readonly store = inject(SolicitudStore);
  protected readonly s = this.store.solicitud;
  protected readonly wompi = WOMPI;

  protected readonly opcionesRecibir: { id: Pagos['recibir']; nombre: string; info: string }[] = [
    { id: 'si', nombre: 'Sí', info: 'Quiero cobrar directamente en mi página.' },
    { id: 'despues', nombre: 'Más adelante', info: 'Por ahora no, pero quiero dejarlo previsto.' },
    { id: 'no', nombre: 'No', info: 'Mis clientes pagan por otros medios.' },
  ];

  protected readonly opcionesCuenta: { id: Pagos['cuentaWompi']; nombre: string; info: string }[] =
    [
      {
        id: 'tengo',
        nombre: 'Sí, ya la tengo',
        info: 'Configuramos las llaves juntos al implementar.',
      },
      { id: 'crear', nombre: 'No, la creo yo', info: 'Te dejamos la lista de lo que necesitas.' },
      {
        id: 'ayuda',
        nombre: 'No, necesito ayuda',
        info: 'Te acompañamos en el proceso de creación.',
      },
    ];

  protected readonly opcionesTitular: { id: Pagos['titular']; nombre: string; info: string }[] = [
    { id: 'natural', nombre: 'Persona natural', info: 'Los pagos llegan a tu cuenta personal.' },
    { id: 'empresa', nombre: 'Empresa', info: 'Los pagos llegan a la cuenta de la empresa.' },
  ];

  protected get preguntaCuenta(): boolean {
    return this.s.pagos.recibir === 'si' || this.s.pagos.recibir === 'despues';
  }

  protected elegir<K extends keyof Pagos>(campo: K, valor: Pagos[K]): void {
    this.s.pagos[campo] = valor;
    this.store.guardar();
  }
}
