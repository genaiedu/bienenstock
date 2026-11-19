# Bienenstock Labor

Eine eigenständige deutschsprachige Lernapp von Dr. Claus Unterberg. Eine offene Wabenansicht zeigt, wie Nahrung, Brutpflege, Honigreifung und Umweltbedingungen zusammenwirken.

## Starten

`index.html` herunterladen und im Browser öffnen. Kein Server, keine Installation, keine externen Ressourcen. Fira Sans und EB Garamond einschließlich ihrer Lizenztexte sind eingebettet. Die App funktioniert auch ohne Internet.

## Bedienung

- Zellen anklicken oder im Zellinspektor auswählen. Der Canvas ist fokussierbar; Pfeiltasten wechseln die ausgewählte Zelle.
- Start im 50-fach langsameren Beobachtungstempo (ein Tick alle 5 Sekunden). Sechs Tempostufen bis 100-fach langsamer, Pause, Einzelschritt, 2× des gewählten Tempos und reproduzierbarer Reset.
- „Eine Nektarzelle beobachten“ wählt eine frische Nektarzelle und zeigt den sinkenden Wasseranteil mit Balken. Je Zelle höchstens ein Fächelschritt pro Tick.
- Die Populationsgrenze (30–400) begrenzt den Schlupf; sie erzeugt und entfernt keine erwachsenen Bienen.
- Ressourcen, Wetterstabilität und Krankheits-/Räuberdruck wirken live. Ein Stress-Test überschreibt diese drei Umweltwerte für 30 Tage mit 10/10/80 Prozent; anschließend gelten die gewählten Werte wieder.
- Optional: Bienenpfade, Temperaturzonen und Ressourcenflüsse; Vollbild mit Zellinspektor.
- Fünf Lesepaletten mit heller und dunkler Darstellung. Die Ansicht wird, soweit möglich, nur lokal gespeichert.

## Modell

Im Originaltempo 10 fixe Logikticks pro Sekunde, 0,1 Simulationstag pro Tick. Der zusätzliche Beobachtungsfaktor verlangsamt die Logik; 50-fach langsamer ist die Vorauswahl. Die Darstellung bleibt flüssig. Rendering unabhängig per requestAnimationFrame. Unsichtbare Browser-Tabs pausieren die Simulation. Reset verwendet denselben Zufallsstart.

Ei 30, Larve 60, Puppe 120 Ticks. Altersabhängige Arbeiterinnenrollen. 80 Startwaben, maximal 1.200 Waben, maximal 400 erwachsene Arbeiterinnen. Die Königin ist ein Eiablageprozess, Drohnen fehlen. Weitere Modellgrenzen sind in der App dokumentiert.

Nektar und Honig werden als Zucker-Trockenmasse bilanziert. Pollen, freies Wasser und Nektarwasser besitzen eigene Konten. Larven erhalten ausschließlich Nektar, Pollen und freies Wasser; Erwachsene können Honig nutzen. Stockarbeiterinnen halten eine Nektarreserve für die Brut zurück. Zugänge inklusive Anfangsvorrat = Lager + Transit + Abgänge. Es werden nur ganze Einheiten verwendet. Verluste und Verdunstung sind explizite Abgänge. Honigzellen müssen nachweislich eine Nektarphase und mehrere Fächelschritte durchlaufen haben und unter 20 Prozent Wasser enthalten. Am Anfang gibt es keinen Honig.

Ein Kollaps stoppt die Zeit und zeigt genau die letzten 50 Modellschritte. Der Stressbericht zeigt Dauer, Überleben, Nettovorratsänderung und Verluste.

## Prüfen

```sh
node test-model.cjs
node test-ui.cjs
```

19 Bedienaktionen werden zusätzlich über ihre echten Handler mit isoliertem Zustand geprüft; der Vollbildadapter wird mit einem zustandsbehafteten DOM-Ersatz geprüft.

Die Modelltests prüfen unter anderem 250 Tage gesunden Verlauf, Stoffbilanzen nach jedem Tick, Honigherkunft, Mutationsproben der Invarianten, Stressbericht, Hunger, Kollaps, Populations- und Wabengrenzen sowie zwölf alternative Umwelt-/Zufallsszenarien. Die App zeigt zusätzlich eine laufende Systemprüfung einschließlich realer Tick-/Frame-Messung und einen isolierten Starttest.

## Veröffentlichung

GitHub Pages: `main`, Ordner `/ (root)`. Die App liegt vollständig in `index.html`; kein Build notwendig. Die Übersicht in `genaiedu/LearningApps/heft65wl2.html` erhält erst nach erfolgreicher Veröffentlichung einen Link.

## Schriften

Fira Sans und EB Garamond: SIL Open Font License 1.1, vollständige Hinweise im HTML. Alle Grafiken werden prozedural auf einem einzigen Canvas 2D gezeichnet. Keine externen Bilder, Frameworks, Analyse- oder Trackingdienste.
