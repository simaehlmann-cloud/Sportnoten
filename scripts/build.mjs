/**
 * Baut aus index.html das Verzeichnis www/ für die App.
 *
 * Was hier passiert:
 *  1. Das JSX im <script type="text/babel"> wird einmal vorab übersetzt (app.js).
 *     Dadurch braucht die fertige App kein Babel mehr und startet spürbar schneller.
 *  2. React und ReactDOM werden heruntergeladen und lokal abgelegt.
 *     Die App läuft danach vollständig offline – wichtig in einer Sporthalle ohne Netz.
 *  3. Icons und ein Web-Manifest kommen dazu, damit die Seite auch über GitHub Pages
 *     als installierbare Web-App funktioniert.
 */
import fs from "node:fs/promises";
import path from "node:path";
import * as Babel from "@babel/standalone";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "www");

const VENDOR = [
  ["react.production.min.js", "https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"],
  ["react-dom.production.min.js", "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"],
];

async function main() {
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(path.join(OUT, "vendor"), { recursive: true });
  await fs.mkdir(path.join(OUT, "assets"), { recursive: true });

  let html = await fs.readFile(path.join(ROOT, "index.html"), "utf8");

  /* --- 1. JSX übersetzen --- */
  const m = html.match(/<script type="text\/babel" data-presets="react">([\s\S]*?)<\/script>/);
  if (!m) throw new Error("Der App-Code (script type=text/babel) wurde in index.html nicht gefunden.");
  const { code } = Babel.transform(m[1], { presets: ["react"], compact: false });
  await fs.writeFile(path.join(OUT, "app.js"), code, "utf8");
  html = html.replace(m[0], '<script src="app.js"></script>');

  /* --- 2. React lokal ablegen --- */
  for (const [name, url] of VENDOR) {
    process.stdout.write("lade " + name + " … ");
    const res = await fetch(url);
    if (!res.ok) throw new Error("Download fehlgeschlagen: " + url);
    await fs.writeFile(path.join(OUT, "vendor", name), Buffer.from(await res.arrayBuffer()));
    html = html.replace(new RegExp('<script crossorigin src="' + url + '"></script>'), '<script src="vendor/' + name + '"></script>');
    console.log("fertig");
  }
  /* Babel wird zur Laufzeit nicht mehr gebraucht */
  html = html.replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/babel-standalone[^"]*"><\/script>\s*/g, "");

  if (html.includes("cdnjs.cloudflare.com")) {
    console.warn("Achtung: es verweist noch etwas auf ein CDN.");
  }

  /* --- 3. Icons und Manifest --- */
  for (const f of ["favicon-192.png", "icon-512.png", "icon.png"]) {
    await fs.copyFile(path.join(ROOT, "assets", f), path.join(OUT, "assets", f));
  }
  const manifest = {
    name: "Sportnoten – Notenverwaltung",
    short_name: "Sportnoten",
    description: "Notenverwaltung für den Sportunterricht: Klassen, Teilnoten, Leistungstabellen, Anwesenheit.",
    start_url: ".",
    display: "standalone",
    orientation: "any",
    background_color: "#EFF3F1",
    theme_color: "#0E7C5A",
    lang: "de",
    icons: [
      { src: "assets/favicon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "assets/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "assets/icon.png", sizes: "1024x1024", type: "image/png", purpose: "any" },
    ],
  };
  await fs.writeFile(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  html = html.replace("</head>", '<link rel="manifest" href="manifest.json" />\n</head>');

  await fs.writeFile(path.join(OUT, "index.html"), html, "utf8");
  console.log("www/ gebaut – " + (html.length / 1024).toFixed(0) + " kB HTML, " + (code.length / 1024).toFixed(0) + " kB App-Code.");
}

main().catch((e) => { console.error(e); process.exit(1); });
