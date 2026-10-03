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

## Noch offen

- Kontaktformular auf serverseitigen Versand umstellen, sobald ein Dienst abgestimmt ist
- Finale Videoauswahl und rechtliche Prüfung von Impressum/Datenschutz
- Bild-/Videooptimierung sowie Performance- und Lighthouse-Prüfung
