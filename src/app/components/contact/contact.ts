import { Component } from '@angular/core';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { SITE, buildWhatsappLink } from '../../core/data/site.config';

@Component({
  selector: 'app-contact',
  imports: [RevealDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  protected readonly site = SITE;
  protected readonly whatsappLink = buildWhatsappLink();

  protected readonly channels = [
    {
      icon: 'whatsapp',
      label: 'WhatsApp',
      value: SITE.whatsappDisplay,
      href: buildWhatsappLink(),
    },
    {
      icon: 'mail',
      label: 'Correo',
      value: SITE.email,
      href: `mailto:${SITE.email}`,
    },
    {
      icon: 'github',
      label: 'GitHub',
      value: 'github.com/zenit-25',
      href: SITE.github,
    },
  ];
}
