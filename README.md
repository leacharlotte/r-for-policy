# R for Policy

Interaktive R-Lernwebsite für die Vorbereitung auf die quantitativen MVPF-Tutorials.

Die Startseite (`#home` oder die Adresse ohne Hash) erläutert den Kurszweck und die Nutzung und verlinkt die sieben aktiven Module mit einer kurzen Inhaltsbeschreibung. Ein Klick auf „R for Policy“ führt von jeder Lektion zurück zur Startseite. Bestehende direkte Links zu aktiven Lektionen funktionieren weiter; Code und Fortschritt bleiben beim Wechsel zur Startseite innerhalb derselben Sitzung erhalten.

Aktiv sind sieben Module mit 26 Lektionen: 23 interaktive Übungen in Modul 1–6 und drei Anleitungsseiten für RStudio in Modul 7. Das bisherige Modul 7 „NPV & CPI“ ist vorübergehend ausgeblendet; sein Quelltext bleibt erhalten. Das bisherige Modul 8 „R & RStudio“ wird als Modul 7 angezeigt.

- **First steps in R:** Drei Lektionen zu Rechnen einschließlich Potenzen mit `^`, Objekten, Kommentaren und Fehlermeldungen anhand einer fiktiven UBI-Erhöhung.
- **Vectors & formulas:** Drei Lektionen zu Vektoren, eingebauten Funktionen (`sum()`, `mean()`, `round()`) und Auswahl über Positionen oder Bedingungen.
- **Working with data:** CSV-Dateien, Datenstruktur, dplyr, Filter, neue Spalten, fehlende Werte, Aggregation und Umformen mit tidyr::pivot_wider() und tidyr::pivot_longer().
- **Creating graphs:** Drei Lektionen: Linien und Punkte zeichnen, mehrere Gruppen darstellen sowie Beschriftungen und Einheiten ergänzen.
- **Functions:** Eine Steuerfunktion mit Einkommen als Input schreiben, mehrere Einkommen berechnen, auf die Einkommensdaten anwenden, tau/rho als Argumente mit Standardwerten ergänzen und zum Abschluss gewichtete Mittelwerte berechnen.
- **Loops:** Drei Lektionen zu for-Schleifen, dem Speichern von Ergebnissen mit c() und dem Erstellen neuer Spalten. Die ersten beiden Aufgaben vergleichen drei rho-Werte bei einem festen Einkommen. Lektion 3 erstellt mit derselben Schleife eine Steuerspalte pro rho-Wert und schließt mit einem Graphen ab.
- **NPV & CPI (ausgeblendet):** Fünf Lektionen zu Preisbereinigung, realen Einkommen, Barwerten, Nettozahlungsströmen und einer kombinierten CPI-NPV-Rechnung.
- **R & RStudio (Modul 7):** R und RStudio Desktop installieren, die vier Bereiche der Oberfläche kennenlernen, Skripte speichern und ausführen, Daten mit View() ansehen sowie Projekte und Pakete verwenden.

Die Inhalte sind auf Englisch, passend zu den Kursmaterialien. Jede Lektion in Modul 1–6 enthält ein editierbares Beispiel, eine eigene Übung, Hinweise und eine Musterlösung. Modul 7 enthält Anleitungen mit kopierbarem Code für RStudio, offiziellen Links und einem vollständigen Download. Die Installation wird auf dem eigenen Computer überprüft; die Anleitungsseiten zählen nicht zu „Exercises solved“. Ausgewählte Lektionen ergänzen Verständnisfragen. Modul 1 enthält keine zusätzlichen Verständnisfragen. Zeitangaben werden nicht angezeigt. Es gibt kein Modul 0.

## Lokal öffnen

Voraussetzung für den Vorschau-Server: Node.js 22.12 oder neuer.

```sh
npm ci
npm run dev
```

Die im Terminal angezeigte lokale Adresse im Browser öffnen. R selbst muss für die Website nicht lokal installiert sein. Beim ersten Ausführen werden webR und je nach Lektion dplyr, tidyr und ggplot2 heruntergeladen; dafür wird eine Internetverbindung benötigt.

## Technik

