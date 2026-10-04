# Baltic Wasserveredlung

Eigenständiger, statischer Website-Relaunch auf Basis der vorhandenen Inhalte und Assets. Der aktive Entwicklungsstand liegt in `03_Website_Test`; die archivierten Wix-Kopien werden nicht verändert.

## Lokal ansehen

`index.html` im Dateimanager doppelklicken oder im Browser öffnen. Stylesheets, Skripte, Bilder und Dokumente werden relativ aus diesem Projektordner geladen; ein localhost-Server ist zum Prüfen der Seite nicht erforderlich.

Einige Browser blockieren Videos beim direkten Öffnen über `file://`. In diesem Fall zeigt der jeweilige Video-Poster das vorgesehene Standbild. Für die Prüfung der Videowiedergabe kann optional ein lokaler Server gestartet werden:

```powershell
python -m http.server 8000
```

Dann `http://localhost:8000` im Browser öffnen. Der lokale Server stellt die Videos zuverlässiger bereit als ein direkter Aufruf über `file://`.

## Technischer Stand

- Statische One-Page-Seite ohne Wix-Runtime oder zusätzliche Bibliotheken
- Lokale Bilder, Dokumente, Icons und Videos
- Einheitliches Sans-Serif- und Rastersystem mit inhaltsabhängigen Abschnittshöhen
- Drei harmonisierte Produktdarstellungen mit aufklappbaren technischen Details
- Sticky-Navigation, Video-Poster und responsiver Hero
- Tastaturbedienbares mobiles Menü und Rücksicht auf reduzierte Bewegung
- Layout bei 1440, 1280, 1024, 768 und 390 px geprüft
- Impressum und Datenschutz vorhanden
- Google Maps nur als externer Link; kein Tracking oder Analytics
- Wasser-Farbwelt aus Petrol, Baltic-Blau und Aqua (Tokens in `assets/css/styles.css`), Textkontraste nach WCAG AA

## Videos

Alle Videos sind stumm, ohne Metadaten und als Web-Loop (`muted loop playsinline`) mit Poster (erstes bzw. repräsentatives Standbild des jeweiligen Videos, `assets/images/poster-*.jpg`) eingebunden. Nur das Hero-Video startet per `autoplay`; Basiswissen-, Service- und Footer-Video samt Poster werden erst kurz vor dem Sichtbarwerden geladen (`data-lazy-video` in `assets/js/main.js`) und außerhalb des Sichtbereichs pausiert. Bei reduzierter Bewegung bleiben die Poster stehen.

| Bereich | Datei | Quelle |
|---|---|---|
| Hero | `assets/videos/hero-glass.mp4` (9 s, 1080p, ca. 4 MB) | Pexels „Water Pouring in a Clear Glass“ (4037575) |
| Basiswissen | `assets/videos/basis-waterfall.mp4` | bestehendes Asset |
| Service | `assets/videos/service-water.mp4` | bestehendes Asset |
| Footer | `assets/videos/footer-ripples.mp4` (5,6 s, 720p, ca. 2,3 MB) | Pixabay „Water, Blue, Ripples“ (1934), verlangsamt |

## Logo

Verbindliche Quelle ist `Baltic_Wasserveredlung_Designpaket_V1.1` (Logo V11, Wortmarke als Pfade, font-unabhängig; nur lokal, nicht im Repository). Die Website nutzt unveränderte Kopien aus `02_WEB/`:

| Datei | Einsatz |
|---|---|
| `assets/brand/logo-primary.svg` | Header (hell, Paper `#f5f4ef`) auf allen Seiten |
| `assets/brand/logo-dark-background.svg` | Footer auf dem Wasser-Video: abgeleitet aus `logo-primary.svg`, Geometrie und Wellenverläufe unverändert, nur die drei Textfüllungen auf `#FFFFFF` |
| `assets/brand/logo-white.svg` | Monochrome Weißvariante (Designsystem; derzeit nicht eingebunden) |
| `assets/brand/favicon.svg` | Favicon (SVG, quadratische Kleinformatmarke) |
| `favicon.ico` | Favicon-Fallback (16/32/48 px) |
| `assets/brand/apple-touch-icon.png` | Apple Touch Icon (Deep-Blue-Hintergrund) |
| `assets/brand/logo-signet.svg` | Kompaktes Signet; derzeit nicht eingebunden, da das vollständige Logo auch bei 390 px passt |

