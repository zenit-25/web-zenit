import { Component } from '@angular/core';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { PortfolioCard } from '../portfolio-card/portfolio-card';
import { PROJECTS } from '../../core/data/projects.data';

@Component({
  selector: 'app-portfolio',
  imports: [RevealDirective, PortfolioCard],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
})
export class Portfolio {
  protected readonly projects = PROJECTS;
}
