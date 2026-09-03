import { Component } from '@angular/core';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { SERVICES } from '../../core/data/services.data';

@Component({
  selector: 'app-services',
  imports: [RevealDirective],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  protected readonly services = SERVICES;
}
