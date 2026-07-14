import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Schritt = 'raetsel' | 'formular' | 'fertig';
type SendeFehler = 'captcha' | 'senden' | null;

// Das Lösungswort steht nicht im Code – geprüft wird nur der SHA-256-Hash von
// "SALT:lösungswort" (kleingeschrieben). Neuen Hash erzeugen mit:
// node -e "console.log(require('crypto').createHash('sha256').update('maislabyrinth-freiamt:NEUESWORT').digest('hex'))"
const SALT = 'maislabyrinth-freiamt';
const LOESUNGSWORT_HASH = '833120237f894b1daaddff8a2b6a3fd7303e7a5ddfcd9cf4937e2b6ebce25824';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzfn_Hfl0AbPpBaDz7JUPBdG1hBmed4lxZU7ueBwjfQ8010YYWrq3US0wp5U_ywZZQxig/exec';
const RECAPTCHA_SITE_KEY = '6LeqEVMtAAAAAIVE5e3-uvRzHgAKCB-utloAb2l9';

declare const grecaptcha: {
  ready(callback: () => void): void;
  render(container: HTMLElement, parameter: { sitekey: string }): number;
  getResponse(widgetId?: number): string;
  reset(widgetId?: number): void;
};

@Component({
  selector: 'app-verlosung',
  imports: [FormsModule],
  templateUrl: './verlosung.html',
})
export class Verlosung {
  // Auf true setzen, sobald das Maislabyrinth eröffnet ist und die Verlosung startet
  protected readonly verlosungAktiv = false;

  protected readonly preise = [
    'Übernachtung im Planzer-Motel',
    '2 Tageseintritte Skigebiet Arosa Lenzerheide',
    '1 Stunde Sprungzeit in der Jump Factory Wohlen',
    'Eintritt Kletterhalle «Bouba» in Baden',
    '2-Tageseintritte Schüwo Park Wohlen',
    'Chnorrlimorrli-Kinderbuch Teil 2',
  ];

  protected readonly schritt = signal<Schritt>('raetsel');
  protected readonly falschesWort = signal(false);
  protected readonly sendet = signal(false);
  protected readonly sendeFehler = signal<SendeFehler>(null);

  protected loesungswort = '';
  protected name = '';
  protected email = '';
  protected handy = '';
  protected wunschpreis = '';

  private readonly captchaContainer = viewChild<ElementRef<HTMLElement>>('captchaContainer');
  private captchaWidgetId?: number;

  async pruefeLoesungswort() {
    const eingabe = this.loesungswort.trim().toLowerCase();
    const daten = new TextEncoder().encode(`${SALT}:${eingabe}`);
    const digest = await crypto.subtle.digest('SHA-256', daten);
    const hash = Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');

    if (hash === LOESUNGSWORT_HASH) {
      this.falschesWort.set(false);
      this.schritt.set('formular');
      // Captcha rendern, sobald Angular das Formular in den DOM gesetzt hat
      setTimeout(() => this.zeigeCaptcha());
    } else {
      this.falschesWort.set(true);
    }
  }

  async sendeTeilnahme() {
    const token = typeof grecaptcha !== 'undefined' ? grecaptcha.getResponse(this.captchaWidgetId) : '';
    if (!token) {
      this.sendeFehler.set('captcha');
      return;
    }

    this.sendet.set(true);
    this.sendeFehler.set(null);
    try {
      const antwort = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        // text/plain vermeidet den CORS-Preflight, den Apps Script nicht beantwortet
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          name: this.name,
          email: this.email,
          handy: this.handy,
          wunschpreis: this.wunschpreis,
          loesungswort: this.loesungswort,
          recaptchaToken: token,
        }),
      });
      const ergebnis = await antwort.json();
      if (!ergebnis.ok) {
        throw new Error(ergebnis.fehler);
      }
      this.schritt.set('fertig');
    } catch {
      this.sendeFehler.set('senden');
      if (typeof grecaptcha !== 'undefined') {
        grecaptcha.reset(this.captchaWidgetId);
      }
    } finally {
      this.sendet.set(false);
    }
  }

  private async zeigeCaptcha() {
    const container = this.captchaContainer()?.nativeElement;
    if (!container || this.captchaWidgetId !== undefined) {
      return;
    }
    await this.ladeRecaptchaScript();
    grecaptcha.ready(() => {
      this.captchaWidgetId = grecaptcha.render(container, { sitekey: RECAPTCHA_SITE_KEY });
    });
  }

  private ladeRecaptchaScript(): Promise<void> {
    if (typeof grecaptcha !== 'undefined') {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('reCAPTCHA-Script konnte nicht geladen werden'));
      document.head.appendChild(script);
    });
  }
}
