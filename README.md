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

In `script.js` gibt es ganz oben das Array `MESSI_CARDS`. Dort kann man
einfach die `img`-URLs austauschen – z. B. durch lokale Pfade wie
`images/messi_wm.jpg`, wenn man eigene Fotos in einem `images/`-Ordner
ablegt.

```js
{
  id: "wc2022",
  label: "WM-Pokal 2022",
  emoji: "🏆",
  img: "images/messi_wm.jpg",
}
```

Wichtig: Die `id` muss für beide Karten eines Paares gleich bleiben –
das Spiel erzeugt das Paar automatisch.
