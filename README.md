# Baltic Wasserveredlung

Eigenständiger, statischer Website-Relaunch auf Basis der vorhandenen Inhalte und Assets.

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

Alle Videos sind stumm, ohne Metadaten und als Web-Loop (`autoplay muted loop playsinline`) mit Poster eingebunden.

| Bereich | Datei | Quelle |
|---|---|---|
| Hero | `assets/videos/hero-glass.mp4` (9 s, 1080p, ca. 4 MB) | Pexels „Water Pouring in a Clear Glass“ (4037575) |
| Basiswissen | `assets/videos/basis-waterfall.mp4` | bestehendes Asset |
| Service | `assets/videos/service-water.mp4` | bestehendes Asset |
| Footer | `assets/videos/footer-ripples.mp4` (5,6 s, 720p, ca. 2,3 MB) | Pixabay „Water, Blue, Ripples“ (1934), verlangsamt |

## Noch offen

- Kontaktformular auf serverseitigen Versand umstellen, sobald ein Dienst abgestimmt ist
- Rechtliche Prüfung von Impressum/Datenschutz
- Performance- und Lighthouse-Prüfung