- Logo als externe Datei mit `width="1000" height="690"`; CSS setzt nur die Breite (`--logo-width` 108/86/72 px, Footer 190 px), Höhe automatisch
- Die viewBox enthält viel Leerraum; die Logo-Box (`aspect-ratio: 646 / 492`) zeigt per CSS nur den gezeichneten Bereich (x 189–835, y 129–621). Datei, Proportionen und Verläufe bleiben unverändert; keine Filter, keine `fill`-Overrides
- Headerhöhe 112 px (Desktop), 96 px (Tablet), 84 px (Mobil)
- OG-Bild `assets/images/og-baltic-wasserveredlung-logo.jpg` aus `logo-primary.svg` (V1.1) auf Paper gerendert
- Footer-Logo 236 px (≤ 620 px: 208 px) auf einer Glasfläche mit hellem Radialakzent, damit die dunkle obere Welle auf dem Video lesbar bleibt

## Design-Finishing

- Produktbühne: alle drei Anlagen in identischen Containern (`aspect-ratio: 796 / 700`, `object-fit: cover`); `--product-focus-y` gleicht die Bildlage der Quellen aus (Standard 17 %, Connect 100 %)
- Premium-Layer nur per CSS: Glasflächen, gestaffelte Schatten, dezente Aqua-Akzente, Hover-/Focus-Zustände; Hover-Effekte nur unter `(hover: hover)`, Bewegungen nur unter `prefers-reduced-motion: no-preference`
- Accordions (`details.accordion`: Produktdetails und FAQ) mit weicher Höhenanimation in `main.js` (entfällt bei reduzierter Bewegung); Scrollspy setzt `aria-current` in der Navigation
- FAQ (`#faq`, 11 Fragen) vor dem Kontakt; das `FAQPage`-JSON-LD entspricht exakt dem sichtbaren Text und muss bei Textänderungen mit angepasst werden

## SEO

- Titel: „Umkehrosmoseanlagen & Wasseraufbereitung | Baltic Wasserveredlung“; Canonical, Open Graph und Twitter Card zeigen auf `https://www.baltic-wasserveredlung.de/` (OG-Bild `assets/images/og-baltic-wasserveredlung-logo.jpg`, 1200 × 630, aus dem Primary-Logo-Master auf Paper `#f5f4ef`)
- Eine H1 (sichtbarer Kicker „Umkehrosmoseanlagen & Wasseraufbereitung aus Kiel“), danach H2/H3/H4
- JSON-LD: `WebSite` und `LocalBusiness` (Anschrift, Telefon, E-Mail, Leistungen) – keine Öffnungszeiten, Profile oder Bewertungen; zusätzlich `FAQPage` aus dem sichtbaren FAQ
- Kein `Product`-Markup: Ohne Preis, Verfügbarkeit oder Bewertungen ist es nicht für Rich Results geeignet
- `robots.txt` erlaubt alles und verweist auf `sitemap.xml` (Startseite, Impressum, Datenschutz; ohne `lastmod`)
- Impressum und Datenschutz sind indexierbar und haben ein Canonical, aber keine Keyword-Optimierung
- Favicon: `assets/brand/favicon.svg` mit `favicon.ico` als Fallback (Designpaket V1.1); Apple Touch: `assets/brand/apple-touch-icon.png`; JSON-LD `logo`: `logo-primary.svg`
- `vercel.json`: `cleanUrls: false` (`.html`-URLs sind kanonisch), 301-Weiterleitungen der alten Wix-URLs, eigene `404.html` (`noindex`)

### Weiterleitungen alte Wix-Seite

| Alte URL | Neues Ziel | Status |
|---|---|---|
| `/` | `/` | unverändert |
| `/blank` (Impressum) | `/impressum.html` | 301 |
| `/blank-1` (Datenschutz) | `/datenschutz.html` | 301 |
| `/product-page/direct-flow-umkehrosmoseanlage` | `/#produkte` | 301 |
| `/product-page/direkt-flow-umkehrosmoseanlage-wifi-app` | `/#produkte` | 301 |
| `/category/all-products` | `/#produkte` | 301 |
| `/impressum`, `/datenschutz` | `.html`-Variante | 301 |
| `/cart-page`, Checkout, Wix-Vorlagenprodukte, sonstige | – | 404 |

## Referenzstand

Branch `seo-grundoptimierung`, Tag `referenz-2026-10-04` – technisch freigegeben am 04.10.2026 (Lighthouse lokal Mobile 99/100/100/100, Desktop 100/100/100/100). Weitere inhaltliche oder gestalterische Änderungen nur nach Freigabe.

## Noch offen

