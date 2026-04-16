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

- 6 Paare (12 Karten) mit unterschiedlichen Messi-Stationen
  (WM 2022, Barcelona, Argentinien, Ballon d'Or, Paris SG, GOAT)
- Zug-Zähler, gefundene Paare und Zeit
- Flip-Animation, Match-Highlight, Shake bei Fehlversuch
- Responsive Layout für Mobile/Desktop
- Tastaturbedienung (Enter / Leertaste)

## Bilder

Jede Karte probiert zwei Quellen der Reihe nach:

1. **Eigenes Foto** unter `images/photos/<id>.jpg`
   – siehe `images/photos/README.md` für die erwarteten Dateinamen.
2. **Echtes Foto von Wikimedia Commons**
   (via `Special:FilePath`-Weiterleitung, benötigt Internetzugang).

So bekommst du automatisch echte Fotos, sobald du welche ablegst oder
Netzwerkzugriff hast.

## Motive anpassen

Bearbeite das Array `MESSI_CARDS` am Anfang von `script.js`. Die `id`
muss für ein Paar identisch bleiben – das Paar wird automatisch aus
zwei Kopien derselben Karte gebildet.
