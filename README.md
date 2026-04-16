# ⚽ Messi Memory 🐐

Ein kleines Memory-Spiel im Browser mit verschiedenen Messi-Motiven.

## Spielen

Einfach die Datei `index.html` im Browser öffnen – fertig.
Es werden keine Abhängigkeiten oder Build-Schritte benötigt.

Alternativ kann man einen lokalen Server starten:

```bash
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
```

## Features

- 8 Paare (16 Karten) mit unterschiedlichen Messi-Stationen
  (Barcelona, Paris SG, Inter Miami, Argentinien, Weltmeister 2022,
  Ballon d'Or, Freistoß, GOAT)
- Zug-Zähler, gefundene Paare und Zeit
- Flip-Animation, Match-Highlight, Shake bei Fehlversuch
- Responsive Layout für Mobile/Desktop
- Tastaturbedienung (Enter / Leertaste)
- Automatisches Fallback (Emoji + Label), wenn ein Bild nicht lädt

## Eigene Fotos verwenden

Die Motive liegen als SVG-Illustrationen im Ordner `images/`. Du kannst sie
einfach durch eigene Fotos ersetzen. Entweder die SVGs überschreiben oder
die Pfade in `script.js` im Array `MESSI_CARDS` anpassen:

```js
{ id: "wc2022", label: "WM 2022", emoji: "🏆", img: "images/mein_foto.jpg" },
```

Wichtig: Die `id` muss für beide Karten eines Paares gleich bleiben –
das Spiel erzeugt das Paar automatisch.