- Kontaktformular auf serverseitigen Versand umstellen (eigenes Arbeitspaket; bis dahin `mailto`)
- **Offen:** `assets/docs/datenblatt.pdf` enthält weiterhin die Formulierung „aus gesundheitlichen Gründen sicherer“ (tanklose Anlagen). Die Datei wird erst nach Abstimmung verändert oder ersetzt
- Keine DNS-Änderung und keine Änderung an der bestehenden Wix-Domain vor Freigabe

### Gesundheitsnahe Werbeaussagen (Einzelentscheidung offen, unverändert)

| Stelle | Aussage |
|---|---|
| Intro-Lead | „Gefiltert. Gesichert. Gesund.“ |
| Basiswissen | „Sie müssen nicht darauf vertrauen, ob tatsächlich zu jedem Zeitpunkt einwandfreies Trinkwasser aus Ihrer Wasserleitung kommt.“ |
| Basiswissen | „…von Schadstoffen und Verunreinigungen getrennt…“ |
| Basiswissen | „…zur natürlichen Verwirbelung durch ein Edelstahlwellrohr und ein Modul geleitet.“ |
| Edelsteinwasser | „In unserem Körper erfüllt es lebenswichtige Aufgaben.“ (im Kontext eines Produktangebots) |
| Story-Karte Vision | „…in Qualität und Struktur natürlichem Quellwasser möglichst nahekommt.“ |
| Story-Karte | „Mehr als nur gefiltert … weitere technische Veredelungsschritte“ |
| Hero | „Wasser in seiner reinsten Form“ / „Erleben Sie reines Wasser – jeden Tag.“ (eher Werbesprache, geringes Risiko) |
| PDF | `assets/docs/ebook-edelsteinwasser.pdf` (Fremdmaterial Puraja) – Inhalt auf Gesundheitsaussagen prüfen |

### Ungeklärte Angaben Impressum/Datenschutz

Die sichtbaren Prüfhinweise wurden entfernt; folgende Angaben sind vor dem Livegang auf der Hauptdomain zu klären (nichts davon wurde ergänzt oder erfunden):

Impressum
- Umsatzsteuer-ID fehlt (die bisherige Wix-Seite nennt DE297012970 – Bestätigung offen)
- Kontaktdaten abweichend zur Wix-Seite: dort Telefon +49 431 5402-0, Telefax +49 431 5402-150, E-Mail info@…, Mobil 0173 6987939; neu 0431 5402445, Mobil 0172 3043369 und vertrieb@… – endgültige Telefon-, Mobil-, Fax- und E-Mail-Angaben festlegen
- Inhaltlich Verantwortlicher nach § 18 Abs. 2 MStV, falls redaktionelle Inhalte vorliegen – prüfen
- Hinweis zur Verbraucherstreitbeilegung (§ 36 VSBG) anhand des tatsächlichen Unternehmens und der Beschäftigtenzahl prüfen

Datenschutz
- Hoster: Die neue Seite läuft auf Vercel (Vercel Inc., USA). Datenschutzinformationen erst nach Klärung des tatsächlich verwendeten Vercel-Tarifs finalisieren (Auftragsverarbeitung, Drittlandübermittlung, Logs). Die Wix-Erklärung nennt einen anderen Hoster (crossmedia1, Thomas Ferenz, Kiel)
- Kontaktformular: aktuell `mailto` (Versand über das E-Mail-Programm des Nutzers); nach Umstellung auf serverseitigen Versand den Dienst ergänzen
- Telefonnummer und E-Mail der verantwortlichen Stelle an das Impressum angleichen
- Speicherdauer, SSL/TLS-Hinweis und Widerspruchsrecht (Art. 21 DSGVO) – Umfang mit der rechtlichen Prüfung abstimmen
- Externe Inhalte: Google-Maps-Link (nur Link), keine eingebetteten Schriften, Videos lokal gehostet – Darstellung bestätigen

## Domain-Umstellung (noch nicht durchgeführt)

1. `www.baltic-wasserveredlung.de` in Vercel als Hauptdomain hinterlegen
2. `baltic-wasserveredlung.de` per permanentem 301 auf `www` weiterleiten
3. Canonicals zeigen bereits auf `https://www.baltic-wasserveredlung.de/…`
4. Nach DNS-Umstellung Wix-Weiterleitungen (Tabelle oben) und 404-Verhalten live prüfen
5. Google Search Console für die Domain einrichten/verifizieren
6. `https://www.baltic-wasserveredlung.de/sitemap.xml` einreichen
