import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Schritt = 'raetsel' | 'formular' | 'fertig';

@Component({
  selector: 'app-verlosung',
  imports: [FormsModule],
  templateUrl: './verlosung.html',
})
export class Verlosung {
  // Auf true setzen, sobald das Maislabyrinth eröffnet ist und die Verlosung startet
  protected readonly verlosungAktiv = false;

  // TODO: Preise gemäss PDF ergänzen/anpassen
  protected readonly preise = [
    '1. Preis (folgt)',
    '2. Preis (folgt)',
    '3. Preis (folgt)',
  ];

  protected readonly schritt = signal<Schritt>('raetsel');
  protected readonly falschesWort = signal(false);

  protected loesungswort = '';
  protected name = '';
  protected email = '';
  protected handy = '';
  protected wunschpreis = '';

  pruefeLoesungswort() {
    if (this.loesungswort.trim().toLowerCase() === 'polenta') {
      this.falschesWort.set(false);
      this.schritt.set('formular');
    } else {
      this.falschesWort.set(true);
    }
  }

  sendeTeilnahme() {
    // TODO: Absenden der Teilnahme wird später implementiert
  }
}
