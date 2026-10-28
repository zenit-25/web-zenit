import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE, buildWhatsappLink } from '../../core/data/site.config';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  protected readonly site = SITE;
  protected readonly whatsappLink = buildWhatsappLink(
    'Hola, quiero cotizar el desarrollo de un sitio web con Zenit Digital.',
  );

  protected readonly stats = [
    { value: '100%', label: 'A la medida del cliente' },
    { value: 'Directa', label: 'Comunicación con el cliente' },
    { value: 'Angular', label: 'Stack principal' },
  ];
}
