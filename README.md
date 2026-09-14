# R for Policy

Interaktive R-Lernwebsite für die Vorbereitung auf die quantitativen MVPF-Tutorials.

Die Startseite (`#home` oder die Adresse ohne Hash) erläutert den Kurszweck und die Nutzung und verlinkt die neun aktiven Module mit einer kurzen Inhaltsbeschreibung. Ein Klick auf „R for Policy“ führt von jeder Lektion zurück zur Startseite. Bestehende direkte Links zu aktiven Lektionen funktionieren weiter; Code und Fortschritt bleiben beim Wechsel zur Startseite innerhalb derselben Sitzung erhalten.

Aktiv sind neun Module mit 39 Lektionen: 29 interaktive Übungen in Modul 1–7, sieben Aufgaben im Practice project in Modul 8 sowie drei Anleitungsseiten für RStudio in Modul 9. Insgesamt gibt es 36 interaktive Übungen. Tools ist als Modul 7 eingeblendet und behandelt gewichtete Mittelwerte, CPI-Anpassungen und Barwerte.

- **First steps in R:** Drei Lektionen zu Rechnen einschließlich Potenzen mit `^`, Objekten, Kommentaren und Fehlermeldungen anhand einer fiktiven UBI-Erhöhung.
- **Vectors & formulas:** Drei Lektionen zu Vektoren, eingebauten Funktionen (`sum()`, `mean()`, `round()`) und Auswahl über Positionen oder Bedingungen.
- **Working with data:** Sieben Lektionen zu CSV- und Excel-Dateien, Datenstruktur, dplyr, Filtern, neuen Spalten, fehlenden Werten, Aggregation, Umformen und Speichern als CSV oder Excel.
- **Creating graphs:** Vier Lektionen: Linien und Punkte zeichnen, mehrere Gruppen darstellen, Beschriftungen und Einheiten ergänzen sowie Grafiken mit ggsave() als PNG und PDF speichern.
- **Functions:** Eine Steuerfunktion mit Einkommen als Input schreiben, mehrere Einkommen berechnen, auf die Einkommensdaten anwenden und tau/rho als Argumente mit Standardwerten ergänzen.
- **Loops:** Drei Lektionen zu for-Schleifen, dem Speichern von Ergebnissen mit c() und dem Erstellen neuer Spalten. Die ersten beiden Aufgaben vergleichen drei rho-Werte bei einem festen Einkommen. Lektion 3 erstellt mit derselben Schleife eine Steuerspalte pro rho-Wert und schließt mit einem Graphen ab.
- **Tools (Modul 7):** Fünf Lektionen zu gewichteten Mittelwerten, Preisbereinigung, realen Einkommen und Barwerten einzelner Zahlungen und mehrjähriger Zahlungsreihen. Alle fünf Lektionen tragen den grünen Tools-Marker. Lektion 5 führt zunächst den Barwert einer Zahlungsreihe ein und erklärt den Begriff NPV als kurze Ergänzung am Ende.

- **Practice project (Modul 8):** Sieben kurze Aufgaben mit realen WID-Schätzungen zur Einkommensungleichheit: Daten einlesen, untersuchen, filtern, Prozentanteile berechnen, Länder vergleichen, umformen, Veränderungen berechnen und Zeitreihen zeichnen. Leere Codefelder ohne Worked Examples; Hinweise, Lösungsprüfung und aufklappbare Musterlösungen unterstützen die eigenständige Bearbeitung.
- **R & RStudio (Modul 9):** R und RStudio Desktop installieren, die vier Bereiche der Oberfläche kennenlernen, Skripte speichern und ausführen, Daten mit View() ansehen sowie Projekte und Pakete verwenden.

Die Inhalte sind auf Englisch, passend zu den Kursmaterialien. Die 29 Browserübungen in Modul 1–7 enthalten jeweils ein editierbares Beispiel, eine eigene Übung, Hinweise und eine Musterlösung. Die Speicherlektionen erstellen CSV- und Excel-Dateien (Modul 3) sowie PNG- und PDF-Grafiken (Modul 4) mit Downloadlinks direkt im Browser. Modul 9 enthält Anleitungen mit kopierbarem Code für RStudio, offiziellen Links und vollständigen Downloads. Anleitungsseiten zählen nicht zu „Exercises solved“. Ausgewählte Lektionen ergänzen Verständnisfragen. Modul 1 enthält keine zusätzlichen Verständnisfragen. Zeitangaben werden nicht angezeigt. Es gibt kein Modul 0.

