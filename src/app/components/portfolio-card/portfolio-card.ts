import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../core/models/project.model';

@Component({
  selector: 'app-portfolio-card',
  imports: [RouterLink],
  templateUrl: './portfolio-card.html',
  styleUrl: './portfolio-card.scss',
})
export class PortfolioCard {
  readonly project = input.required<Project>();
}
