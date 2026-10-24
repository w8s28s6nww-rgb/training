/* Trainingsplan-Daten (Jahresplan Boxen 2026/2027) – hier anpassen.
   Übung: E(name, sätze, "Sätze×Wdh", pause, rpe, hinweis, felder)
   felder: Eingabefelder pro Satz: "kg","wdh","sek","m","min","runden" (Standard: ["kg","wdh"]) */
(function(){
const E=(name,sets,sxw,rest,rpe,note,f)=>({name,sets,sxw,rest,rpe,note:note||"",f:f||["kg","wdh"]});
const BW=["wdh"], SEK=["sek"], M=["kg","m"], RND=["runden"], MIN=["min"];

const schulterblock=[
  "5 Min. Velo oder zügiges Gehen mit Steigung",
  "Band-Aussenrotation, Ellbogen am Körper – 2×15",
  "Face Pulls mit Band oder Kabel – 2×15",
  "Bizeps-Isometrie, leichte KH, 90° Ellbogen – 3×30–45 Sek. (Schmerz max. 2/10)",
  "Bird Dog und Glute Bridge – je 2×10"];
const aufwaermenP2=[
  "5 Min. Velo",
  "Mobilität: Bird Dog, Glute Bridge, Band-Aussenrotation",
  "Am Schluss: Reha-Block A oder B (ca. 10 Min.), im Wechsel"];
const aufwaermenSpaeter=[
  "5 Min. Velo",
  "Mobilität: Bird Dog, Glute Bridge, Band-Aussenrotation",
  "Face Pulls leicht – 2×15"];

const rehaA=[E("Exzentrischer Curl links",3,"3×10–15","60 Sek.","–","Rechte Hand hilft hoch, links 4 Sek. ablassen; Schmerz ≤ 3/10, Folgetag entscheidet"),
  E("Aussenrotation in Seitlage mit KH",3,"3×12–15","45 Sek.","7","Ellbogen am Körper, Handtuch unter dem Arm"),
  E("Face Pulls Kabel/Band",3,"3×15","45 Sek.","7","Daumen nach hinten drehen")];
const rehaB=[E("Bizeps-Isometrie 90°",4,"4×45 Sek.","45 Sek.","–","Last langsam steigern, ≤ 2/10",["kg","sek"]),
  E("Y-T-W auf der Schrägbank (Bauchlage)",2,"2×8 je Buchstabe","45 Sek.","6","Leichte Scheiben oder ohne Gewicht"),
  E("Liegestütz-Plus an der Bank",2,"2×12","45 Sek.","6","Am Ende Schulterblätter auseinanderschieben (Serratus)",BW)];

const P="60–90 Sek.";
window.PLAN={
 start:"2026-10-26", weeks:52,
 deload:"Deload-Woche: ca. 40–50 % weniger Sätze, Last ca. 10 % tiefer, RPE max. 6–7. Checkpoints in dieser Woche testen.",
 rules:[
  "Schulterschmerz während der Übung max. 3/10, am Folgetag nicht schlechter – sonst eine Stufe zurück.",
  "Einarmige Übungen links beginnen, rechts nicht mehr als links.",
  "Überkopfdrücken, Klimmzüge, Dips, schwere Curls und Schlagen mit Widerstand nur nach bestandenem Checkpoint.",
  "Kein Joggen mit Fersenaufsatz. Sprünge und Seil nur mit Landung auf dem Vorfuss.",
  "Kreuzheben ohne Kreuzgriff (schont die Bizepssehne), lieber Zughilfen.",
  "Zeit knapp? Zuerst die letzte Zusatzübung streichen, nie Aufwärmen oder Schulterblock."],
 phases:[
  {id:"p1",nr:1,name:"Wiedereinstieg",blocks:[1],dates:"26.10.–22.11.2026",ziel:"Gewöhnung, Technik, Last finden",intensity:"RPE 6–7, 10–12 Wdh.",
   pattern:"AB", noDeload:true, warmup:schulterblock,  // Woche 4 = steigern + Test CP1 (kein Deload)
   sessions:{
    A:{title:"Ganzkörper A",place:"Studio",ex:[
      E("Goblet Squat",3,"3×10–12",P,"6–7","Kurzhantel oder Kettlebell; volle Tiefe, so tief wie sauber möglich"),
      E("Kurzhantel-Floor-Press, neutraler Griff",3,"3×10–12",P,"6–7","Boden begrenzt die Bewegung, entlastet die Bizepssehne"),
      E("Einarmiges KH-Rudern",3,"3×10–12",P,"6–7","Auf der Bank abgestützt, neutraler Griff; links zuerst"),
      E("Hip Thrust mit Langhantel",3,"3×10–12",P,"6–7","Rücken an der Bank"),
      E("Suitcase Carry mit Kettlebell",3,"3×30 m pro Seite",P,"6–7","Links zuerst",M),
      E("Dead Bug",3,"3×8 pro Seite",P,"6–7","Langsam ausführen",BW)]},
    B:{title:"Ganzkörper B",place:"Studio",ex:[
      E("Split Squat oder Step-ups mit KH",3,"3×10–12",P,"6–7","Links zuerst"),
      E("Landmine Press einarmig",3,"3×10–12",P,"6–7","Leicht, nur bis Augenhöhe; falls es zwickt: Liegestütze erhöht an der Bank"),
      E("Bruststütz-Rudern mit KH",3,"3×10–12",P,"6–7","Auf der Schrägbank"),
      E("Kettlebell-Kreuzheben vom Boden",3,"3×10–12",P,"6–7","Rücken neutral, Hüfte führt"),
      E("Face Pulls am Kabel",3,"3×15",P,"6–7","Geräte-Ergänzung"),
      E("Seitstütz",3,"3×20–30 Sek. pro Seite",P,"6–7","Links zuerst",SEK)]},
    Sa:{title:"Samstag zuhause: Kondition und Rumpf",place:"Zuhause",ex:[
      E("Seilspringen",1,"5 Runden × 1 Min., je 1 Min. Pause","1 Min.","–","Landung auf dem Vorfuss",RND),
      E("Hometrainer einfahren",1,"5 Min.","–","locker","",MIN),
      E("Intervalle Hometrainer",1,"6–8 × (30 Sek. zügig / 90 Sek. locker)","–","–","Anzahl Intervalle eintragen",RND),
      E("Bulgarian Bag, Bear Hug tragen",4,"4×30 m","–","6–7","Nicht auf der Schulter",M),
      E("Kettlebell Goblet Carry",3,"3×30 m","–","6–7","",M),
      E("Glute Bridge einbeinig",3,"3×10 pro Seite","–","6–7","Links zuerst",BW)],
     alt:"Alternative zu Hometrainer und Tragen: 30–40 Min. Gehen mit Steigung auf dem Laufband (kein Joggen wegen Fersenaufsatz)."}}},
  {id:"p2",nr:2,name:"Grundkraft + Schulter-Reha",blocks:[2,3],dates:"23.11.2026–17.01.2027",ziel:"Grundkraft, Sehne belastbar machen",intensity:"Hauptübungen RPE 7–8 · Haupt 5–8, Zusatz 8–12 Wdh.",
   warmup:aufwaermenP2,
   progression:["Woche 1: unteres Ende der Wdh.-Spanne, RPE 7","Woche 2: +2,5–5 kg (Beine/Kreuzheben) bzw. +1–2 kg (Oberkörper)","Woche 3: RPE 8 (Block 3: Kniebeuge und Kreuzheben 5×5)","Woche 4: Deload, halbe Sätze, Last −10 %"],
   sessions:{
    Mo:{title:"Kraft Kniebeuge + Reha A",place:"Studio",ex:[
      E("Langhantel-Kniebeuge",4,"4×6–8","2–3 Min.","7–8","Reizt die Griffposition die Schulter: Front Squat mit gekreuzten Armen oder schwerer Goblet Squat"),
      E("Kurzhantel-Floor-Press, neutraler Griff",3,"3×8–10","90 Sek.","7","Ab Block 3 alternativ Flachbank, nur so tief wie schmerzfrei"),
      E("Einarmiges KH-Rudern",3,"3×8–10","90 Sek.","7–8","Links zuerst"),
      E("Rumänisches Kreuzheben mit KH",3,"3×10","90 Sek.","7","Hüfte nach hinten, Rücken neutral"),
      E("Pallof Press Kabel",3,"3×10 pro Seite","60 Sek.","7","Ergänzung am Kabel"), ...rehaA]},
    Mi:{title:"Kraft Kreuzheben + Reha B",place:"Studio",ex:[
      E("Kreuzheben Langhantel",4,"4×5–6","2–3 Min.","7–8","Doppelter Obergriff oder Zughilfen, kein Kreuzgriff; Rücken neutral, Hüfte führt"),
      E("Landmine Press einarmig",3,"3×8–10","90 Sek.","7","Links zuerst, nur bis Augenhöhe, solange CP2 offen"),
      E("Bruststütz-Rudern mit KH",3,"3×10","90 Sek.","7–8","Schrägbank, neutraler Griff"),
      E("Hip Thrust mit Langhantel",3,"3×8–10","90 Sek.","8","1 Sek. oben halten"),
      E("Suitcase Carry mit Kettlebell",3,"3×30 m pro Seite","60 Sek.","7","Schwerer als in Phase 1",M), ...rehaB]},
    Fr:{title:"Kraft einbeinig + Reha A",place:"Studio",ex:[
      E("Bulgarian Split Squat mit KH",3,"3×8 pro Seite","2 Min.","7–8","Hinterer Fuss auf der Bank"),
      E("Liegestütze",3,"3×8–12 (erhöht → Boden)","90 Sek.","7","Höhe senken, sobald 3×12 sauber gelingen",BW),
      E("Latzug neutral, eng",3,"3×10–12","90 Sek.","7","Ergänzung am Gerät, leicht, Schmerz ≤ 3/10"),
      E("Kettlebell-Kreuzheben vom Boden",3,"3×10–12","90 Sek.","7","Schwere KB, Tempo kontrolliert"),
      E("Dead Bug mit Gewicht",3,"3×8 pro Seite","60 Sek.","7","Leichte KH in den Händen"), ...rehaA]},
    Sa:{title:"Zuhause: Kondition + Reha B",place:"Zuhause",ex:[
      E("Seilspringen",1,"6–8 × 1 Min. / 1 Min. Pause","–","6–7","Vorfuss; pro Woche eine Runde mehr",RND),
      E("Intervalle Hometrainer",1,"8 × 30 Sek. zügig / 90 Sek. locker","–","8","Ab Block 3: 8 × 30/60 Sek.",RND),
      E("T-Bar-Rudern",3,"3×10","90 Sek.","7","Neutraler Griff"),
      E("Bulgarian Bag, Bear Hug tragen",4,"4×30 m","60 Sek.","7","Nicht auf der Schulter",M),
      E("Seitstütz",3,"3×30–40 Sek. pro Seite","30 Sek.","7","",SEK), ...rehaB]}}},
  {id:"p3",nr:3,name:"Hypertrophie und Kraft",blocks:[4,5,6,7],dates:"18.01.–09.05.2027",ziel:"Muskelaufbau, Überkopf zurück",intensity:"RPE 7–9 · Haupt 6–8, Zusatz 8–15 Wdh.",
   warmup:aufwaermenSpaeter,
   progression:["Doppelte Progression: erst Wiederholungen bis zum oberen Ende, dann Gewicht erhöhen","Block 4–5 volumenbetont (8–12 Wdh.), Block 6–7 schwerer (5–8 Wdh.)","Klimmzug-Band alle 2–4 Wochen eine Stärke leichter","Ziel bis CP4: 3 freie Klimmzüge, 30 Liegestütze"],
   sessions:{
    Mo:{title:"Unterkörper + vertikaler Zug",place:"Studio",ex:[
      E("Langhantel-Kniebeuge",4,"4×6–8","2–3 Min.","8","Block 6–7: 4×5 schwerer"),
      E("Rumänisches Kreuzheben Langhantel",3,"3×8–10","2 Min.","7–8","Obergriff oder Zughilfen"),
      E("Klimmzug mit Band, neutraler Griff",3,"3×5–8","2 Min.","7","Vor CP2: Latzug; ab CP3 zusätzlich 2×3 Negative",BW),
      E("Walking Lunges mit KH",3,"3×10 pro Seite","90 Sek.","8",""),
      E("Reverse Crunch auf der Bank",3,"3×12","60 Sek.","8","",BW),
      E("Exzentrischer Curl links",2,"2×15","45 Sek.","–","Reha"),
      E("Aussenrotation in Seitlage mit KH",2,"2×15","45 Sek.","–","Reha")]},
    Mi:{title:"Oberkörper Drücken/Ziehen + Calisthenics",place:"Studio",ex:[
      E("KH-Bankdrücken, neutraler Griff",4,"4×8–10","2 Min.","8","Flachbank, Tiefe nur schmerzfrei"),
      E("Überkopf-Stufe (Landmine halbkniend → KH-Press halbkniend)",3,"3×8–10","90 Sek.","7","Links zuerst, Stufe nach Checkpoint"),
      E("Langhantel-Rudern im Obergriff",4,"4×8–10","2 Min.","8","Rücken neutral, kein Untergriff"),
      E("KH-Schrägbankdrücken",3,"3×10–12","90 Sek.","8","30° Bank"),
      E("Hammer Curls leicht",3,"3×12","60 Sek.","7","Nur ab CP2 und ≤ 2/10"),
      E("Face Pulls Kabel/Band",3,"3×15","45 Sek.","7",""),
      E("Bear Crawl",4,"4×15 m","60 Sek.","7","Knie knapp über dem Boden",["m"])]},
    Fr:{title:"Ganzkörper Kraft",place:"Studio",ex:[
      E("Kreuzheben Langhantel",4,"4×5","3 Min.","8","Kein Kreuzgriff"),
      E("Liegestütze",3,"3 × max. −2","90 Sek.","8","Ab 3×20: Füsse erhöht",BW),
      E("Einarmiges KH-Rudern",3,"3×8–10","90 Sek.","8","Schwer, links zuerst"),
      E("Bulgarian Split Squat mit KH",3,"3×8–10 pro Seite","2 Min.","8",""),
      E("Farmer's Walk",3,"3×40 m","90 Sek.","8","Schwer",M),
      E("Landmine Punch kontrolliert",3,"3×6 pro Seite","60 Sek.","6","Langsam, kein explosiver Stoss vor CP4")]},
    Sa:{title:"Zuhause: Kondition + Calisthenics-Zirkel",place:"Zuhause",ex:[
      E("Seilspringen",1,"Block 4–5: 10×1/1 Min. · Block 6–7: 3–4 × 3 Min. / 1 Min.","–","7","Vorfuss; Wechselschritt, Boxerschritt",RND),
      E("Intervalle Hometrainer",1,"10 × 30 Sek. hart / 60 Sek. locker","–","8–9","",RND),
      E("Zirkel: 10 Liegestütze · 12 T-Bar-Rudern · 20 m Bear Crawl · 10 Bulgarian-Bag-Kniebeugen · 30 Sek. Seitstütz",1,"4 Runden","2 Min. nach jeder Runde","7–8","Runden-Zeit in Min. notieren",MIN),
      E("Latzug zuhause, neutral",3,"3×10–12","90 Sek.","7","Ergänzung, wenn im Studio kein Zug war")]}}},
  {id:"p4",nr:4,name:"Maximalkraft + Rotations- und Schnellkraft",blocks:[8,9,10],dates:"10.05.–01.08.2027",ziel:"Maximalkraft, Explosivität, Footwork",intensity:"Kraft RPE 8–9 · Haupt 3–5, Power 3–6 Wdh.",
   warmup:aufwaermenSpaeter.concat(["Danach zuerst Sprünge und Würfe (ausgeruht, schnell), dann die schweren Übungen"]),
   progression:["Block 8: 5×5 bei RPE 8","Block 9: 5×3–4 bei RPE 8–9","Block 10: Top-Satz 1×2–3 bei RPE 9 plus 3×3 mit −10 %","Sprünge erst steigern, wenn die Landung leise und sauber ist; Würfe erst schneller, dann schwerer"],
   sessions:{
    Mo:{title:"Maximalkraft Beine + Rotation",place:"Studio",ex:[
      E("Squat Jumps / Box Jumps",4,"4×3","90 Sek.","schnell","Landung auf dem Vorfuss, leise landen",BW),
      E("Langhantel-Kniebeuge",5,"5×3–5","3 Min.","8–9",""),
      E("Kettlebell Swings",4,"4×10","90 Sek.","8","Explosiv aus der Hüfte"),
      E("Rumänisches Kreuzheben Langhantel",3,"3×6–8","2 Min.","8",""),
      E("Medball-Rotationswurf an die Wand",4,"4×5 pro Seite","60 Sek.","schnell","3–5 kg, Kraft aus Bein und Hüfte"),
      E("Footwork-Drills",4,"4 × 1 Min.","30 Sek.","7","Boxerschritt vor/zurück/seitlich, Pivot, Vorfuss",RND)]},
    Mi:{title:"Oberkörper Kraft + Schnellkraft",place:"Studio",ex:[
      E("Medball-Brustwurf",4,"4×5","60 Sek.","schnell","Ab CP4, sonst Landmine Punch kontrolliert"),
      E("KH-Bankdrücken, neutraler Griff",4,"4×5–6","2–3 Min.","8",""),
      E("Klimmzüge",4,"4×3–6","2–3 Min.","8","Ab 4×6: kleines Zusatzgewicht"),
      E("KH-Schulterdrücken stehend",3,"3×6–8","2 Min.","7–8","Ab CP4, links zuerst; sonst KH-Press halbkniend"),
      E("Landmine-Rotation (Landmine 180)",3,"3×6 pro Seite","90 Sek.","7–8","Arme lang, Rotation aus der Hüfte"),
      E("Dips am Barren, begrenzte Tiefe",3,"3×5–8","90 Sek.","7","Ab CP4, Oberarm nur bis parallel, ≤ 2/10"),
      E("KH-Curls mittelschwer",3,"3×8–10","60 Sek.","7","Ab CP4")]},
    Fr:{title:"Ganzkörper Power",place:"Studio",ex:[
      E("Seitliche Sprünge / Skater Jumps",4,"4×4 pro Seite","60 Sek.","schnell","Vorfuss, stabil landen",BW),
      E("Kreuzheben Langhantel",5,"5×3","3 Min.","8–9","Kein Kreuzgriff"),
      E("Landmine Punch einarmig explosiv",4,"4×5 pro Seite","90 Sek.","schnell","Ab CP4, Bein, Hüfte und Arm in einer Kette"),
      E("Split Squat schwer",3,"3×6 pro Seite","2 Min.","8",""),
      E("Bruststütz-Rudern mit KH",4,"4×6","2 Min.","8","Schwer"),
      E("Farmer's Walk",3,"3×30 m","2 Min.","8–9","Schwer",M)]},
    Sa:{title:"Zuhause: Kondition, Seil, Footwork",place:"Zuhause",ex:[
      E("Seilspringen",1,"4–5 × 3 Min. / 1 Min. Pause","–","7–8","Doppelsprünge einstreuen, Vorfuss",RND),
      E("Schattenboxen technisch",1,"3 × 2 Min.","1 Min.","6","Ab CP4, ohne Hanteln, Technik und Beinarbeit",RND),
      E("Intervalle Hometrainer",1,"6–8 × 1 Min. hart / 1 Min. locker","–","8–9","",RND),
      E("Bulgarian Bag Spins",3,"3×6 pro Richtung","90 Sek.","7","Ab CP4, leicht beginnen"),
      E("Zirkel: 15 Liegestütze · 12 T-Bar-Rudern · 15 KB Swings · 20 m Bear Crawl",1,"3 Runden","2 Min.","8","Zeit in Min. notieren",MIN)]}}},
  {id:"p5",nr:5,name:"Power + boxspezifische Kondition",blocks:[11,12,13],dates:"02.08.–24.10.2027",ziel:"Rundenfitness, Power, Boxrückkehr",intensity:"Kraft erhalten RPE 8 · Runden 3 Min. / 1 Min.",
   warmup:aufwaermenSpaeter,
   note:"Sandsack nur nach CP5: Block 11 ca. 50–60 % Härte, Block 12 ca. 70–80 %, Block 13 voll. Bandagen und Handschuhe Pflicht. Schmerz links > 3/10 oder am Folgetag stärker → 1 Woche zurück auf Schattenboxen. Block 13: 1–2 × Boxtraining im Club (nur Technik) ersetzt den Mittwoch.",
   progression:["Military-Zirkel: Block 11: 3 Runden, Block 12: 4, Block 13: 5","Runden am Samstag: Block 11: 6, Block 12: 8, Block 13: 10","Ab 25.10.2027 nach CP6 und Freigabe: 2–3 × Boxen pro Woche, 2 × Kraft"],
   sessions:{
    Mo:{title:"Kraft-Erhalt + Power",place:"Studio",ex:[
      E("Jump Squats (Vorfuss)",3,"3×5","90 Sek.","schnell","",BW),
      E("Langhantel-Kniebeuge",3,"3×3","3 Min.","8","Kraft halten, nicht steigern"),
      E("KH-Bankdrücken, neutraler Griff",3,"3×5","2 Min.","8",""),
      E("Klimmzüge",3,"3 × max. −1","2 Min.","8",""),
      E("Medball-Rotationswurf an die Wand",3,"3×6 pro Seite","60 Sek.","schnell",""),
      E("Landmine Punch einarmig explosiv",3,"3×5 pro Seite","60 Sek.","schnell","")]},
    Mi:{title:"Boxkondition (Runden 3 Min. / 1 Min.)",place:"Studio",ex:[
      E("Seilspringen",1,"2 Runden","1 Min.","6–7","Aufwärmen",RND),
      E("Schattenboxen",1,"3 Runden","1 Min.","7–8","Kombinationen, Meidbewegungen, Footwork",RND),
      E("Sandsack",1,"3 → 6 Runden","1 Min.","7–9","Ab CP5, Härte nach Block; vor CP5: Schattenboxen",RND),
      E("Footwork-Runde",1,"1 Runde","1 Min.","8","Vor/zurück, Pivot, Angles",RND),
      E("Hollow Hold",3,"3 × 30 Sek.","45 Sek.","8","",SEK),
      E("Russian Twist mit Medball",3,"3×20","45 Sek.","8","")]},
    Fr:{title:"Kraft + Military-Calisthenics-Zirkel",place:"Studio",ex:[
      E("Kreuzheben Langhantel",3,"3×3","3 Min.","8","Kein Kreuzgriff"),
      E("Kettlebell Swings (EMOM)",10,"10 Min. × 10 Wdh.","Rest der Minute","8","Jede Minute 10 Swings"),
      E("Military-Zirkel: 5 Klimmzüge · 10 Liegestütze · 15 Air Squats · 10 Burpees (Vorfuss) · 20 m Bear Crawl · 20 Flutter Kicks",1,"3–5 Runden auf Zeit","90 Sek.","8–9","Runden und Zeit notieren",["runden","min"]),
      E("Face Pulls Kabel/Band",2,"2×15","45 Sek.","7","Schulter-Pflege"),
      E("Aussenrotation in Seitlage mit KH",2,"2×15","45 Sek.","7","Schulter-Pflege")]},
    Sa:{title:"Zuhause: Runden-Training",place:"Zuhause",ex:[
      E("Rundenblock: Seil · Schattenboxen · Hometrainer-Sprints (20/10 Sek.) · Bulgarian Bag Spins, im Wechsel",1,"6 → 10 Runden à 3 Min.","1 Min.","8","Block 11: 6, Block 12: 8, Block 13: 10 Runden",RND),
      E("Laufband gehen mit Steigung",1,"20–30 Min.","–","5–6","Lockere Grundlage, kein Joggen",MIN),
      E("Mobilität Hüfte/Brustwirbelsäule",1,"10 Min.","–","–","",MIN)]}}}
 ],
 checkpoints:[
  {id:"CP1",week:4,dates:"16.–22.11.2026",when:"Ende Phase 1",
   tests:["Bizeps-Isometrie links 90°, 5×45 Sek.","Floor Press und Landmine Press, je 3×12 mit Trainingslast","Alltag: Anziehen, Tragen, Schlafen auf links"],
   criteria:"Alles ≤ 2/10, am Folgetag nicht schlechter",
   unlocks:"Phase 2: schwerere Grundübungen, exzentrische Bizepsarbeit"},
  {id:"CP2",week:12,dates:"11.–17.01.2027",when:"Ende Phase 2",
   tests:["Speed-Test-ähnlich: Arm gestreckt vorne auf Schulterhöhe, Handfläche oben, Druck von oben 3×5 Sek.","Widerstand gegen Supination bei 90° Ellbogen","Liegestütze am Boden, sauber","Passives Hängen an der Stange"],
   criteria:"Beide Widerstandstests 0–1/10 und kraftgleich zu rechts · 15 Liegestütze ≤ 2/10 · 20–30 Sek. Hängen ≤ 2/10",
   unlocks:"Phase 3: Landmine Press halbkniend, bandunterstützte Klimmzüge (neutraler Griff), leichte Hammer Curls"},
  {id:"CP3",week:20,dates:"08.–14.03.2027",when:"Mitte Phase 3",
   tests:["Landmine Press halbkniend links, 3×10","Passives Hängen","Liegestütze am Boden","Bandunterstützte Klimmzüge 3×8"],
   criteria:"Last links = rechts, ≤ 2/10 · 45 Sek. Hängen · 25 Liegestütze · kein Folgetagsschmerz",
   unlocks:"Kurzhantel-Press halbkniend einarmig, Klimmzug-Negative, Band schrittweise leichter"},
  {id:"CP4",week:28,dates:"03.–09.05.2027",when:"Ende Phase 3",
   tests:["Kurzhantel-Press halbkniend links, 3×8","Klimmzüge ohne Band","Liegestütze am Boden","Medball-Brustwurf leicht (3 kg), 2×5"],
   criteria:"≤ 2/10 und kein Folgetagsschmerz · mind. 3 saubere Klimmzüge · 30 Liegestütze · Würfe schmerzfrei",
   unlocks:"Phase 4: Schulterdrücken stehend, Klimmzüge ohne Band, Dips mit begrenzter Tiefe, mittelschwere Curls, explosive Würfe, Schattenboxen"},
  {id:"CP5",week:40,dates:"26.07.–01.08.2027",when:"Ende Phase 4",
   tests:["Schattenboxen mit Tempo 3×3 Min.","Leichte Sandsack-Probe: 3 Runden à 2 Min. mit ca. 50 % Härte","Klimmzüge, Rotationswürfe 3×6 pro Seite"],
   criteria:"Alles ≤ 2/10, Schlagkraft links subjektiv = rechts · 6 Klimmzüge · am Folgetag beschwerdefrei",
   unlocks:"Phase 5: Sandsackarbeit, zuerst leicht, dann steigernd; boxspezifische Runden"},
  {id:"CP6",week:52,dates:"18.–24.10.2027",when:"Ende Phase 5",
   tests:["Sandsack 6×3 Min. mit voller Intensität","Runden-Test: 10×3 Min. / 1 Min. Pause (Seil, Schattenboxen, Sandsack)","Military-Zirkel 5 Runden"],
   criteria:"Schmerzfrei bzw. ≤ 2/10, Folgetag beschwerdefrei · ärztliche oder physiotherapeutische Freigabe",
   unlocks:"Volle Rückkehr ins Boxtraining (Pratzen, Partnerübungen, später Sparring)"}
 ],
 cpNote:"Ausgeruht und nach dem Aufwärmen testen, zuerst rechts als Vergleich, dann links. Schmerz 0–10 notieren und am Folgetag nochmals prüfen. Widerstandstests am besten vom Physio. Nicht bestanden: 4 Wochen auf der aktuellen Stufe bleiben, dann erneut testen."
};
})();