## Lokal öffnen

Voraussetzung für den Vorschau-Server: Node.js 22.12 oder neuer.

```sh
npm ci
npm run dev
```

Die im Terminal angezeigte lokale Adresse im Browser öffnen. R selbst muss für die Website nicht lokal installiert sein. Beim ersten Ausführen werden webR und je nach Lektion dplyr, tidyr, ggplot2, readxl und writexl heruntergeladen; dafür wird eine Internetverbindung benötigt.

## Technik

- Statische Website, erstellt mit Vite und JavaScript.
- CodeMirror als Editor mit R-Syntaxhervorhebung und `Cmd/Ctrl + Enter` zum Ausführen. `Tab` rückt die aktuelle oder markierte Zeile um zwei Leerzeichen ein, `Shift+Tab` rückt zurück. `Esc`, danach `Tab`, verlässt den Editor. Neue Zeilen nach `%>%`, `|>` und `+` werden automatisch eingerückt; eine fortgesetzte Kette bleibt auf derselben Einrückungsebene.
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
- `src/module3.js`: Daten verarbeiten, umformen und speichern, sieben Lektionen.
- Lektion 1 ergänzt nach der CSV-Aufgabe einen Abschnitt zu Excel-Dateien mit `readxl::read_excel()` und einer Auswahlfrage zu `sheet`. Das Excel-Worked-Example ist direkt im Browser editierbar und ausführbar. Es liest `public/data/data_incomes.xlsx`, eine Kopie der CSV-Daten mit dem Tabellenblatt `Incomes`. Der vollständige Moduldownload erzeugt diese Excel-Datei temporär aus den eingebetteten Daten und führt dasselbe Importbeispiel aus.
- `src/module4.js`: Grafiken erstellen und speichern mit den Einkommensprofilen, vier Lektionen.
- `src/module5.js`: Funktionen, vier Lektionen mit Steuerformel und Einkommensdaten.
- `src/module6.js`: for-Schleifen, drei Lektionen mit Steuerfunktion und Einkommensdaten.
- `src/module7.js`: Tools, fünf Lektionen mit gewichteten Mittelwerten, CPI-Anpassungen und Barwerten anhand von Einkommensprofilen, fiktiven CPI-Daten und Zahlungsreihen.
- `src/module9.js`: Installation und Nutzung von R und RStudio, drei Anleitungsseiten mit `guide: true` in Modul 9.
- `src/module8.js`: Practice project: Sieben Aufgaben mit WID-Einkommensanteilen für Frankreich, Deutschland, die Schweiz und die USA. Jede Aufgabe bereitet die benötigten Ergebnisse vorheriger Schritte vor; die Studierenden schreiben jeweils nur die neuen Zeilen. Vorherige Editor-Eingaben werden dabei nicht ausgeführt.
- `src/main.js`: Startseite, Modulübersicht, Navigation, Editoren, Feedback, Quiz und Download-Links.
- `src/r-editor.js`: R-Syntaxunterstützung mit Einrückung für Pipes, ggplot-Fortsetzungen und Klammern. `npm run check:editor` prüft Zeilenumbrüche, Kommentare, Strings, Verschachtelung sowie das Ein- und Ausrücken markierter Zeilen.
- `scripts/generate-excel-data.R`: Erstellt die Excel-Übungsdatei aus der CSV; nach Änderungen an den Einkommensdaten aus dem Website-Ordner mit `Rscript scripts/generate-excel-data.R` ausführen (Paket `writexl` erforderlich). Die Excel-Datei ist Teil des Projekts; der Website-Build benötigt kein R.
- `scripts/generate-materials.mjs`: Erzeugt die synthetischen Einkommens- und CPI-Daten sowie die vollständigen Modulskripte. Der WID-Datensatz wird aus dem gespeicherten Ausschnitt übernommen und anhand seiner Prüfsumme validiert; der Build lädt keine neuen WID-Daten herunter. Läuft automatisch vor `npm run dev` und `npm run build`; nach Inhaltsänderungen bei laufender Vorschau mit `npm run generate:materials` aktualisieren.
- `src/runtime.js`: R-Start, Pakete, Daten, Ausführung und Lösungsprüfung.
- `src/style.css`: Layout und Gestaltung.

