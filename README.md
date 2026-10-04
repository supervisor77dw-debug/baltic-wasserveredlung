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

## SEO

- Titel: „Umkehrosmoseanlagen & Wasseraufbereitung | Baltic Wasserveredlung“; Canonical, Open Graph und Twitter Card zeigen auf `https://www.baltic-wasserveredlung.de/` (OG-Bild `assets/images/og-baltic-wasserveredlung.jpg`, 1200 × 630, aus vorhandenem Produktbild)
- Eine H1 (sichtbarer Kicker „Umkehrosmoseanlagen & Wasseraufbereitung aus Kiel“), danach H2/H3/H4
- JSON-LD: `WebSite` und `LocalBusiness` (Anschrift, Telefon, E-Mail, Leistungen) – keine Öffnungszeiten, Profile oder Bewertungen
- Kein `Product`-Markup: Ohne Preis, Verfügbarkeit oder Bewertungen ist es nicht für Rich Results geeignet
- `robots.txt` erlaubt alles und verweist auf `sitemap.xml` (Startseite, Impressum, Datenschutz; ohne `lastmod`)
- Impressum und Datenschutz sind indexierbar und haben ein Canonical, aber keine Keyword-Optimierung
- Favicon/Apple-Touch-Icon/`site.webmanifest`: vorläufiges typografisches „B“-Monogramm in Petrol (`#0b3545`), Freigabe offen
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

## Noch offen

- Kontaktformular auf serverseitigen Versand umstellen, sobald ein Dienst abgestimmt ist
- Rechtliche Prüfung von Impressum/Datenschutz (Hinweise „Vor Veröffentlichung prüfen“)
- Freigabe des vorläufigen Favicons bzw. Lieferung eines offiziellen Logos
- Nach DNS-Umstellung: Domain `www` als primär in Vercel, Apex `baltic-wasserveredlung.de` per 301 auf `www`; Google Search Console einrichten und Sitemap einreichen
