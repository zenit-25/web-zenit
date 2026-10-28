import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/data/site.config';

/** Política de tratamiento de datos personales (Ley 1581 de 2012, Colombia). */
@Component({
  selector: 'app-privacidad',
  imports: [RouterLink],
  templateUrl: './privacidad.html',
  styleUrl: './privacidad.scss',
})
export class Privacidad {
  protected readonly site = SITE;
}