Die Lektionen sind als Objekte strukturiert. `example` ist der optionale Beispielcode (weglassen für Aufgaben ohne Worked Example), `starter` der Ausgangscode der Übung, `solution` die Musterlösung und `check` eine R-Bedingung. Die Bedingung wird in der Umgebung des ausgeführten Codes geprüft; `.answer` enthält den Wert des letzten Ausdrucks. `setup` bereitet bei Bedarf die Daten vor. Checks verwenden numerische Toleranzen und akzeptieren verschiedene Wege zum erwarteten Ergebnis.

Mit `checkGraphics: true` steht dem Check die Anzahl der tatsächlich ausgegebenen Grafiken als `.plot_count` zur Verfügung.

`src/plot-checks.js` prüft in Modul 4 und im Practice project die zugeordneten Werte und die von ggplot2 erzeugten Liniengruppen. Die Prüfung akzeptiert Mappings in `ggplot()` oder in `geom_line()` sowie Daten mit anderer Zeilenreihenfolge oder ohne ungenutzte Spalten. Erwartete Daten stammen aus den ursprünglichen Kursdateien. In der Beschriftungsübung müssen auch die verlangten Titel und Einheiten stimmen.

Mit `checkPrintedOutput: true` steht dem Check zusätzlich die tatsächlich ausgegebene Standardausgabe als `.printed_output` zur Verfügung. Die erste Schleifenaufgabe prüft damit alle drei angezeigten Steuerzahlungen. `titleMarker` zeigt eine grüne Kennzeichnung neben der Lektionsnummer und kann für ein ganzes Modul oder eine einzelne Lektion gesetzt werden. Alle Lektionen in Modul 1–2 tragen „Basics“, in Modul 3–4 „Intermediate“, in Modul 5–6 „Advanced“ und in Modul 7 „Tools“. Eine Kennzeichnung auf Lektionsebene hat Vorrang; Modul 9 hat keine Kennzeichnung. Alle sieben Aufgaben in Modul 8 tragen „Practice project“. Ein optionales `introNote` ergänzt einen Hinweis unter der Beschreibung.

Ein optionales `followUp` mit `title`, `body`, `example` und optionaler `note` ergänzt ein weiteres editierbares Beispiel. Standardmäßig steht es nach der Aufgabe; mit `position: 'before-exercise'` folgt es auf das erste Worked Example und dessen Hinweis. Es läuft unabhängig von den anderen Editoren, zählt nicht als zusätzliche Übung und wird in derselben Reihenfolge in den vollständigen Moduldownload aufgenommen. In Modul 2 erklärt es das Kombinieren von Funktionen beziehungsweise Bedingungen. `exampleLabel` kann die Beschriftung des zusätzlichen Beispiels ändern, etwa zu „Worked example“ beim Excel-Import.

`closingContent` ergänzt einen abschließenden Textabschnitt, auch mit statischem Code. Mit `quiz.position: 'after-closing'` steht die zugehörige Auswahlfrage direkt danach. Auch Anleitungen mit `guide: true` unterstützen eine `quiz`-Auswahlfrage; ihr `setupNote` steht bei Bedarf direkt über dem kopierbaren Code.

Die hellgrünen Datenhinweise verwenden gemeinsame Texte aus `src/dataset-notes.js`: „What is in …?“, Bedeutung der Zeilen und Beschreibung der Spalten einschließlich Einheiten. `setupNote`, `exampleSetupNote` und `followUp.setupNote` verweisen auf den zum jeweiligen Editor passenden Datensatz beziehungsweise die einzulesende Datei. CPI-Aufgaben nennen beide Datenquellen und die Annahme, dass die Einkommen in 2024-Preisen vorliegen. Hinweise erscheinen nur, wenn sie ausdrücklich gesetzt sind; der auf Wunsch entfernte Hinweis in Modul 4, Lektion 4 bleibt ausgeblendet.

## Übungsdaten und Downloads

Modul 3 verwendet ausschließlich selbst erzeugte Einkommensprofile in `public/data/data_incomes.csv`: 92 Zeilen (Alter 20–65 × Female/Male) mit `age`, `gender`, `annual_income` und `n_people`. Alle Einkommen und Gruppengrößen sind fiktiv. Die Kurven und Unterschiede haben keine empirische Bedeutung. Die Originaldaten aus den quantitativen Tutorials bleiben so für den Kurs neu.

