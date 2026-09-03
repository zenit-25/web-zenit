import { Component } from '@angular/core';
import { SITE } from '../../core/data/site.config';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly site = SITE;
  protected readonly year = new Date().getFullYear();
}