- Statische Website, erstellt mit Vite und JavaScript.
- CodeMirror als Editor mit R-Syntaxhervorhebung und `Cmd/Ctrl + Enter` zum Ausführen.
- Echter R-Interpreter über **webR 0.6.0**; keine simulierte Ausführung.
- PostMessage-Kommunikation, damit keine speziellen HTTP-Header für GitHub Pages erforderlich sind.
- Jede Ausführung erhält eine frische R-Umgebung. Die Paketinstallation wird innerhalb derselben Sitzung wiederverwendet.
- „Stop R“ beendet den R-Worker; der Code bleibt in den Editoren. Eine weitere Ausführung startet R neu.
- Studentischer Code, Ergebnisse und Fortschritt werden nicht an einen Kursserver geschickt und nicht dauerhaft gespeichert. Ein Neuladen oder Schließen der Seite setzt sie zurück. „Download code“ lädt ein vollständiges `.R`-Skript des aktuellen Moduls mit allen Beispielen und Musterlösungen herunter. Individuelle Editor-Änderungen sind darin nicht enthalten.
- R, dplyr und Schriftarten werden von externen Anbietern geladen. Die Website enthält keine Analytics und keine Konten.
- Lösungen und Checks sind öffentlich lesbarer Teil der Website und für Selbstlernen ausgelegt.

Die erste Vorschau verwendet eine eigene statische Oberfläche mit webR. Quarto ist für diese Implementierung nicht erforderlich.

## Inhalte bearbeiten

- `src/course.js`: Modul 1 und Zusammenstellung aller Module.
- `src/module2.js`: Modul 2.
- `src/module3.js`: Daten verarbeiten und umformen, sechs Lektionen.
- `src/module4.js`: Grafiken erstellen mit den Einkommensprofilen aus Modul 3, drei Lektionen.
- `src/module5.js`: Funktionen, fünf Lektionen mit Steuerformel, Einkommensdaten und gewichteten Mittelwerten.
- `src/module6.js`: for-Schleifen, drei Lektionen mit Steuerfunktion und Einkommensdaten.
- `src/module7.js`: NPV und CPI, fünf vorübergehend ausgeblendete Lektionen mit fiktiven Jahres- und Zahlungsstromdaten.
- `src/module8.js`: Installation und Nutzung von R und RStudio, drei Anleitungsseiten mit `guide: true`; derzeit als Modul 7 angezeigt.
- `src/main.js`: Startseite, Modulübersicht, Navigation, Editoren, Feedback, Quiz und Download-Links.
- `scripts/generate-materials.mjs`: Erzeugt die synthetischen Einkommensprofile und die vollständigen Modulskripte. Läuft automatisch vor `npm run dev` und `npm run build`; nach Inhaltsänderungen bei laufender Vorschau mit `npm run generate:materials` aktualisieren.
- `src/runtime.js`: R-Start, Pakete, Daten, Ausführung und Lösungsprüfung.
- `src/style.css`: Layout und Gestaltung.

Die Lektionen sind als Objekte strukturiert. `example` ist der Beispielcode, `starter` der Ausgangscode der Übung, `solution` die Musterlösung und `check` eine R-Bedingung. Die Bedingung wird in der Umgebung des ausgeführten Codes geprüft; `.answer` enthält den Wert des letzten Ausdrucks. `setup` bereitet bei Bedarf die Daten vor. Checks verwenden numerische Toleranzen und akzeptieren verschiedene Wege zum erwarteten Ergebnis.

Mit `checkPrintedOutput: true` steht dem Check zusätzlich die tatsächlich ausgegebene Standardausgabe als `.printed_output` zur Verfügung. Die erste Schleifenaufgabe prüft damit alle drei angezeigten Steuerzahlungen. `titleMarker` zeigt eine Kennzeichnung neben der Lektionsnummer; die dritte Schleifenlektion trägt so die Kennzeichnung „More advanced“. Ein optionales `introNote` ergänzt einen Hinweis unter der Beschreibung.

