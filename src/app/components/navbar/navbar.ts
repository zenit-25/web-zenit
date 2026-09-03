import { Component, HostListener, signal } from '@angular/core';
import { SITE, buildWhatsappLink } from '../../core/data/site.config';

interface NavLink {
  label: string;
  fragment: string;
}

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  protected readonly isScrolled = signal(false);
  protected readonly isMenuOpen = signal(false);
  protected readonly site = SITE;
  protected readonly whatsappLink = buildWhatsappLink();

  protected readonly links: NavLink[] = [
    { label: 'Inicio', fragment: 'inicio' },
    { label: 'Sobre mí', fragment: 'sobre-mi' },
    { label: 'Servicios', fragment: 'servicios' },
    { label: 'Portafolio', fragment: 'portafolio' },
    { label: 'Contacto', fragment: 'contacto' },
  ];

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled.set(window.scrollY > 12);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }
}
