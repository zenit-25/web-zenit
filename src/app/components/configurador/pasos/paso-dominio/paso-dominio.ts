import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DOMINIOS } from '../../../../core/data/configurador/catalogo.data';
import { Solicitud } from '../../../../core/models/solicitud.model';
import { calcularHosting } from '../../../../core/services/hosting-score';
import { SolicitudStore } from '../../../../core/services/solicitud.store';
import { CampoComentario } from '../../campo-comentario/campo-comentario';
import { InfoTip } from '../../info-tip/info-tip';

@Component({
  selector: 'app-paso-dominio',
  imports: [FormsModule, CampoComentario, InfoTip],
  templateUrl: './paso-dominio.html',
})
export class PasoDominio {
  protected readonly store = inject(SolicitudStore);
  protected readonly s = this.store.solicitud;
  protected readonly dominios = DOMINIOS;

  protected readonly opcionesDominio: {
    id: Solicitud['dominio']['estado'];
    nombre: string;
    info: string;
  }[] = [
    { id: 'tengo', nombre: 'Ya tengo dominio', info: 'Lo conectamos a tu nueva página.' },
    { id: 'necesito', nombre: 'Necesito uno', info: 'Te ayudamos a escogerlo y comprarlo.' },
    { id: 'nose', nombre: 'No estoy seguro', info: 'Lo revisamos juntos en la reunión.' },
  ];

  protected readonly opcionesTrafico: {
    id: Solicitud['hosting']['trafico'];
    nombre: string;
    info: string;
  }[] = [
    { id: 'bajo', nombre: 'Bajo', info: 'Hasta 1.000 visitas al mes.' },
    { id: 'medio', nombre: 'Medio', info: 'Entre 1.000 y 10.000 visitas al mes.' },
    { id: 'alto', nombre: 'Alto', info: 'Más de 10.000 visitas al mes.' },
  ];

  protected readonly necesidades: {
    campo: 'usuarios' | 'baseDatos' | 'panel' | 'archivos';
    nombre: string;
    info: string;
  }[] = [
    {
      campo: 'usuarios',
      nombre: 'Usuarios con cuenta',
      info: 'Tus clientes se registran e inician sesión.',
    },
    {
      campo: 'baseDatos',
      nombre: 'Guardar información',
      info: 'Pedidos, clientes, inventario u otros registros.',
    },
    {
      campo: 'panel',
      nombre: 'Panel administrativo',
      info: 'Un área privada para gestionar tu negocio.',
    },
    {
      campo: 'archivos',
      nombre: 'Subida de archivos',
      info: 'Tus usuarios suben fotos o documentos.',
    },
  ];

  protected get hosting() {
    return calcularHosting(this.s);
  }

  protected elegirDominio(id: Solicitud['dominio']['estado']): void {
    this.s.dominio.estado = id;
    this.store.guardar();
  }

  protected elegirTrafico(id: Solicitud['hosting']['trafico']): void {
    this.s.hosting.trafico = id;
    this.store.guardar();
  }

  protected alternarNecesidad(campo: 'usuarios' | 'baseDatos' | 'panel' | 'archivos'): void {
    this.s.hosting[campo] = !this.s.hosting[campo];
    this.store.guardar();
  }
}
