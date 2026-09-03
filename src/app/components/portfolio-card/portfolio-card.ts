import { Component, input } from '@angular/core';
import { Project } from '../../core/models/project.model';

@Component({
  selector: 'app-portfolio-card',
  imports: [],
  templateUrl: './portfolio-card.html',
  styleUrl: './portfolio-card.scss',
})
export class PortfolioCard {
  readonly project = input.required<Project>();
}