Module 4–6 verwenden dieselben Einkommensdaten wie Modul 3. Die Lektion „Reshape data“ formt mit pivot_wider() die lange Tabelle mit age, gender und annual_income in eine breite Tabelle mit age, Female und Male um: aus 92 Zeilen werden 46. Nach der Aufgabe führt ein eigenständig ausführbares Beispiel mit pivot_longer() zurück zu 92 Zeilen im Long-Format; anschließend folgt eine Verständnisfrage. Alle Einkommen bleiben erhalten. Der vollständige Code ist im Moduldownload enthalten.

Das Modul Tools verwendet in Lektion 3 eine kleine CPI-Übungsdatei `public/data/data_cpi.csv` (2020–2024, Indexreferenz 2020 = 100). Nach dem Import werden die Einkommensprofile aus `data_incomes.csv` direkt mit dem Verhältnis der CPI-Werte preisbereinigt; nur für diese Lektion gelten ihre Einkommen als Beträge in Preisen von 2024. Das Beispiel rechnet in Preise von 2022 um, die Aufgabe in Preise von 2021. Die Zahlungen in den Barwert-Lektionen werden direkt in R angelegt. Alle CPI-Werte sind Übungswerte, keine historischen Beobachtungen. Der gewichtete Mittelwert wird in Lektion 1 von Modul 7 Tools eingeführt. Der frühere Link `#module-5/weighted-averages` führt zur neuen Position `#module-7/weighted-averages`. Modul 2 behandelt zunächst die eingebauten Funktionen; Modul 3 verwendet einfache Mittelwerte über die Altersgruppen.

Die Erzeugung ist deterministisch und in `scripts/generate-materials.mjs` dokumentiert. Die Aufgaben behandeln Import, Filterung, Monats- und Gruppeneinkommen, fehlende Werte und einfache Mittelwerte über Datenzeilen. Fehlende Werte der Einkommensprofile werden nur in einer Übungskopie eingefügt.

Das Practice project verwendet `public/data/data_inequality.csv`: 360 veröffentlichte WID-Schätzungen für Frankreich, Deutschland, die Schweiz und die USA von 1980 bis 2024. Die vier Spalten sind `country`, `year`, `group` und `income_share`. Zeilen mit `group = top10` enthalten den Anteil am Gesamteinkommen, den die oberen 10% der Erwachsenen erhalten; Zeilen mit `group = bottom50` enthalten den Anteil für die unteren 50%. Der Wert steht als Bruchteil von 1 in `income_share`. Gesamteinkommen bezeichnet hier das Vorsteuernationaleinkommen nach WIDs Definition gleichmäßig aufgeteilter Einkommen von Erwachsenen ab 20 Jahren. Die Übungen konzentrieren sich anschließend auf 2000–2024. Ab Lektion 3 bleibt `df` bei beiden Einkommensgruppen mit `share_pct`. Die abschließende Lektion 7 filtert nur die an `ggplot()` übergebenen Zeilen nach `top10`. Es werden keine fehlenden Werte oder künstlichen Beobachtungen eingefügt.

