<img src="assets/icon-512.png" width="96" alt="Sportnoten" align="left" />

# Sportnoten – Notenverwaltung

Notenverwaltung für den Sportunterricht: Klassen und Halbjahre führen, Teilnoten gewichten,
Weiten und Zeiten automatisch benoten, Anwesenheit festhalten und am Ende eine belastbare
Zeugnisnote haben. Ohne Konto, ohne Cloud, ohne Werbung – alle Daten bleiben auf dem Gerät.

<br clear="left" />

## Was in diesem Ordner liegt

| Datei / Ordner | Wofür |
| --- | --- |
| `index.html` | Die komplette App. Lässt sich per Doppelklick im Browser öffnen. |
| `assets/` | App-Icon, Startbildschirme, Logo als SVG. |
| `scripts/build.mjs` | Baut aus `index.html` das Verzeichnis `www/` für die APK. |
| `capacitor.config.json` | Name, Paket-ID und Einstellungen der Android-App. |
| `package.json` | Liste der benötigten Pakete. |
| `.github/workflows/android.yml` | Baut die APK automatisch bei GitHub. |

Die Ordner `node_modules/`, `www/` und `android/` entstehen beim Bauen von selbst und
gehören nicht ins Repository – dafür sorgt die `.gitignore`.

## Schritt für Schritt zur APK

### 1. Repository anlegen

1. Bei [github.com](https://github.com) anmelden, oben rechts auf **+** → **New repository**.
2. Namen vergeben, z. B. `sportnoten`. **Private** wählen, wenn niemand sonst den Code sehen soll –
   Actions funktionieren auch in privaten Repositories.
3. **Create repository**.

### 2. Dateien hochladen

Auf der Seite des leeren Repositories auf **uploading an existing file** klicken und den gesamten
Inhalt dieses Ordners hineinziehen, danach unten auf **Commit changes**.

Wichtig: Der Ordner `.github` muss mitkommen. Manche Systeme blenden Ordner mit einem Punkt am
Anfang aus. Falls er beim Hochladen fehlt, im Repository auf **Add file → Create new file** gehen
und als Dateinamen genau `.github/workflows/android.yml` eintippen – GitHub legt die Ordner dann
selbst an – und den Inhalt der Datei hineinkopieren.

### 3. Bauen lassen

1. Im Repository auf den Reiter **Actions**. Falls gefragt wird, ob Workflows laufen dürfen:
   **I understand my workflows, go ahead and enable them**.
2. Links **APK bauen** anklicken, rechts **Run workflow** → **Run workflow**.
3. Der Lauf dauert etwa fünf bis zehn Minuten. Wenn ein grüner Haken erscheint, unten unter
   **Artifacts** die Datei **Sportnoten-APK** herunterladen. Darin liegt die APK.

Ab jetzt baut GitHub bei jeder Änderung an `index.html` automatisch eine neue APK.

### 4. Auf dem Handy installieren

Die APK auf das Android-Gerät kopieren und öffnen. Beim ersten Mal fragt Android nach der
Erlaubnis, Apps aus dieser Quelle zu installieren – das ist normal bei Apps, die nicht aus dem
Play Store kommen.

### 5. Eine Version veröffentlichen (optional)

Wer eine feste Version ablegen will: im Repository auf **Releases → Create a new release**, als Tag
`v1.0.0` eintragen und veröffentlichen. Der Workflow hängt die APK automatisch an die Release-Seite,
sodass sie sich über einen festen Link verteilen lässt.

## Etwas an der App ändern

Alles steckt in `index.html`. Datei bearbeiten, hochladen bzw. committen – der nächste
Workflow-Lauf erzeugt die neue APK. Zum Ausprobieren reicht ein Doppelklick auf `index.html`
im Browser; die Daten liegen dann im Browser-Speicher und sind von denen der App getrennt.

## Auf dem eigenen Rechner bauen (optional)

Voraussetzung sind Node.js und Android Studio.

```bash
npm install
npm run build         # erzeugt www/
npx cap add android   # nur beim ersten Mal
npm run icons         # App-Icons aus assets/ erzeugen
npx cap sync android
cd android && ./gradlew assembleDebug
```

Die fertige Datei liegt danach unter `android/app/build/outputs/apk/debug/app-debug.apk`.

## Für den Play Store

Die hier gebaute APK ist eine Testversion (Debug). Für den Play Store werden zusätzlich gebraucht:

* Ein **signiertes App-Bundle** (`./gradlew bundleRelease`) mit einem eigenen Schlüssel.
  Den Schlüssel gut aufbewahren – ohne ihn lässt sich die App später nicht mehr aktualisieren.
  Im Workflow lässt sich das über GitHub-Secrets ergänzen (Schlüsseldatei als Base64,
  Passwörter als Secrets).
* Ein **Entwicklerkonto** (einmalig 25 US-Dollar).
* Eine öffentlich erreichbare **Datenschutzerklärung** als Adresse im Netz.
* Das ausgefüllte Formular zur **Datensicherheit**: Diese App erhebt keine Daten, gibt keine
  weiter und nutzt keine Analyse – das lässt sich so eintragen.
* Eine **Altersfreigabe** und die Angabe der Zielgruppe.

Die Paket-ID steht in `capacitor.config.json` und lautet `de.maehlmann.sportnoten`. Sie lässt sich
vor der ersten Veröffentlichung noch ändern, danach nicht mehr.

## Datenschutz

Die App speichert ausschließlich lokal auf dem Gerät und überträgt nichts an Server. Wer damit
personenbezogene Daten von Schülerinnen und Schülern verarbeitet, braucht dafür in der Regel die
schriftliche Genehmigung der Schulleitung; verantwortlich im Sinne der DSGVO bleibt die Schule.
Gesundheitsdaten gehören nicht in diese App. Sicherungen sollten verschlüsselt abgelegt werden –
die Funktion dafür ist eingebaut.

---

Entwickelt von Simon Mählmann.