Ein optionales `followUp` mit `title`, `body`, `example` und optionaler `note` ergänzt ein weiteres editierbares Beispiel. Standardmäßig steht es nach der Aufgabe; mit `position: 'before-exercise'` folgt es auf das erste Worked Example und dessen Hinweis. Es läuft unabhängig von den anderen Editoren, zählt nicht als zusätzliche Übung und wird in derselben Reihenfolge in den vollständigen Moduldownload aufgenommen. In Modul 2 erklärt es das Kombinieren von Funktionen beziehungsweise Bedingungen.

## Übungsdaten und Downloads

Modul 3 verwendet ausschließlich selbst erzeugte Einkommensprofile in `public/data/data_incomes.csv`: 92 Zeilen (Alter 20–65 × Female/Male) mit `age`, `gender`, `annual_income` und `n_people`. Alle Einkommen und Gruppengrößen sind fiktiv. Die Kurven und Unterschiede haben keine empirische Bedeutung. Die Originaldaten aus den quantitativen Tutorials bleiben so für den Kurs neu.

Module 4–6 verwenden dieselben Einkommensdaten wie Modul 3. Die Lektion „Reshape data“ formt mit pivot_wider() die lange Tabelle mit age, gender und annual_income in eine breite Tabelle mit age, Female und Male um: aus 92 Zeilen werden 46. Nach der Aufgabe führt ein eigenständig ausführbares Beispiel mit pivot_longer() zurück zu 92 Zeilen im Long-Format; anschließend folgt eine Verständnisfrage. Alle Einkommen bleiben erhalten. Der vollständige Code ist im Moduldownload enthalten.

Das ausgeblendete NPV-&-CPI-Modul erzeugt seine fiktiven CPI-, Einkommens- und Zahlungsstromtabellen direkt in R. Es werden keine aktuellen oder historischen CPI-Daten behauptet. Der gewichtete Mittelwert wird am Ende von Modul 5 eingeführt. Der frühere Link `#module-7/weighted-averages` führt zur neuen Position `#module-5/weighted-averages`. Modul 2 behandelt zunächst die eingebauten Funktionen; Modul 3 verwendet einfache Mittelwerte über die Altersgruppen.

Die Erzeugung ist deterministisch und in `scripts/generate-materials.mjs` dokumentiert. Die Aufgaben behandeln Import, Filterung, Monats- und Gruppeneinkommen, fehlende Werte und einfache Mittelwerte über Datenzeilen. Fehlende Werte werden nur in einer Übungskopie eingefügt.

`public/downloads/module-01-solutions.R` bis `module-07-solutions.R` enthalten jeweils den gesamten aktiven Modulcode mit Lösungen. Die Erzeugung entfernt veraltete Downloads ausgeblendeter Module. Die Skripte für Module 3–6 betten ihre CSV-Daten ein und lassen sich ohne zusätzliche Datendownloads ausführen. Benötigte R-Pakete und Installationshinweise stehen jeweils am Skriptanfang. Das absichtlich fehlerhafte Beispiel aus Modul 1 ist mit `try()` abgefangen, damit die Ausführung bis zur korrigierten Lösung fortgesetzt wird.

Um NPV & CPI wieder als Modul 7 einzublenden, in `src/course.js` die Kommentarzeichen `//` vor dem Import und dem Listeneintrag von `module7` entfernen. Gleichzeitig in `src/module8.js` die Kennung auf `id: 'module-8', number: '08'` zurücksetzen, damit R & RStudio wieder Modul 8 ist. Danach `npm run build` ausführen. Die aktiven Module bestimmen Navigation, Startseite und Downloads. Frühere Links zu den RStudio-Lektionen unter `#module-8/…` führen derzeit zur neuen Position unter `#module-7/…`.

Die Website enthält keine Original-Kursdaten, privaten Pfade oder Zugangsschlüssel.

## Über GitHub Pages veröffentlichen und aktualisieren

Der Workflow `.github/workflows/deploy-pages.yml` baut und veröffentlicht die Website bei Änderungen auf `main`. Er kann auch manuell über GitHub Actions gestartet werden. Die Einrichtung im GitHub-Repository muss vor der ersten Veröffentlichung abgeschlossen sein.

```sh
npm run build
```

`dist/` enthält die vollständigen statischen Dateien. Relative Asset-Pfade und Hash-Navigation erlauben die Veröffentlichung sowohl unter einer Domain als auch unter `username.github.io/repository/`.