Die ausgewählten Originalwerte bleiben unverändert. `wid-inequality-source.csv` enthält die ursprünglichen Felder einschließlich Qualitätskennzeichen; `wid-inequality-metadata.json` dokumentiert Abrufdatum, Original-URLs, Transformationen und SHA-256-Prüfsummen. `data_inequality.sources.md` erklärt Definitionen und Grenzen der Schätzungen. Quelle: [World Inequality Database](https://wid.world/data/). Manche WID-Werte beruhen auf Interpolation oder Extrapolation; die Methoden unterscheiden sich zwischen Ländern und Daten können revidiert werden.

Eine Aktualisierung wird bewusst separat mit `python3 scripts/update-wid-data.py` ausgeführt. Danach die Änderungen prüfen und mit `npm run generate:materials` die Downloads erneuern. Normale Builds und die Übungen verwenden den gespeicherten Datenausschnitt und greifen nicht live auf WID zu.

`public/downloads/module-01-solutions.R` bis `module-09-solutions.R` enthalten jeweils den gesamten aktiven Modulcode mit Lösungen. Die Erzeugung entfernt veraltete Downloads ausgeblendeter Module. Die Skripte für Module 3–8 betten ihre CSV-Daten ein und lassen sich ohne zusätzliche Datendownloads ausführen. Benötigte R-Pakete und Installationshinweise stehen jeweils am Skriptanfang. Das absichtlich fehlerhafte Beispiel aus Modul 1 ist mit `try()` abgefangen, damit die Ausführung bis zur korrigierten Lösung fortgesetzt wird.

Die aktiven Module in `src/course.js` bestimmen Navigation, Startseite und Downloads. Tools steht an Position 7, Practice project an Position 8 und R & RStudio an Position 9. Frühere Links unter `#module-7/desktop-…` und `#module-8/desktop-…` führen zu den RStudio-Lektionen unter `#module-9/desktop-…`. Frühere Projektlinks unter `#module-8/housing-…` und `#module-9/housing-…` führen zu den entsprechenden neuen Aufgaben unter `#module-8/inequality-…`.

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

Die frühere College-Vorbereitung wurde auf Wunsch entfernt, einschließlich ihres synthetischen Datensatzes und ihrer Downloadinhalte. Tools ist als Modul 7 eingeblendet und behandelt gewichtete Mittelwerte, CPI-Anpassungen und Barwerte. R & RStudio wird als Modul 9 angezeigt. Der Produktionsbuild enthält aktuell alle neun Module.

Für die Umformungslektion wurden die Musterlösung und eine alternative Zeilenreihenfolge akzeptiert; fehlende Geschlechter, ein mit umgeformter Altersbezeichner, vertauschte Argumente und veränderte Einkommen wurden zurückgewiesen. Beispiel, Lösung und gezieltes Fehlerfeedback liefen mit echtem webR im Browser. Die vollständigen Downloads der Module 3 und 8 wurden außerhalb des Projektordners mit Rscript ausgeführt. Navigation, Downloadzuordnung und Tabellen bei 390 und 1.440 Pixeln wurden geprüft; kein horizontales Seitenüberlaufen.

Die Speicherlektion `#module-3/save-data` führt `write.csv()` und `writexl::write_xlsx()` im Browser aus und bietet die erzeugten Dateien zum Download an. `downloadFiles` legt die exportierbaren Dateiendungen fest. Jede Ausführung nutzt einen neuen temporären Ausgabeordner; frühere Dateien können dadurch keine neue Übung bestehen lassen. Nach dem Einlesen der Dateiinhalte wird der Ordner entfernt und das vorherige Arbeitsverzeichnis wiederhergestellt. Die Antwortprüfung liest CSV und Excel zurück und vergleicht sie mit `df`. Downloadlinks bleiben während der Sitzung auch beim Wechsel zwischen Lektionen erhalten.

Die Grafikspeicherlektion `#module-4/graphs-save` führt `ggsave()` direkt im Browser aus und bietet PNG und PDF zum Download an. Die Aufgabe prüft den Dateinamen sowie Pixelmaße und Auflösung im PNG-Header. Leere Hilfsdateien des R-Grafikgeräts werden nicht als Downloads angezeigt. Die vollständigen Moduldownloads bereiten `df` vor und speichern die erzeugten Dateien im aktuellen Arbeitsordner. `getwd()` zeigt diesen Ordner; gleichnamige Dateien werden ersetzt.

`npm run check:exercises` führt alle 36 Musterlösungen sowie 40 Alternativen und Fehlerfälle in nativen R-Sitzungsumgebungen aus. Erforderlich sind `Rscript` und die Pakete dplyr, tidyr, ggplot2, readxl und writexl. Die Tests zählen tatsächlich gezeichnete ggplot-Grafiken über den `grid.newpage`-Hook und prüfen echte CSV-, Excel- und PNG-Dateien. Sie arbeiten ausschließlich in temporären Ordnern. webR, die Browseranzeige und Downloadlinks werden zusätzlich im Browser geprüft.

Die WID-Lösungsprüfungen wurden mit Musterlösungen, Alternativen mit Base R und `.by`, umsortierten Daten sowie typischen Fehlern bei Auswahl, Prozenten, Umformen, Veränderungen und Plot geprüft. Die 360 ausgewählten WID-Werte wurden gegen die aufbewahrten Originalzeilen geprüft; beide Datei-Prüfsummen stimmen mit den Metadaten überein. Der vollständige Modul-08-Download enthält die sieben verbleibenden Aufgaben und endet mit dem Liniengraphen.

Alle sieben WID-Aufgaben wurden außerdem mit echtem webR im Browser ausgeführt. Geprüft wurden Hinweise und Lösungsladen, gezieltes Prozent-Feedback, die `.by`-Alternative, beide Auswahlfragen sowie die Plotanzeige mit vier Ländern einschließlich der Schweiz. Bei 499 Pixeln Browserbreite wurde kein horizontales Seitenüberlaufen festgestellt. Die frühere achte Lektion zum Export ist entfernt; ihre alten Links führen zur abschließenden Plotlektion.
