/**
 * Backend für die Verlosung des Maislabyrinths Freiamt.
 *
 * Dieses Script wird NICHT mit der Webseite deployt, sondern manuell als
 * Google-Apps-Script-Web-App an das Google Sheet gehängt, das die Teilnahmen
 * sammelt (Anleitung siehe README-Abschnitt bzw. Chat).
 *
 * Benötigte Script-Properties (Projekteinstellungen → Skripteigenschaften):
 *   RECAPTCHA_SECRET  – Geheimer Schlüssel von https://www.google.com/recaptcha/admin
 *   LOESUNGSWORT      – Das Lösungswort im Klartext (nur hier, nie im Frontend)
 */

const SHEET_NAME = 'Teilnahmen';

function doPost(e) {
  try {
    const daten = JSON.parse(e.postData.contents);
    const props = PropertiesService.getScriptProperties();

    // 1. reCAPTCHA-Token bei Google verifizieren
    const recaptchaAntwort = UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'post',
      payload: {
        secret: props.getProperty('RECAPTCHA_SECRET'),
        response: String(daten.recaptchaToken || ''),
      },
    });
    const recaptcha = JSON.parse(recaptchaAntwort.getContentText());
    if (!recaptcha.success) {
      return antwortJson({ ok: false, fehler: 'recaptcha' });
    }

    // 2. Lösungswort serverseitig prüfen
    const wort = String(daten.loesungswort || '').trim().toLowerCase();
    const erwartet = String(props.getProperty('LOESUNGSWORT') || '').trim().toLowerCase();
    if (!erwartet || wort !== erwartet) {
      return antwortJson({ ok: false, fehler: 'loesungswort' });
    }

    // 3. Pflichtfelder minimal validieren
    const name = String(daten.name || '').trim();
    const email = String(daten.email || '').trim();
    const handy = String(daten.handy || '').trim();
    const wunschpreis = String(daten.wunschpreis || '').trim();
    if (!name || !email || !handy) {
      return antwortJson({ ok: false, fehler: 'eingabe' });
    }

    // 4. Teilnahme als neue Zeile anhängen
    const blatt = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    blatt.appendRow([new Date(), name, email, handy, wunschpreis]);

    return antwortJson({ ok: true });
  } catch (fehler) {
    return antwortJson({ ok: false, fehler: 'server' });
  }
}

function antwortJson(objekt) {
  return ContentService.createTextOutput(JSON.stringify(objekt)).setMimeType(
    ContentService.MimeType.JSON
  );
}