Das Repository nimmt ausschließlich den Inhalt dieses Ordners `website/` auf, nicht den übergeordneten Kursordner. `node_modules/` und `dist/` sind in `.gitignore` ausgeschlossen. Der Workflow installiert mit `npm ci`, baut mit `npm run build` und veröffentlicht ausschließlich `dist/`.

Einmalig im Repository unter **Settings → Pages → Build and deployment → Source** die Option **GitHub Actions** auswählen. Anschließend den Workflow **Publish course to GitHub Pages** starten. Die fertige Website-Adresse erscheint unter Settings → Pages und im abgeschlossenen Workflow.

Spätere Änderungen zuerst lokal bearbeiten und mit `npm run dev` ansehen. Die öffentliche Website bleibt dabei unverändert. Erst wenn die geprüften Änderungen auf `main` zu GitHub übertragen werden, veröffentlicht der Workflow eine neue Version unter derselben Adresse. Für lokale Änderungen wird GitHub nicht benötigt; webR und R-Pakete benötigen beim ersten Laden in der Vorschau weiterhin eine Internetverbindung.

Offizielle Anleitung: [GitHub Pages mit eigenen Workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Prüfungen

Die Browserübungen, Lösungsprüfungen, Hinweise, Downloads, R-Neustart und Tastenkürzel wurden während der Entwicklung geprüft. Die Installation von R und RStudio wird von den Studierenden auf ihrem eigenen Computer überprüft.

Für die Einführung von `sum()`, `mean()` und `round()` in Modul 2 und die Verschiebung gewichteter Mittelwerte nach Modul 7 wurden 30 R-Prüfungen ausgeführt: alle Musterlösungen der Module 2, 3 und 7, die angepasste Szenarioübung in Modul 6 sowie alternative Lösungen und typische Fehler. Die vier vollständigen Downloads der Module 2, 3, 6 und 7 liefen erfolgreich außerhalb des Projektordners. Die Aggregationsübungen in Modul 3 und die Szenarioübung in Modul 6 prüfen jetzt einfache Mittelwerte über Datenzeilen; die zugehörige Verständnisfrage wurde angepasst.

Die drei verbleibenden Musterlösungen in Modul 1 wurden in Rscript und mit echtem webR im Browser geprüft. Die erste Übung unterscheidet zusätzliche von gesamten UBI-Zahlungen. Die frühere Lektion „From a formula to R“ und ihre Downloadinhalte wurden entfernt; „Reading and fixing errors“ ist jetzt Lektion 3. Der vollständige Moduldownload läuft auch außerhalb des Projektordners. Der Produktionsbuild wurde erfolgreich erstellt.

Die Startseiten-Navigation wurde mit einem JavaScript-Test und simulierten DOM-/Editor-Schnittstellen geprüft: Standardroute, acht Modulziele, Erhalt von Entwürfen und Fortschritt sowie eine Berechnung, die erst nach dem Wechsel zur Startseite endet. Dies war keine visuelle Browserprüfung.

Die frühere College-Vorbereitung wurde auf Wunsch entfernt, einschließlich ihres synthetischen Datensatzes und ihrer Downloadinhalte. NPV & CPI bleibt im Quelltext erhalten, ist aber vorübergehend ausgeblendet. R & RStudio wird als Modul 7 angezeigt. Der Produktionsbuild enthält aktuell die Module 1–6 und die RStudio-Anleitungen als Modul 7.

Für die Umformungslektion wurden die Musterlösung und eine alternative Zeilenreihenfolge akzeptiert; fehlende Geschlechter, ein mit umgeformter Altersbezeichner, vertauschte Argumente und veränderte Einkommen wurden zurückgewiesen. Beispiel, Lösung und gezieltes Fehlerfeedback liefen mit echtem webR im Browser. Die vollständigen Downloads der Module 3 und 8 wurden außerhalb des Projektordners mit Rscript ausgeführt. Navigation, Downloadzuordnung und Tabellen bei 390 und 1.440 Pixeln wurden geprüft; kein horizontales Seitenüberlaufen.
