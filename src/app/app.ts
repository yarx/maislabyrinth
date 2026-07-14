import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
})
export class App {
  protected readonly menuOpen = signal(false);

  protected readonly navLinks = [
    { path: '/', label: 'Home' },
    { path: '/informationen', label: 'Infos' },
    { path: '/geschichtenzeit', label: 'Geschichtenzeit' },
    { path: '/partner', label: 'Partner' },
    { path: '/planzer-motel', label: 'Motel' },
    { path: '/verlosung', label: 'Verlosung' },
    { path: '/ueber-uns', label: 'Über uns' },
    { path: '/kontakt', label: 'Kontakt' },
  ];

  toggleMenu() {
    this.menuOpen.update((open) => !open);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}
