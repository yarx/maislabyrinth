import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);

  protected readonly menuOpen = signal(false);

  // Routen mit data.vollbild (z.B. Abschiedsseite) werden ohne Header und Footer angezeigt.
  // Startwert true, damit Header/Footer vor der ersten Navigation nicht kurz aufblitzen.
  protected readonly vollbild = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let route = this.router.routerState.snapshot.root;
        while (route.firstChild) route = route.firstChild;
        return route.data['vollbild'] === true;
      }),
    ),
    { initialValue: true },
  );

  protected readonly navLinks = [
    { path: '/home', label: 'Home' },
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
