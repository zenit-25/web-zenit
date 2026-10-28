import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PROJECTS } from '../../core/data/projects.data';
import { PortfolioCard } from './portfolio-card';

describe('PortfolioCard', () => {
  let component: PortfolioCard;
  let fixture: ComponentFixture<PortfolioCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', PROJECTS[0]);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
