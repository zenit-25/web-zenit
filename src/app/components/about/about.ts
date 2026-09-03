import { Component } from '@angular/core';
import { RevealDirective } from '../../core/directives/reveal.directive';

@Component({
  selector: 'app-about',
  imports: [RevealDirective],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly stack = [
    'Angular',
    'TypeScript',
    'HTML5 & SCSS',
    'JavaScript',
    'Node.js',
    'Git & GitHub',
    'Diseño responsivo',
    'Despliegue web',
  ];
}
