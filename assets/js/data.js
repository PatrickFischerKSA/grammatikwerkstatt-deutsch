(function () {
  function chip(text, role) {
    return { text, role };
  }

  function visualBezug(reference, pronoun, wrong, rule) {
    return {
      chips: [
        chip(reference, "reference"),
        chip(pronoun, "pronoun"),
        chip(wrong, "error"),
        chip(rule, "rule")
      ],
      links: [`${reference} → ${pronoun} ✓`, `${wrong} ✗`]
    };
  }

  function visualKongruenz(subject, verb, wrong, rule) {
    return {
      chips: [
        chip(subject, "reference"),
        chip(verb, "verb"),
        chip(wrong, "error"),
        chip(rule, "rule")
      ],
      links: [`${subject} → ${verb} ✓`, `${wrong} ✗`]
    };
  }

  function visualVerb(controller, verb, wrong, rule) {
    return {
      chips: [
        chip(controller, "reference"),
        chip(verb, "verb"),
        chip(wrong, "error"),
        chip(rule, "rule")
      ],
      links: [`${controller} → ${verb} ✓`, `${wrong} ✗`]
    };
  }

  function visualRektion(governor, phrase, wrong, rule) {
    return {
      chips: [
        chip(governor, "reference"),
        chip(phrase, "pronoun"),
        chip(wrong, "error"),
        chip(rule, "rule")
      ],
      links: [`${governor} → ${phrase} ✓`, `${wrong} ✗`]
    };
  }

  function choice(config) {
    return Object.assign({ type: "choice" }, config);
  }

  function text(config) {
    return Object.assign(
      {
        type: "text",
        inputLabel: "Korrigierte Form",
        placeholder: "Antwort eingeben"
      },
      config
    );
  }

  function drag(config) {
    return Object.assign({ type: "drag" }, config);
  }

  function diagnosis(config) {
    return Object.assign({ type: "diagnosis" }, config);
  }

  const levels = [
    {
      id: "anfanger",
      rank: "01",
      title: "Anfänger",
      subtitle: "Grundlagen klar erkennen",
      description:
        "Kurze, übersichtliche Sätze mit gut sichtbaren Fehlerquellen in Bezug, Kongruenz, Verbform und Rektion.",
      modules: [
        {
          id: "satzbezug",
          title: "Satzbezüge",
          summary: "Pronomen und einfache Relativbezüge eindeutig machen.",
          tasks: [
            choice({
              id: "anf-sb-1",
              title: "Unklares Pronomen auflösen",
              prompt: "Welche Fassung macht klar, dass Jana um einen Rückruf bat?",
              context: "Als Jana mit Lea telefonierte, bat sie um einen Rückruf.",
              options: [
                { id: "a", label: "Als Jana mit Lea telefonierte, bat Jana um einen Rückruf." },
                { id: "b", label: "Als Jana mit Lea telefonierte, bat diese um einen Rückruf." },
                { id: "c", label: "Als Jana mit Lea telefonierte, bat jene um einen Rückruf." },
                { id: "d", label: "Als Jana mit Lea telefonierte, bat die andere um einen Rückruf." }
              ],
              correctOptionId: "a",
              hint: "Achte auf das Bezugswort.",
              solution: "Als Jana mit Lea telefonierte, bat Jana um einen Rückruf.",
              explanation:
                "Das Pronomen 'sie' ist doppeldeutig. Durch die Wiederholung von 'Jana' wird der gemeinte Bezug eindeutig.",
              visual: visualBezug("Jana", "sie", "Lea als möglicher Fehlbezug", "Bezugswort ausschreiben")
            }),
            drag({
              id: "anf-sb-2",
              title: "Bezug klar einsetzen",
              prompt: "Ziehe die passenden Teile in die korrigierte Fassung.",
              context: "Die Kursleiterin sprach mit dem Vater, weil er das Formular noch nicht abgegeben hatte.",
              slots: [
                { id: "subject", label: "Wer hatte das Formular noch nicht abgegeben?" },
                { id: "object", label: "Was war noch nicht abgegeben?" }
              ],
              options: [
                { id: "o1", label: "der Vater", detail: "eindeutiges Bezugswort" },
                { id: "o2", label: "die Kursleiterin", detail: "naheliegend, aber falsch" },
                { id: "o3", label: "das Formular", detail: "korrektes Objekt" },
                { id: "o4", label: "das Gespräch", detail: "Distraktor" }
              ],
              correctMap: { subject: "o1", object: "o3" },
              hint: "Prüfe, auf welche Person sich das Pronomen bezieht.",
              solution: "Die korrigierte Fassung lautet sinngemäss: weil der Vater das Formular noch nicht abgegeben hatte.",
              explanation:
                "Das Pronomen 'er' kann hier missverständlich sein. Die eindeutige Form nennt die Person und das gemeinte Objekt ausdrücklich.",
              visual: visualBezug("der Vater", "er", "die Kursleiterin", "Person klar benennen")
            }),
            text({
              id: "anf-sb-3",
              title: "Besitzbezug präzisieren",
              prompt: "Ersetze nur die missverständliche Stelle so, dass das Heft eindeutig Nora gehört.",
              context: "Mila zeigte Nora ihr Heft.",
              inputLabel: "Ersatz für 'ihr Heft'",
              expectedAnswers: ["Noras Heft"],
              acceptedAnswers: ["Noras Heft", "das Heft von Nora"],
              hint: "Frage dich, wem das Heft gehören soll.",
              solution: "Noras Heft",
              explanation:
                "Das Pronomen 'ihr' kann sich auf Mila oder Nora beziehen. Die Nennung von 'Nora' macht den Besitz eindeutig.",
              visual: visualBezug("Nora", "ihr", "Mila als Alternativbezug", "Besitzbezug klar ausdrücken")
            })
          ]
        },
        {
          id: "kongruenz",
          title: "Satzkongruenz",
          summary: "Subjekt und Verb in einfachen Sätzen richtig aufeinander abstimmen.",
          tasks: [
            choice({
              id: "anf-ko-1",
              title: "Subjekt und Verb abstimmen",
              prompt: "Welche Verbform passt?",
              context: "Die Kinder aus der Musikgruppe ___ pünktlich an.",
              options: [
                { id: "a", label: "kommen" },
                { id: "b", label: "kommt" },
                { id: "c", label: "kam" },
                { id: "d", label: "kommst" }
              ],
              correctOptionId: "a",
              hint: "Stimmt die Verbform wirklich mit dem Subjekt überein?",
              solution: "kommen",
              explanation:
                "Das Subjekt 'die Kinder' steht im Plural. Deshalb braucht der Satz die Verbform 'kommen'.",
              visual: visualKongruenz("die Kinder", "kommen", "kommt", "Plural verlangt Pluralverb")
            }),
            text({
              id: "anf-ko-2",
              title: "Kopf der Nominalgruppe erkennen",
              prompt: "Setze die richtige Verbform ein.",
              context: "Der Korb mit den Bällen ___ im Geräteraum.",
              expectedAnswers: ["steht"],
              hint: "Prüfe, welches Wort die eigentliche Satzmitte bildet.",
              solution: "steht",
              explanation:
                "Nicht 'die Bälle', sondern 'der Korb' ist das Subjekt. Darum steht das Verb im Singular.",
              visual: visualKongruenz("der Korb", "steht", "stehen", "Kernsubjekt bestimmt die Verbform")
            }),
            drag({
              id: "anf-ko-3",
              title: "Gegensatz richtig beugen",
              prompt: "Ziehe die passende Nomen-Verb-Kombination in die beiden Felder.",
              context: "Nicht die Bücher, sondern ___ ___ auf dem Tisch.",
              slots: [
                { id: "subject", label: "Passendes Subjekt" },
                { id: "verb", label: "Passende Verbform" }
              ],
              options: [
                { id: "o1", label: "das Heft", detail: "Singular" },
                { id: "o2", label: "die Hefte", detail: "Plural" },
                { id: "o3", label: "liegt", detail: "Singularverb" },
                { id: "o4", label: "liegen", detail: "Pluralverb" }
              ],
              correctMap: { subject: "o1", verb: "o3" },
              hint: "Achte auf das Wort hinter 'sondern'.",
              solution: "Nicht die Bücher, sondern das Heft liegt auf dem Tisch.",
              explanation:
                "Nach 'sondern' wird das neue Subjekt gesetzt. 'Das Heft' ist singularisch und verlangt daher 'liegt'.",
              visual: visualKongruenz("das Heft", "liegt", "liegen", "entscheidend ist das ersetzende Subjekt")
            })
          ]
        },
        {
          id: "verbformen",
          title: "Verbformen",
          summary: "Grundlegende finite Verbformen in Person, Numerus und Tempus auswählen.",
          tasks: [
            choice({
              id: "anf-vf-1",
              title: "Präteritum im Plural",
              prompt: "Welche Form passt in den Satz?",
              context: "Gestern ___ wir die Bibliothek früher als sonst.",
              options: [
                { id: "a", label: "verliessen" },
                { id: "b", label: "verliess" },
                { id: "c", label: "verlassen" },
                { id: "d", label: "verlässt" }
              ],
              correctOptionId: "a",
              hint: "Achte auf Person, Numerus und Zeitform.",
              solution: "verliessen",
              explanation:
                "Das Subjekt 'wir' verlangt die 1. Person Plural. Da 'gestern' ein abgeschlossenes Ereignis markiert, passt hier das Präteritum.",
              visual: visualVerb("wir", "verliessen", "verliess", "1. Person Plural im Präteritum")
            }),
            text({
              id: "anf-vf-2",
              title: "Präsens nach 'wenn'",
              prompt: "Setze die passende Verbform ein.",
              context: "Wenn du morgen Zeit hast, ___ du mich bitte an.",
              expectedAnswers: ["rufst"],
              hint: "Prüfe, welche Form zu 'du' im Präsens gehört.",
              solution: "rufst",
              explanation:
                "Im Temporalsatz mit 'wenn' steht hier das Präsens. Zu 'du' passt die Form 'rufst'.",
              visual: visualVerb("du", "rufst", "rufe", "Person des Subjekts beachten")
            }),
            choice({
              id: "anf-vf-3",
              title: "Zukunft mit Hilfsverb",
              prompt: "Welche Form vervollständigt den Satz korrekt?",
              context: "Morgen ___ meine Schwester einen Kuchen backen.",
              options: [
                { id: "a", label: "wird" },
                { id: "b", label: "werde" },
                { id: "c", label: "werden" },
                { id: "d", label: "würde" }
              ],
              correctOptionId: "a",
              hint: "Stimmt die finite Form mit dem Subjekt überein?",
              solution: "wird",
              explanation:
                "Das Subjekt 'meine Schwester' ist singularisch. Die Zukunft wird hier mit 'wird' plus Infinitiv gebildet.",
              visual: visualVerb("meine Schwester", "wird", "werden", "Singularsubjekt verlangt Singularform")
            })
          ]
        },
        {
          id: "rektionen",
          title: "Rektionen",
          summary: "Häufige Verbindungen mit Kasus und Präposition sicher bilden.",
          tasks: [
            choice({
              id: "anf-re-1",
              title: "Präposition nach 'warten'",
              prompt: "Welche Präposition passt?",
              context: "Wir warten seit zehn Minuten ___ den Bus.",
              options: [
                { id: "a", label: "auf" },
                { id: "b", label: "an" },
                { id: "c", label: "für" },
                { id: "d", label: "mit" }
              ],
              correctOptionId: "a",
              hint: "Frage dich, welche Präposition diese Konstruktion verlangt.",
              solution: "auf",
              explanation:
                "Das Verb 'warten' verbindet sich in dieser Bedeutung mit 'auf' und dem Akkusativ: 'auf den Bus'.",
              visual: visualRektion("warten", "auf den Bus", "an den Bus", "Verb und Präposition gehören fest zusammen")
            }),
            text({
              id: "anf-re-2",
              title: "Dativobjekt nach 'danken'",
              prompt: "Setze die korrekte Form ein.",
              context: "Er dankt ___ Nachbarin für die Hilfe.",
              expectedAnswers: ["der"],
              hint: "Prüfe, welchen Kasus das Verb verlangt.",
              solution: "der",
              explanation:
                "Das Verb 'danken' fordert ein Dativobjekt. Deshalb heisst es 'der Nachbarin'.",
              visual: visualRektion("danken", "der Nachbarin", "die Nachbarin", "danken verlangt den Dativ")
            }),
            drag({
              id: "anf-re-3",
              title: "Zwei Rektionen kombinieren",
              prompt: "Ziehe die passenden Präpositionen in die beiden Felder.",
              context: "Die Klasse erinnert sich ___ den Ausflug und freut sich ___ das nächste Projekt.",
              slots: [
                { id: "first", label: "Rektion von 'sich erinnern'" },
                { id: "second", label: "Rektion von 'sich freuen'" }
              ],
              options: [
                { id: "o1", label: "an", detail: "passt zu einem Rückbezug" },
                { id: "o2", label: "auf", detail: "passt zu etwas Zukünftigem" },
                { id: "o3", label: "über", detail: "Distraktor" },
                { id: "o4", label: "zu", detail: "Distraktor" }
              ],
              correctMap: { first: "o1", second: "o2" },
              hint: "Unterscheide Rückblick und Erwartung.",
              solution: "Die Klasse erinnert sich an den Ausflug und freut sich auf das nächste Projekt.",
              explanation:
                "'Sich erinnern an' verweist auf Vergangenes. 'Sich freuen auf' richtet sich auf etwas, das noch kommt.",
              visual: visualRektion("sich erinnern / sich freuen", "an / auf", "über / zu", "Bedeutung steuert die Präposition")
            })
          ]
        },
        {
          id: "diagnose",
          title: "Diagnose",
          summary: "Einfache Sätze einer Fehlerart zuordnen und korrigieren.",
          tasks: [
            diagnosis({
              id: "anf-di-1",
              title: "Fehlerart erkennen",
              prompt: "Welche Fehlerart liegt vor, und welche Korrektur stimmt?",
              context: "Die Gruppe von Schülerinnen schreiben morgen den Test.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform im Tempus" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c2",
              correctionOptions: [
                { id: "k1", label: "Die Gruppe von Schülerinnen schreibt morgen den Test." },
                { id: "k2", label: "Die Gruppe von Schülerinnen schrieb morgen den Test." },
                { id: "k3", label: "Die Gruppe von Schülerinnen schreiben den Test morgen." },
                { id: "k4", label: "Die Gruppe von Schülerinnen hat morgen den Test schreiben." }
              ],
              correctCorrectionId: "k1",
              hint: "Prüfe zuerst, welches Wort das Verb steuert.",
              solution: "Fehlerart: Kongruenz. Korrektur: Die Gruppe von Schülerinnen schreibt morgen den Test.",
              explanation:
                "Kern des Subjekts ist 'die Gruppe'. Dieses Singularsubjekt verlangt die Verbform 'schreibt'.",
              visual: visualKongruenz("die Gruppe", "schreibt", "schreiben", "Kern des Subjekts bestimmt das Verb")
            }),
            diagnosis({
              id: "anf-di-2",
              title: "Bezug statt Vermutung",
              prompt: "Ordne den Satz der richtigen Fehlerart zu und wähle die beste Korrektur.",
              context: "Paul zeigte Tim sein neues Fahrrad.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c1",
              correctionOptions: [
                { id: "k1", label: "Paul zeigte Tim Tims neues Fahrrad." },
                { id: "k2", label: "Paul zeigte Tim sein Fahrrad neu." },
                { id: "k3", label: "Paul zeigte Tim das neue Fahrrad von ihm." },
                { id: "k4", label: "Paul zeigte Tim dessen Fahrrad von Paul." }
              ],
              correctCorrectionId: "k1",
              hint: "Achte darauf, wem das Fahrrad gehören soll.",
              solution: "Fehlerart: Satzbezug. Korrektur: Paul zeigte Tim Tims neues Fahrrad.",
              explanation:
                "Das Possessivpronomen 'sein' bleibt unklar. Mit 'Tims' wird der gemeinte Besitzer eindeutig genannt.",
              visual: visualBezug("Tim", "sein", "Paul als möglicher Fehlbezug", "Besitzer ausdrücklich nennen")
            }),
            diagnosis({
              id: "anf-di-3",
              title: "Rektion sicher zuordnen",
              prompt: "Welche Fehlerart liegt vor, und welche Korrektur ist richtig?",
              context: "Sie besteht auf ihre Meinung.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c4",
              correctionOptions: [
                { id: "k1", label: "Sie besteht auf ihrer Meinung." },
                { id: "k2", label: "Sie besteht an ihrer Meinung." },
                { id: "k3", label: "Sie besteht ihre Meinung." },
                { id: "k4", label: "Sie besteht mit ihrer Meinung." }
              ],
              correctCorrectionId: "k1",
              hint: "Frage dich, welchen Kasus die Konstruktion verlangt.",
              solution: "Fehlerart: Rektion. Korrektur: Sie besteht auf ihrer Meinung.",
              explanation:
                "Die feste Verbindung lautet 'auf etwas bestehen'. In dieser Wendung steht hier die Form 'auf ihrer Meinung'.",
              visual: visualRektion("bestehen auf", "auf ihrer Meinung", "auf ihre Meinung", "feste Rektion korrekt beugen")
            })
          ]
        }
      ]
    },
    {
      id: "leicht-fortgeschritten",
      rank: "02",
      title: "Leicht fortgeschritten",
      subtitle: "Erste Mehrdeutigkeiten bewältigen",
      description:
        "Etwas längere Sätze, mehrere plausible Ablenkungen und erste anspruchsvollere Konstruktionen.",
      modules: [
        {
          id: "satzbezug",
          title: "Satzbezüge",
          summary: "Eindeutigkeit in längeren Sätzen sichern.",
          tasks: [
            choice({
              id: "lf-sb-1",
              title: "Mehrdeutiges 'sie' klären",
              prompt: "Welche Version macht klar, dass die Redaktorin den Absatz überarbeitete?",
              context: "Nachdem die Redaktorin mit der Praktikantin gesprochen hatte, überarbeitete sie den Absatz.",
              options: [
                {
                  id: "a",
                  label: "Nachdem die Redaktorin mit der Praktikantin gesprochen hatte, überarbeitete die Redaktorin den Absatz."
                },
                {
                  id: "b",
                  label: "Nachdem die Redaktorin mit der Praktikantin gesprochen hatte, überarbeitete jene den Absatz."
                },
                {
                  id: "c",
                  label: "Nachdem die Redaktorin mit der Praktikantin gesprochen hatte, überarbeitete diese den Absatz."
                },
                {
                  id: "d",
                  label: "Nachdem die Redaktorin mit der Praktikantin gesprochen hatte, überarbeitete die andere den Absatz."
                }
              ],
              correctOptionId: "a",
              hint: "Unterscheide zwischen gemeintem und nur möglichem Bezug.",
              solution:
                "Nachdem die Redaktorin mit der Praktikantin gesprochen hatte, überarbeitete die Redaktorin den Absatz.",
              explanation:
                "Im Ursprungssatz kann 'sie' auf beide Personen verweisen. Die Wiederholung des Bezugsworts löst die Mehrdeutigkeit.",
              visual: visualBezug("die Redaktorin", "sie", "die Praktikantin", "gemeinten Bezug ausdrücklich nennen")
            }),
            drag({
              id: "lf-sb-2",
              title: "Referenz und Ablenkung zuordnen",
              prompt: "Ordne dem Pronomen den gemeinten und den naheliegenden, aber falschen Bezug zu.",
              context: "Im Bericht stand, dass die Abteilungsleiterin die Assistentin informierte, nachdem sie den Hinweis gelesen hatte.",
              slots: [
                { id: "meant", label: "Gemeint mit 'sie'" },
                { id: "tempting", label: "Naheliegender, aber falscher Bezug" }
              ],
              options: [
                { id: "o1", label: "die Abteilungsleiterin", detail: "gemeinte Person" },
                { id: "o2", label: "die Assistentin", detail: "mögliche Fehlinterpretation" },
                { id: "o3", label: "der Hinweis", detail: "Sachwort" },
                { id: "o4", label: "der Bericht", detail: "Distraktor" }
              ],
              correctMap: { meant: "o1", tempting: "o2" },
              hint: "Achte auf die Satzlogik.",
              solution:
                "Gemeint ist die Abteilungsleiterin; die Assistentin ist nur der naheliegende Fehlbezug.",
              explanation:
                "Grammatisch kommen beide Personen infrage. Die inhaltliche Absicht wird erst dann klar, wenn der Bezug eindeutig gemacht wird.",
              visual: visualBezug("die Abteilungsleiterin", "sie", "die Assistentin", "logischen Bezug vom bloss möglichen unterscheiden")
            }),
            text({
              id: "lf-sb-3",
              title: "Interviewbezug präzisieren",
              prompt: "Ersetze nur das missverständliche Pronomen so, dass klar ist: Der Trainer gab das Interview.",
              context: "Der Trainer besprach die Aufstellung mit dem Co-Trainer, bevor er das Interview gab.",
              inputLabel: "Ersatz für 'er'",
              expectedAnswers: ["der Trainer"],
              acceptedAnswers: ["der Trainer", "bevor der Trainer"],
              hint: "Frage dich, wer inhaltlich handeln soll.",
              solution: "der Trainer",
              explanation:
                "Das Pronomen kann sich formal auf beide Personen beziehen. Mit 'der Trainer' wird die Handlung eindeutig zugeordnet.",
              visual: visualBezug("der Trainer", "er", "der Co-Trainer", "handelnde Person ausdrücklich nennen")
            })
          ]
        },
        {
          id: "kongruenz",
          title: "Satzkongruenz",
          summary: "Kongruenz auch bei erweiterten Subjekten sicher erfassen.",
          tasks: [
            choice({
              id: "lf-ko-1",
              title: "Reihe im Singular",
              prompt: "Welche Form ist richtig?",
              context: "Eine Reihe von Fehlern ___ im Schlussabschnitt besonders deutlich auf.",
              options: [
                { id: "a", label: "tritt" },
                { id: "b", label: "treten" },
                { id: "c", label: "traten" },
                { id: "d", label: "getreten" }
              ],
              correctOptionId: "a",
              hint: "Prüfe, welches Wort im Subjekt der Kopf ist.",
              solution: "tritt",
              explanation:
                "'Eine Reihe' ist der Kern der Nominalgruppe und steht im Singular. Darum lautet die Verbform 'tritt'.",
              visual: visualKongruenz("eine Reihe", "tritt", "treten", "Kopf der Gruppe ist singularisch")
            }),
            text({
              id: "lf-ko-2",
              title: "Kongruenz nach 'weder ... noch'",
              prompt: "Setze die richtige Verbform ein.",
              context: "Weder die Eltern noch die Klassenlehrerin ___ mit der Entscheidung einverstanden.",
              expectedAnswers: ["ist"],
              hint: "Achte besonders auf den zweiten Teil der Verbindung.",
              solution: "ist",
              explanation:
                "Im näheren Anschluss steht 'die Klassenlehrerin' im Singular. Daran orientiert sich die Verbform.",
              visual: visualKongruenz("die Klassenlehrerin", "ist", "sind", "nahes Subjekt steuert die Form")
            }),
            drag({
              id: "lf-ko-3",
              title: "Zwei Sätze, zwei Verbformen",
              prompt: "Ordne die passenden Formen zu.",
              context: "Die Liste mit den Namen ___ bereits im Sekretariat, und auch die Kopien ___ dort.",
              slots: [
                { id: "first", label: "Verb zur Liste" },
                { id: "second", label: "Verb zu den Kopien" }
              ],
              options: [
                { id: "o1", label: "liegt", detail: "Singular" },
                { id: "o2", label: "liegen", detail: "Plural" },
                { id: "o3", label: "lag", detail: "falsches Tempus" },
                { id: "o4", label: "steht", detail: "Distraktor" }
              ],
              correctMap: { first: "o1", second: "o2" },
              hint: "Prüfe jedes Subjekt einzeln.",
              solution: "Die Liste mit den Namen liegt bereits im Sekretariat, und auch die Kopien liegen dort.",
              explanation:
                "Die beiden Teilsätze haben unterschiedliche Subjekte. 'Die Liste' verlangt Singular, 'die Kopien' verlangen Plural.",
              visual: visualKongruenz("die Liste / die Kopien", "liegt / liegen", "liegt / liegt", "jede Nominalgruppe separat prüfen")
            })
          ]
        },
        {
          id: "verbformen",
          title: "Verbformen",
          summary: "Verbformen in Abhängigkeit von Satzbau und Logik wählen.",
          tasks: [
            choice({
              id: "lf-vf-1",
              title: "Präsens im Konditionalsatz",
              prompt: "Welche Verbform passt?",
              context: "Wenn die Sitzung länger ___, informieren wir den Hausdienst.",
              options: [
                { id: "a", label: "dauert" },
                { id: "b", label: "dauern" },
                { id: "c", label: "dauere" },
                { id: "d", label: "gedauert" }
              ],
              correctOptionId: "a",
              hint: "Achte auf das Subjekt und die Rolle des Nebensatzes.",
              solution: "dauert",
              explanation:
                "Das Subjekt 'die Sitzung' ist Singular. Im temporalen Konditionalsatz steht hier das Präsens 'dauert'.",
              visual: visualVerb("die Sitzung", "dauert", "dauern", "Singularsubjekt im Nebensatz")
            }),
            text({
              id: "lf-vf-2",
              title: "Irreale Vergleichsform",
              prompt: "Setze die passende Form ein.",
              context: "Er tat so, als ___ er die Nachricht nicht verstanden.",
              expectedAnswers: ["hätte"],
              hint: "Prüfe, welche Form nach 'als' in dieser Konstruktion erwartet wird.",
              solution: "hätte",
              explanation:
                "Die Wendung 'als hätte' bildet eine irreale Vergleichskonstruktion. Deshalb steht hier der Konjunktiv II.",
              visual: visualVerb("als", "hätte", "hat", "irreale Vergleichskonstruktion")
            }),
            drag({
              id: "lf-vf-3",
              title: "Vorzeitigkeit markieren",
              prompt: "Ziehe die passende Kombination in den Satz.",
              context: "Bevor die Gäste ___, ___ die Gastgeberin schon alles vorbereitet.",
              slots: [
                { id: "first", label: "Verb im Nebensatz" },
                { id: "second", label: "Verb im Hauptsatz" }
              ],
              options: [
                { id: "o1", label: "ankamen", detail: "Präteritum Plural" },
                { id: "o2", label: "ankommt", detail: "falsche Person" },
                { id: "o3", label: "hatte", detail: "Vorvergangenheit" },
                { id: "o4", label: "hat", detail: "falsche Zeitbeziehung" }
              ],
              correctMap: { first: "o1", second: "o3" },
              hint: "Frage dich, welche Handlung zuerst abgeschlossen war.",
              solution: "Bevor die Gäste ankamen, hatte die Gastgeberin schon alles vorbereitet.",
              explanation:
                "Das Vorbereiten lag zeitlich vor dem Ankommen der Gäste. Darum braucht der Hauptsatz Plusquamperfekt.",
              visual: visualVerb("zeitlich früher", "hatte", "hat", "Vorvergangenheit gegenüber dem Präteritum")
            })
          ]
        },
        {
          id: "rektionen",
          title: "Rektionen",
          summary: "Präpositionen und Kasus mit häufigen Verwechslungsgefahren trainieren.",
          tasks: [
            choice({
              id: "lf-re-1",
              title: "Hinweisen auf",
              prompt: "Welche Präposition passt?",
              context: "Die Dozentin wies die Studierenden ___ die neue Abgabefrist hin.",
              options: [
                { id: "a", label: "auf" },
                { id: "b", label: "zu" },
                { id: "c", label: "an" },
                { id: "d", label: "für" }
              ],
              correctOptionId: "a",
              hint: "Suche die feste Verbindung mit 'hinweisen'.",
              solution: "auf",
              explanation:
                "Die feste Rektion lautet 'auf etwas hinweisen'. Deshalb heisst es 'auf die neue Abgabefrist'.",
              visual: visualRektion("hinweisen", "auf die Abgabefrist", "an die Abgabefrist", "feste Präposition erkennen")
            }),
            text({
              id: "lf-re-2",
              title: "Adjektivische Verbindung",
              prompt: "Setze die passende Form ein.",
              context: "Sie ist sehr geübt ___ dem Formulieren präziser Einleitungen.",
              expectedAnswers: ["im"],
              hint: "Prüfe die übliche Verbindung von 'geübt' in dieser Bedeutung.",
              solution: "im",
              explanation:
                "'Geübt in etwas sein' ist die feste Verbindung. Mit dem substantivierten Verb lautet die Form 'im Formulieren'.",
              visual: visualRektion("geübt", "im Formulieren", "an dem Formulieren", "Adjektiv und Präposition korrekt verbinden")
            }),
            drag({
              id: "lf-re-3",
              title: "Beweis und Hinweis unterscheiden",
              prompt: "Ziehe die passenden Präpositionen in die beiden Felder.",
              context: "Der Bericht liefert keinen Beweis ___ die These, weist aber deutlich ___ ein methodisches Problem hin.",
              slots: [
                { id: "first", label: "Rektion von 'Beweis'" },
                { id: "second", label: "Rektion von 'hinweisen'" }
              ],
              options: [
                { id: "o1", label: "für", detail: "passend zu 'Beweis'" },
                { id: "o2", label: "auf", detail: "passend zu 'hinweisen'" },
                { id: "o3", label: "an", detail: "Distraktor" },
                { id: "o4", label: "zu", detail: "Distraktor" }
              ],
              correctMap: { first: "o1", second: "o2" },
              hint: "Achte auf die beiden unterschiedlichen Wortverbindungen.",
              solution:
                "Der Bericht liefert keinen Beweis für die These, weist aber deutlich auf ein methodisches Problem hin.",
              explanation:
                "'Beweis für' und 'hinweisen auf' sind zwei verschiedene Rektionen. Beide müssen einzeln geprüft werden.",
              visual: visualRektion("Beweis / hinweisen", "für / auf", "an / zu", "jede Verbindung separat sichern")
            })
          ]
        },
        {
          id: "diagnose",
          title: "Diagnose",
          summary: "Zwischen mehreren plausiblen Fehlerquellen unterscheiden.",
          tasks: [
            diagnosis({
              id: "lf-di-1",
              title: "Teilnehmende richtig steuern",
              prompt: "Bestimme die Fehlerart und wähle die passende Korrektur.",
              context: "Jeder der Teilnehmenden haben seine Unterlagen abgegeben.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform im Modus" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c2",
              correctionOptions: [
                { id: "k1", label: "Jeder der Teilnehmenden hat seine Unterlagen abgegeben." },
                { id: "k2", label: "Jeder der Teilnehmenden haben ihre Unterlagen abgegeben." },
                { id: "k3", label: "Jeder von den Teilnehmenden hat seine Unterlagen abgegeben." },
                { id: "k4", label: "Jeder der Teilnehmenden ist seine Unterlagen abgegeben." }
              ],
              correctCorrectionId: "k1",
              hint: "Frage dich, welches Wort das Verb steuert.",
              solution: "Fehlerart: Kongruenz. Korrektur: Jeder der Teilnehmenden hat seine Unterlagen abgegeben.",
              explanation:
                "Das Subjekt ist 'jeder' und steht im Singular. Daher muss das Verb 'hat' heissen.",
              visual: visualKongruenz("jeder", "hat", "haben", "indefinites Singularsubjekt")
            }),
            diagnosis({
              id: "lf-di-2",
              title: "Rektion sicher entscheiden",
              prompt: "Ordne die Fehlerart zu und wähle die beste Korrektur.",
              context: "Die Rednerin bezog sich an die Studie aus Bern.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c4",
              correctionOptions: [
                { id: "k1", label: "Die Rednerin bezog sich auf die Studie aus Bern." },
                { id: "k2", label: "Die Rednerin bezog sich zu der Studie aus Bern." },
                { id: "k3", label: "Die Rednerin bezog die Studie aus Bern auf sich." },
                { id: "k4", label: "Die Rednerin bezog sich mit der Studie aus Bern." }
              ],
              correctCorrectionId: "k1",
              hint: "Suche die feste Präposition des Verbs.",
              solution: "Fehlerart: Rektion. Korrektur: Die Rednerin bezog sich auf die Studie aus Bern.",
              explanation:
                "Das reflexive Verb lautet 'sich auf etwas beziehen'. Deshalb ist nur 'auf' korrekt.",
              visual: visualRektion("sich beziehen", "auf die Studie", "an die Studie", "Verb + Präposition fest verbinden")
            }),
            diagnosis({
              id: "lf-di-3",
              title: "Sprecherin oder Journalistin?",
              prompt: "Bestimme die Fehlerart und die passende Korrektur.",
              context: "Die Musikerin erklärte der Journalistin, dass sie den Termin verschiebe.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c1",
              correctionOptions: [
                { id: "k1", label: "Die Musikerin erklärte der Journalistin, dass die Musikerin den Termin verschiebe." },
                { id: "k2", label: "Die Musikerin erklärte der Journalistin, dass jene den Termin verschiebe." },
                { id: "k3", label: "Die Musikerin erklärte die Journalistin, dass sie den Termin verschiebe." },
                { id: "k4", label: "Die Musikerin erklärte der Journalistin, dass der Termin sie verschiebe." }
              ],
              correctCorrectionId: "k1",
              hint: "Achte auf das Pronomen im Nebensatz.",
              solution:
                "Fehlerart: Satzbezug. Korrektur: Die Musikerin erklärte der Journalistin, dass die Musikerin den Termin verschiebe.",
              explanation:
                "Das Pronomen 'sie' bleibt unklar. Die Wiederholung des Bezugsworts beseitigt die Mehrdeutigkeit.",
              visual: visualBezug("die Musikerin", "sie", "die Journalistin", "Referenz eindeutig machen")
            })
          ]
        }
      ]
    },
    {
      id: "fortgeschritten",
      rank: "03",
      title: "Fortgeschritten",
      subtitle: "Strukturen gezielt durchschauen",
      description:
        "Längere Satzgefüge mit mehreren plausiblen Lesarten, feineren Rektionen und klarer Progression zwischen Erkennen und Begründen.",
      modules: [
        {
          id: "satzbezug",
          title: "Satzbezüge",
          summary: "Mehrdeutige Bezüge in längeren Strukturen präzisieren.",
          tasks: [
            choice({
              id: "fg-sb-1",
              title: "Wer verschob die Probe?",
              prompt: "Welche Fassung macht klar, dass die Chorleiterin die Probe verschob?",
              context:
                "Nachdem die Chorleiterin mit der Solistin gesprochen hatte, verschob sie die Probe auf Freitag.",
              options: [
                {
                  id: "a",
                  label: "Nachdem die Chorleiterin mit der Solistin gesprochen hatte, verschob die Chorleiterin die Probe auf Freitag."
                },
                {
                  id: "b",
                  label: "Nachdem die Chorleiterin mit der Solistin gesprochen hatte, verschob diese die Probe auf Freitag."
                },
                {
                  id: "c",
                  label: "Nachdem die Chorleiterin mit der Solistin gesprochen hatte, verschob jene die Probe auf Freitag."
                },
                {
                  id: "d",
                  label: "Nachdem die Chorleiterin mit der Solistin gesprochen hatte, wurde die Probe von ihr auf Freitag verschoben."
                }
              ],
              correctOptionId: "a",
              hint: "Achte darauf, welche Person die Handlung ausführt.",
              solution:
                "Nachdem die Chorleiterin mit der Solistin gesprochen hatte, verschob die Chorleiterin die Probe auf Freitag.",
              explanation:
                "Das Pronomen 'sie' erlaubt zwei Lesarten. Erst die Wiederholung des Bezugsworts weist die Handlung eindeutig der Chorleiterin zu.",
              visual: visualBezug("die Chorleiterin", "sie", "die Solistin", "handelnde Person eindeutig benennen")
            }),
            drag({
              id: "fg-sb-2",
              title: "Bezug und Fehlbezug zuordnen",
              prompt: "Ordne dem Pronomen den gemeinten und den nur naheliegenden Bezug zu.",
              context:
                "Die Archivarin erklärte der Volontärin, dass sie die Notizen noch einmal ordnen müsse.",
              slots: [
                { id: "meant", label: "Gemeint mit 'sie'" },
                { id: "tempting", label: "Naheliegender Fehlbezug" }
              ],
              options: [
                { id: "o1", label: "die Volontärin", detail: "gemeinte Person" },
                { id: "o2", label: "die Archivarin", detail: "formal ebenfalls möglich" },
                { id: "o3", label: "die Notizen", detail: "Sachwort" },
                { id: "o4", label: "das Archiv", detail: "Distraktor" }
              ],
              correctMap: { meant: "o1", tempting: "o2" },
              hint: "Trenne gemeinte Aufgabe und bloß formale Anschlussmöglichkeit.",
              solution: "Gemeint ist die Volontärin; die Archivarin bleibt der naheliegende Fehlbezug.",
              explanation:
                "Beide Personen sind feminin und grammatisch anschließbar. Die Satzabsicht verlangt hier aber die Volontärin als Adressatin der Aufgabe.",
              visual: visualBezug("die Volontärin", "sie", "die Archivarin", "logischen Bezug vom formalen unterscheiden")
            }),
            text({
              id: "fg-sb-3",
              title: "Relativanschluss klären",
              prompt: "Ersetze nur den problematischen Anschluss so, dass sich der Satz eindeutig auf den Bericht bezieht.",
              context: "Die Redakteurin strich den Kommentar zum Bericht, der erneut geprüft werden müsse.",
              inputLabel: "Korrigierter Anschluss",
              expectedAnswers: ["der erneut geprüft werden müsse"],
              acceptedAnswers: [
                "der erneut geprüft werden müsse",
                "und dieser müsse erneut geprüft werden"
              ],
              hint: "Frage dich, was geprüft werden soll.",
              solution: "der erneut geprüft werden müsse",
              explanation:
                "Geprüft werden soll der Bericht, nicht der Kommentar. Darum muss der Relativanschluss den Bericht als Bezugswort markieren.",
              visual: visualBezug("den Bericht", "der", "den Kommentar", "Relativsatz an das gemeinte Nomen anschliessen")
            })
          ]
        },
        {
          id: "kongruenz",
          title: "Satzkongruenz",
          summary: "Kongruenz auch bei erweiterten und konkurrierenden Subjekten sichern.",
          tasks: [
            choice({
              id: "fg-ko-1",
              title: "Kernsubjekt mit Genitivzusatz",
              prompt: "Welche Verbform passt?",
              context: "Der Hinweis auf die Beispiele aus dem letzten Kapitel ___ für die Lernenden besonders hilfreich.",
              options: [
                { id: "a", label: "ist" },
                { id: "b", label: "sind" },
                { id: "c", label: "war" },
                { id: "d", label: "seien" }
              ],
              correctOptionId: "a",
              hint: "Prüfe, welches Wort die Satzmitte bildet.",
              solution: "ist",
              explanation:
                "Kern des Subjekts ist 'der Hinweis'. Die Beispiele stehen nur im Präpositionalzusatz und bestimmen die Verbform nicht.",
              visual: visualKongruenz("der Hinweis", "ist", "sind", "Kernsubjekt statt Ergänzung prüfen")
            }),
            text({
              id: "fg-ko-2",
              title: "Sowohl-als-auch im Plural",
              prompt: "Setze die richtige Verbform ein.",
              context: "Sowohl die Einleitung als auch der Schluss ___ noch einmal überarbeitet worden.",
              expectedAnswers: ["sind"],
              hint: "Prüfe, ob die beiden Teile zusammen ein Pluralsubjekt bilden.",
              solution: "sind",
              explanation:
                "Die Verbindung 'sowohl ... als auch' fasst beide Nominalgruppen zusammen. Deshalb steht das Verb im Plural.",
              visual: visualKongruenz("Einleitung + Schluss", "sind", "ist", "verbundene Satzteile ergeben Plural")
            }),
            drag({
              id: "fg-ko-3",
              title: "Kongruenz in zwei Teilsätzen",
              prompt: "Ordne die passenden Verbformen den beiden Sätzen zu.",
              context:
                "Der Plan mit den Ergänzungen ___ bereits freigegeben, doch die zusätzlichen Hinweise ___ noch im Entwurf.",
              slots: [
                { id: "first", label: "Verb zu 'der Plan'" },
                { id: "second", label: "Verb zu 'die Hinweise'" }
              ],
              options: [
                { id: "o1", label: "ist", detail: "Singular" },
                { id: "o2", label: "sind", detail: "Plural" },
                { id: "o3", label: "war", detail: "falsches Tempus" },
                { id: "o4", label: "bleibt", detail: "Distraktor" }
              ],
              correctMap: { first: "o1", second: "o2" },
              hint: "Untersuche beide Subjekte getrennt.",
              solution:
                "Der Plan mit den Ergänzungen ist bereits freigegeben, doch die zusätzlichen Hinweise sind noch im Entwurf.",
              explanation:
                "'Der Plan' ist Singular, 'die Hinweise' stehen im Plural. Jede Verbform richtet sich nach ihrem eigenen Subjekt.",
              visual: visualKongruenz("der Plan / die Hinweise", "ist / sind", "ist / ist", "beide Teilsätze getrennt prüfen")
            })
          ]
        },
        {
          id: "verbformen",
          title: "Verbformen",
          summary: "Verbformen über Zeitstufen und Modus hinweg sauber wählen.",
          tasks: [
            choice({
              id: "fg-vf-1",
              title: "Vorzeitigkeit im Nebensatz",
              prompt: "Welche Form passt in den Satz?",
              context: "Nachdem der Ausschuss die Einwände ___, veröffentlichte er die Stellungnahme.",
              options: [
                { id: "a", label: "geprüft hatte" },
                { id: "b", label: "prüfte" },
                { id: "c", label: "prüfen würde" },
                { id: "d", label: "geprüft hat" }
              ],
              correctOptionId: "a",
              hint: "Prüfe, welche Handlung zuerst abgeschlossen war.",
              solution: "geprüft hatte",
              explanation:
                "Die Prüfung der Einwände geschah vor der Veröffentlichung. Diese Vorzeitigkeit wird hier mit Plusquamperfekt markiert.",
              visual: visualVerb("zeitlich früher", "geprüft hatte", "geprüfte", "Vorzeitigkeit sprachlich sichtbar machen")
            }),
            text({
              id: "fg-vf-2",
              title: "Konjunktiv in indirekter Rede",
              prompt: "Setze die passende Verbform ein.",
              context: "Die Sprecherin erklärte, der Bericht ___ noch nicht vollständig.",
              expectedAnswers: ["sei"],
              hint: "Achte auf den Modus der wiedergegebenen Aussage.",
              solution: "sei",
              explanation:
                "Die Aussage wird indirekt wiedergegeben. Daher ist der Konjunktiv I 'sei' die passende Form.",
              visual: visualVerb("indirekte Rede", "sei", "ist", "Distanz mit Konjunktiv markieren")
            }),
            drag({
              id: "fg-vf-3",
              title: "Bedingung und Folge",
              prompt: "Ziehe die beiden passenden Formen in den Satz.",
              context: "Wenn die Korrekturen rechtzeitig ___, ___ die Abgabe ohne Verzögerung möglich.",
              slots: [
                { id: "first", label: "Verb im Nebensatz" },
                { id: "second", label: "Verb im Hauptsatz" }
              ],
              options: [
                { id: "o1", label: "eintreffen", detail: "Präsens Plural" },
                { id: "o2", label: "eintrifft", detail: "falscher Numerus" },
                { id: "o3", label: "ist", detail: "passende Hauptsatzform" },
                { id: "o4", label: "wäre", detail: "falscher Modus" }
              ],
              correctMap: { first: "o1", second: "o3" },
              hint: "Prüfe zuerst Numerus und dann den tatsächlichen Aussagecharakter.",
              solution: "Wenn die Korrekturen rechtzeitig eintreffen, ist die Abgabe ohne Verzögerung möglich.",
              explanation:
                "'Die Korrekturen' stehen im Plural und verlangen 'eintreffen'. Der Hauptsatz beschreibt eine reale Folge und bleibt deshalb im Indikativ.",
              visual: visualVerb("die Korrekturen", "eintreffen / ist", "eintrifft / wäre", "Numerus und Aussageart gemeinsam prüfen")
            })
          ]
        },
        {
          id: "rektionen",
          title: "Rektionen",
          summary: "Verbale und nominale Rektionen sicher unterscheiden.",
          tasks: [
            choice({
              id: "fg-re-1",
              title: "Einwände gegen",
              prompt: "Welche Präposition passt?",
              context: "Die Arbeitsgruppe erhob mehrere Einwände ___ den ersten Entwurf.",
              options: [
                { id: "a", label: "gegen" },
                { id: "b", label: "zu" },
                { id: "c", label: "an" },
                { id: "d", label: "für" }
              ],
              correctOptionId: "a",
              hint: "Suche die feste Rektion des Nomens.",
              solution: "gegen",
              explanation:
                "Die Verbindung lautet 'Einwände gegen etwas erheben'. Andere Präpositionen klingen nahe, sind hier aber unidiomatisch.",
              visual: visualRektion("Einwände", "gegen den Entwurf", "an den Entwurf", "nominale Rektion korrekt setzen")
            }),
            text({
              id: "fg-re-2",
              title: "Interesse an",
              prompt: "Setze die passende Präposition ein.",
              context: "Die Redaktion zeigte grosses Interesse ___ einer raschen Klärung.",
              expectedAnswers: ["an"],
              hint: "Frage dich, welche Präposition zu 'Interesse' gehört.",
              solution: "an",
              explanation:
                "'Interesse' wird mit 'an' verbunden. Darum heisst es 'Interesse an einer raschen Klärung'.",
              visual: visualRektion("Interesse", "an einer Klärung", "für einer Klärung", "Nomen und Präposition genau verbinden")
            }),
            drag({
              id: "fg-re-3",
              title: "Zwei Rektionen parallel",
              prompt: "Ordne die beiden passenden Präpositionen zu.",
              context: "Der Kommentar weist ___ ein Problem hin und fordert zugleich Respekt ___ der Gegenposition.",
              slots: [
                { id: "first", label: "Rektion von 'hinweisen'" },
                { id: "second", label: "Rektion von 'Respekt'" }
              ],
              options: [
                { id: "o1", label: "auf", detail: "passt zu 'hinweisen'" },
                { id: "o2", label: "vor", detail: "Distraktor" },
                { id: "o3", label: "vor", detail: "falsches Feld" },
                { id: "o4", label: "vor der", detail: "Distraktor" },
                { id: "o5", label: "gegenüber", detail: "passt zu 'Respekt' nicht" },
                { id: "o6", label: "vor der Gegenposition", detail: "Distraktor" },
                { id: "o7", label: "vor", detail: "zweiter Distraktor" },
                { id: "o8", label: "gegenüber", detail: "präpositionale Alternative" },
                { id: "o9", label: "vor", detail: "Wiederholungsdistraktor" },
                { id: "o10", label: "gegenüber der", detail: "passende Form" }
              ],
              correctMap: { first: "o1", second: "o10" },
              hint: "Prüfe beide Wortverbindungen einzeln.",
              solution:
                "Der Kommentar weist auf ein Problem hin und fordert zugleich Respekt gegenüber der Gegenposition.",
              explanation:
                "'Hinweisen auf' und 'Respekt gegenüber' folgen unterschiedlichen Mustern. Gerade nebeneinander müssen beide Rektionen separat geprüft werden.",
              visual: visualRektion("hinweisen / Respekt", "auf / gegenüber der", "vor / gegen", "zwei Anschlüsse getrennt sichern")
            })
          ]
        },
        {
          id: "diagnose",
          title: "Diagnose",
          summary: "Zwischen mehreren plausiblen Fehlerquellen differenzieren.",
          tasks: [
            diagnosis({
              id: "fg-di-1",
              title: "Bezug oder Rektion?",
              prompt: "Welche Fehlerart liegt vor, und welche Korrektur passt am besten?",
              context: "Die Autorin verwies die Redaktion auf, den Begriff genauer zu definieren.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c4",
              correctionOptions: [
                { id: "k1", label: "Die Autorin wies die Redaktion darauf hin, den Begriff genauer zu definieren." },
                { id: "k2", label: "Die Autorin verwies die Redaktion darauf, den Begriff genauer zu definieren." },
                { id: "k3", label: "Die Autorin verwies die Redaktion auf den Begriff genauer zu definieren." },
                { id: "k4", label: "Die Autorin wies die Redaktion hin auf, den Begriff genauer zu definieren." }
              ],
              correctCorrectionId: "k1",
              hint: "Achte auf die vollständige Verbkonstruktion.",
              solution:
                "Fehlerart: Rektion. Korrektur: Die Autorin wies die Redaktion darauf hin, den Begriff genauer zu definieren.",
              explanation:
                "Für die Aufforderung mit Infinitivanschluss braucht der Satz die Konstruktion 'auf etwas hinweisen' mit dem Korrelat 'darauf'.",
              visual: visualRektion("hinweisen", "darauf hin", "auf", "gesamte Rektion mit Korrelat prüfen")
            }),
            diagnosis({
              id: "fg-di-2",
              title: "Wer erklärte was?",
              prompt: "Ordne die Fehlerart zu und wähle die beste Korrektur.",
              context: "Die Referentin erklärte der Moderatorin, dass sie den Ablauf ändern wolle.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c1",
              correctionOptions: [
                { id: "k1", label: "Die Referentin erklärte der Moderatorin, dass die Referentin den Ablauf ändern wolle." },
                { id: "k2", label: "Die Referentin erklärte die Moderatorin, dass sie den Ablauf ändern wolle." },
                { id: "k3", label: "Die Referentin erklärte der Moderatorin, dass diese den Ablauf ändern wolle." },
                { id: "k4", label: "Die Referentin erklärte der Moderatorin, den Ablauf ändern wolle." }
              ],
              correctCorrectionId: "k1",
              hint: "Achte auf das Pronomen im Nebensatz.",
              solution:
                "Fehlerart: Satzbezug. Korrektur: Die Referentin erklärte der Moderatorin, dass die Referentin den Ablauf ändern wolle.",
              explanation:
                "Das Pronomen 'sie' bleibt mehrdeutig. Die explizite Wiederholung beseitigt die Unklarheit.",
              visual: visualBezug("die Referentin", "sie", "die Moderatorin", "gemeinten Bezug ausdrücklich nennen")
            }),
            diagnosis({
              id: "fg-di-3",
              title: "Kongruenz im Sammelbegriff",
              prompt: "Bestimme die Fehlerart und wähle die passende Korrektur.",
              context: "Eine Reihe von Einwänden sprechen gegen die vorgeschlagene Lösung.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c2",
              correctionOptions: [
                { id: "k1", label: "Eine Reihe von Einwänden spricht gegen die vorgeschlagene Lösung." },
                { id: "k2", label: "Eine Reihe von Einwänden sprachen gegen die vorgeschlagene Lösung." },
                { id: "k3", label: "Eine Reihe von Einwänden sprechen auf die vorgeschlagene Lösung." },
                { id: "k4", label: "Eine Reihe von Einwänden sei gegen die vorgeschlagene Lösung." }
              ],
              correctCorrectionId: "k1",
              hint: "Prüfe den Kopf des Subjekts.",
              solution:
                "Fehlerart: Kongruenz. Korrektur: Eine Reihe von Einwänden spricht gegen die vorgeschlagene Lösung.",
              explanation:
                "'Eine Reihe' bleibt der Kern des Subjekts und verlangt daher die Singularform 'spricht'.",
              visual: visualKongruenz("eine Reihe", "spricht", "sprechen", "Sammelbegriff richtig steuern")
            })
          ]
        }
      ]
    },
    {
      id: "amateur",
      rank: "04",
      title: "Amateur",
      subtitle: "Mit geschultem Blick sortieren",
      description:
        "Dieses Level verlangt bereits präzises Prüfen von fast richtigen Formulierungen, bleibt aber noch klar im Übergang zur Oberstufe.",
      modules: [
        {
          id: "satzbezug",
          title: "Satzbezüge",
          summary: "Feine, aber noch lösbare Bezugskonflikte entschärfen.",
          tasks: [
            choice({
              id: "am-sb-1",
              title: "Kommentar oder Bericht?",
              prompt: "Welche Version stellt klar, dass der Bericht gekürzt wurde?",
              context: "Der Lektor besprach den Kommentar zum Bericht, bevor er gekürzt wurde.",
              options: [
                { id: "a", label: "Der Lektor besprach den Kommentar zum Bericht, bevor der Bericht gekürzt wurde." },
                { id: "b", label: "Der Lektor besprach den Kommentar zum Bericht, bevor dieser gekürzt wurde." },
                { id: "c", label: "Der Lektor besprach den Kommentar zum Bericht, bevor jener gekürzt wurde." },
                { id: "d", label: "Der Lektor besprach den Kommentar zum Bericht, bevor man ihn kürzte." }
              ],
              correctOptionId: "a",
              hint: "Achte auf den Gegenstand der Kürzung.",
              solution: "Der Lektor besprach den Kommentar zum Bericht, bevor der Bericht gekürzt wurde.",
              explanation:
                "Im Ausgangssatz kann 'er' auf Kommentar oder Bericht verweisen. Die eindeutige Fassung nennt den Bericht ausdrücklich.",
              visual: visualBezug("der Bericht", "er", "der Kommentar", "Bezugswort bei Sachverhalten ausschreiben")
            }),
            drag({
              id: "am-sb-2",
              title: "Gemeinten Bezug festlegen",
              prompt: "Ordne den gemeinten und den bloß möglichen Bezug von 'diese' zu.",
              context:
                "Die Lehrperson erläuterte der Klasse die Randnotiz zur Aufgabe, weil diese missverstanden worden war.",
              slots: [
                { id: "meant", label: "Gemeint mit 'diese'" },
                { id: "tempting", label: "Formaler Fehlbezug" }
              ],
              options: [
                { id: "o1", label: "die Randnotiz", detail: "gemeinte Bezugsgrösse" },
                { id: "o2", label: "die Aufgabe", detail: "formal naheliegend" },
                { id: "o3", label: "die Klasse", detail: "Plural" },
                { id: "o4", label: "die Lehrperson", detail: "Distraktor" }
              ],
              correctMap: { meant: "o1", tempting: "o2" },
              hint: "Frage dich, was missverstanden worden war.",
              solution: "Gemeint ist die Randnotiz; die Aufgabe bleibt der formale Fehlbezug.",
              explanation:
                "Beide Nominalgruppen sind feminin. Die Satzlogik zeigt jedoch, dass sich das Missverständnis auf die Randnotiz bezieht.",
              visual: visualBezug("die Randnotiz", "diese", "die Aufgabe", "Satzlogik gegen formale Nähe prüfen")
            }),
            text({
              id: "am-sb-3",
              title: "Besitzbezug im Plenum",
              prompt: "Ersetze nur die unklare Stelle so, dass eindeutig die Unterlagen der Gruppe gemeint sind.",
              context: "Die Kursleiterin legte der Gruppe ihre Unterlagen auf den Tisch.",
              inputLabel: "Korrigierte Stelle",
              expectedAnswers: ["die Unterlagen der Gruppe"],
              acceptedAnswers: ["die Unterlagen der Gruppe", "deren Unterlagen"],
              hint: "Prüfe, wem die Unterlagen gehören sollen.",
              solution: "die Unterlagen der Gruppe",
              explanation:
                "Das Possessivpronomen 'ihre' kann sich auf die Kursleiterin oder auf die Gruppe beziehen. Die präzisierte Form nennt den Besitzer eindeutig.",
              visual: visualBezug("die Gruppe", "ihre", "die Kursleiterin", "Besitzbezug nicht offenlassen")
            })
          ]
        },
        {
          id: "kongruenz",
          title: "Satzkongruenz",
          summary: "Fast plausible, aber falsche Kongruenzmuster erkennen.",
          tasks: [
            choice({
              id: "am-ko-1",
              title: "Liste im Singular",
              prompt: "Welche Form passt?",
              context: "Die Liste der noch offenen Punkte ___ bereits an der Wand.",
              options: [
                { id: "a", label: "hängt" },
                { id: "b", label: "hängen" },
                { id: "c", label: "hingen" },
                { id: "d", label: "hänge" }
              ],
              correctOptionId: "a",
              hint: "Prüfe den Kern des Subjekts.",
              solution: "hängt",
              explanation:
                "Nicht 'die Punkte', sondern 'die Liste' ist das Subjekt. Deshalb ist die Singularform 'hängt' richtig.",
              visual: visualKongruenz("die Liste", "hängt", "hängen", "Kernsubjekt statt Genitivergänzung beachten")
            }),
            text({
              id: "am-ko-2",
              title: "Weder-noch im Singular",
              prompt: "Setze die richtige Verbform ein.",
              context: "Weder der Kommentar noch die Einleitung ___ überzeugend formuliert.",
              expectedAnswers: ["ist"],
              hint: "Achte auf das nähere Subjekt vor dem Verb.",
              solution: "ist",
              explanation:
                "Das nähere Subjekt 'die Einleitung' wäre feminin Singular, daher bleibt die Verbform im Singular. Hier lautet sie 'ist'.",
              visual: visualKongruenz("die Einleitung", "ist", "sind", "nahes Singularsubjekt steuert das Verb")
            }),
            drag({
              id: "am-ko-3",
              title: "Zwei Prädikate abgleichen",
              prompt: "Ordne die beiden passenden Formen zu.",
              context:
                "Der Bericht über die Debatte ___ bereits freigegeben, und auch die ergänzenden Notizen ___ archiviert.",
              slots: [
                { id: "first", label: "Verb zum Bericht" },
                { id: "second", label: "Verb zu den Notizen" }
              ],
              options: [
                { id: "o1", label: "ist", detail: "Singular" },
                { id: "o2", label: "sind", detail: "Plural" },
                { id: "o3", label: "war", detail: "falsches Tempus" },
                { id: "o4", label: "bleiben", detail: "Distraktor" }
              ],
              correctMap: { first: "o1", second: "o2" },
              hint: "Prüfe, welches Subjekt jeweils direkt vorliegt.",
              solution:
                "Der Bericht über die Debatte ist bereits freigegeben, und auch die ergänzenden Notizen sind archiviert.",
              explanation:
                "'Der Bericht' verlangt Singular, 'die Notizen' Plural. Gerade ähnliche Satzmuster verleiten zu falscher Angleichung.",
              visual: visualKongruenz("der Bericht / die Notizen", "ist / sind", "ist / ist", "jedes Subjekt einzeln prüfen")
            })
          ]
        },
        {
          id: "verbformen",
          title: "Verbformen",
          summary: "Verbformen in typischen Unterrichtssituationen sicher korrigieren.",
          tasks: [
            choice({
              id: "am-vf-1",
              title: "Konjunktiv in Berichtssprache",
              prompt: "Welche Form passt?",
              context: "Die Sprecherin betonte, der Schluss ___ missverständlich formuliert.",
              options: [
                { id: "a", label: "sei" },
                { id: "b", label: "ist" },
                { id: "c", label: "war" },
                { id: "d", label: "wäre" }
              ],
              correctOptionId: "a",
              hint: "Prüfe, ob die Aussage direkt oder indirekt wiedergegeben wird.",
              solution: "sei",
              explanation:
                "Die Form 'sei' zeigt an, dass die Aussage berichtet und nicht als eigene Feststellung präsentiert wird.",
              visual: visualVerb("berichtete Aussage", "sei", "ist", "indirekte Rede erkennbar machen")
            }),
            text({
              id: "am-vf-2",
              title: "Zeitlogik im Rückblick",
              prompt: "Setze die passende Form ein.",
              context: "Bevor die Korrekturen eintrafen, ___ die Datei schon versandt worden.",
              expectedAnswers: ["war"],
              hint: "Welche Handlung lag zeitlich früher?",
              solution: "war",
              explanation:
                "Die Datei war bereits versandt, bevor die Korrekturen ankamen. Daher steht hier die passende Form zum passivischen Plusquamperfekt.",
              visual: visualVerb("frühere Handlung", "war", "ist", "Zeitfolge sauber abbilden")
            }),
            drag({
              id: "am-vf-3",
              title: "Bedingung und Auftrag",
              prompt: "Ziehe die beiden passenden Formen in den Satz.",
              context: "Wenn die Gruppe mehr Zeit ___, ___ sie den Abschnitt noch einmal überarbeiten.",
              slots: [
                { id: "first", label: "Form im Nebensatz" },
                { id: "second", label: "Form im Hauptsatz" }
              ],
              options: [
                { id: "o1", label: "hätte", detail: "Konjunktiv II" },
                { id: "o2", label: "hat", detail: "reale Gegenwart" },
                { id: "o3", label: "könnte", detail: "mögliche Folge" },
                { id: "o4", label: "kann", detail: "falscher Modus" }
              ],
              correctMap: { first: "o1", second: "o3" },
              hint: "Achte auf den irreal gedachten Fall.",
              solution: "Wenn die Gruppe mehr Zeit hätte, könnte sie den Abschnitt noch einmal überarbeiten.",
              explanation:
                "Der Satz beschreibt eine nicht erfüllte Möglichkeit. Deshalb stehen beide Verbformen im Konjunktiv II.",
              visual: visualVerb("irrealer Fall", "hätte / könnte", "hat / kann", "Modus konsequent durchhalten")
            })
          ]
        },
        {
          id: "rektionen",
          title: "Rektionen",
          summary: "Verwechslungsanfällige Rektionen trennscharf einsetzen.",
          tasks: [
            choice({
              id: "am-re-1",
              title: "Zweifel an",
              prompt: "Welche Präposition passt?",
              context: "Mehrere Rückmeldungen weckten Zweifel ___ der bisherigen Deutung.",
              options: [
                { id: "a", label: "an" },
                { id: "b", label: "über" },
                { id: "c", label: "gegen" },
                { id: "d", label: "auf" }
              ],
              correctOptionId: "a",
              hint: "Suche die feste Verbindung des Nomens.",
              solution: "an",
              explanation:
                "'Zweifel an etwas' ist die idiomatische Rektion. Andere Präpositionen verändern die Struktur oder wirken unnatürlich.",
              visual: visualRektion("Zweifel", "an der Deutung", "über der Deutung", "Nomenrektion sicher anwenden")
            }),
            text({
              id: "am-re-2",
              title: "Bitten um",
              prompt: "Setze die passende Präposition ein.",
              context: "Die Gruppe bat die Lehrperson ___ eine kurze Rückmeldung.",
              expectedAnswers: ["um"],
              hint: "Frage dich, wie 'bitten' angeschlossen wird.",
              solution: "um",
              explanation:
                "Das Verb 'bitten' verlangt in dieser Bedeutung die Präposition 'um'. Deshalb lautet die Fügung 'um eine Rückmeldung bitten'.",
              visual: visualRektion("bitten", "um eine Rückmeldung", "für eine Rückmeldung", "Verbrektion korrekt wählen")
            }),
            drag({
              id: "am-re-3",
              title: "Abhängen von, hinweisen auf",
              prompt: "Ordne die beiden passenden Präpositionen den Konstruktionen zu.",
              context: "Das Ergebnis hängt stark ___ der Vorbereitung ab und weist zugleich ___ einen blinden Fleck hin.",
              slots: [
                { id: "first", label: "Rektion von 'abhängen'" },
                { id: "second", label: "Rektion von 'hinweisen'" }
              ],
              options: [
                { id: "o1", label: "von", detail: "passt zu 'abhängen'" },
                { id: "o2", label: "auf", detail: "passt zu 'hinweisen'" },
                { id: "o3", label: "an", detail: "Distraktor" },
                { id: "o4", label: "für", detail: "Distraktor" }
              ],
              correctMap: { first: "o1", second: "o2" },
              hint: "Prüfe jede Konstruktion für sich.",
              solution:
                "Das Ergebnis hängt stark von der Vorbereitung ab und weist zugleich auf einen blinden Fleck hin.",
              explanation:
                "'Abhängen von' und 'hinweisen auf' sind zwei feste Verbindungen, die leicht vermischt werden.",
              visual: visualRektion("abhängen / hinweisen", "von / auf", "an / für", "Rektionen nicht vermengen")
            })
          ]
        },
        {
          id: "diagnose",
          title: "Diagnose",
          summary: "Fast richtige und wirklich richtige Lösungen trennen.",
          tasks: [
            diagnosis({
              id: "am-di-1",
              title: "Liste oder Punkte?",
              prompt: "Welche Fehlerart liegt vor, und welche Korrektur ist richtig?",
              context: "Die Liste der wichtigsten Punkte stehen bereits auf dem Whiteboard.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c2",
              correctionOptions: [
                { id: "k1", label: "Die Liste der wichtigsten Punkte steht bereits auf dem Whiteboard." },
                { id: "k2", label: "Die Liste der wichtigsten Punkte standen bereits auf dem Whiteboard." },
                { id: "k3", label: "Die Liste der wichtigsten Punkte ist bereits auf dem Whiteboard stehen." },
                { id: "k4", label: "Die Liste von den wichtigsten Punkten steht bereits auf dem Whiteboard." }
              ],
              correctCorrectionId: "k1",
              hint: "Prüfe den Kern des Subjekts.",
              solution:
                "Fehlerart: Kongruenz. Korrektur: Die Liste der wichtigsten Punkte steht bereits auf dem Whiteboard.",
              explanation:
                "Der Kern des Subjekts ist 'die Liste'. Daher muss die Verbform im Singular stehen.",
              visual: visualKongruenz("die Liste", "steht", "stehen", "Kernsubjekt und Verb abstimmen")
            }),
            diagnosis({
              id: "am-di-2",
              title: "Bezug im Nebensatz",
              prompt: "Ordne die Fehlerart zu und wähle die beste Korrektur.",
              context: "Die Betreuerin sagte der Gruppe, dass sie den Abschnitt straffen solle.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c1",
              correctionOptions: [
                { id: "k1", label: "Die Betreuerin sagte der Gruppe, dass die Gruppe den Abschnitt straffen solle." },
                { id: "k2", label: "Die Betreuerin sagte die Gruppe, dass sie den Abschnitt straffen solle." },
                { id: "k3", label: "Die Betreuerin sagte der Gruppe, dass jene den Abschnitt straffen solle." },
                { id: "k4", label: "Die Betreuerin sagte der Gruppe den Abschnitt straffen solle." }
              ],
              correctCorrectionId: "k1",
              hint: "Achte darauf, wer den Auftrag ausführen soll.",
              solution:
                "Fehlerart: Satzbezug. Korrektur: Die Betreuerin sagte der Gruppe, dass die Gruppe den Abschnitt straffen solle.",
              explanation:
                "Das Pronomen 'sie' ist mehrdeutig. Erst die explizite Nennung der Gruppe stellt den Auftrag klar.",
              visual: visualBezug("die Gruppe", "sie", "die Betreuerin", "Adressat und Handelnde trennen")
            }),
            diagnosis({
              id: "am-di-3",
              title: "Rektion bei 'bestehen'",
              prompt: "Bestimme die Fehlerart und die passende Korrektur.",
              context: "Die Autorin bestand an einer präziseren Formulierung.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c4",
              correctionOptions: [
                { id: "k1", label: "Die Autorin bestand auf einer präziseren Formulierung." },
                { id: "k2", label: "Die Autorin bestand in einer präziseren Formulierung." },
                { id: "k3", label: "Die Autorin bestand eine präzisere Formulierung." },
                { id: "k4", label: "Die Autorin bestand für einer präziseren Formulierung." }
              ],
              correctCorrectionId: "k1",
              hint: "Frage dich, welche Präposition das Verb verlangt.",
              solution:
                "Fehlerart: Rektion. Korrektur: Die Autorin bestand auf einer präziseren Formulierung.",
              explanation:
                "Die feste Verbindung lautet 'auf etwas bestehen'. Genau diese Präposition trägt die Bedeutung des Beharrens.",
              visual: visualRektion("bestehen", "auf einer Formulierung", "an einer Formulierung", "feste Präposition des Verbs prüfen")
            })
          ]
        }
      ]
    },
    {
      id: "profi",
      rank: "05",
      title: "Profi",
      subtitle: "Komplexe Strukturen sicher durchdringen",
      description:
        "Nebensätze, Einschübe und kombinierte Problemzonen verlangen systematisches Prüfen.",
      modules: [
        {
          id: "satzbezug",
          title: "Satzbezüge",
          summary: "Mehrfachbezüge in komplexeren Satzgefügen entschlüsseln.",
          tasks: [
            choice({
              id: "pr-sb-1",
              title: "Projektleiterin oder Assistenz?",
              prompt: "Welche Fassung klärt den gemeinten Bezug korrekt?",
              context:
                "Weil die Projektleiterin der Assistenz erklärte, dass sie die Zahlen selbst geprüft habe, blieb die Formulierung missverständlich.",
              options: [
                {
                  id: "a",
                  label: "Weil die Projektleiterin der Assistenz erklärte, dass die Projektleiterin die Zahlen selbst geprüft habe, blieb die Formulierung missverständlich."
                },
                {
                  id: "b",
                  label: "Weil die Projektleiterin der Assistenz erklärte, dass jene die Zahlen selbst geprüft habe, blieb die Formulierung missverständlich."
                },
                {
                  id: "c",
                  label: "Weil die Projektleiterin der Assistenz erklärte, dass diese die Zahlen selbst geprüft habe, blieb die Formulierung missverständlich."
                },
                {
                  id: "d",
                  label: "Weil die Projektleiterin der Assistenz erklärte, dass man die Zahlen selbst geprüft habe, blieb die Formulierung missverständlich."
                }
              ],
              correctOptionId: "a",
              hint: "Unterscheide die grammatisch möglichen von der gemeinten Person.",
              solution:
                "Weil die Projektleiterin der Assistenz erklärte, dass die Projektleiterin die Zahlen selbst geprüft habe, blieb die Formulierung missverständlich.",
              explanation:
                "Im Nebensatz kann 'sie' auf beide Personen zurückgehen. Erst die Wiederholung von 'die Projektleiterin' legt den Bezug eindeutig fest.",
              visual: visualBezug("die Projektleiterin", "sie", "die Assistenz", "gemeinte Referenz ausdrücklich benennen")
            }),
            drag({
              id: "pr-sb-2",
              title: "Ambigen Bezug analysieren",
              prompt: "Ordne den Bezug von 'diese' und den falschen, aber naheliegenden Bezug zu.",
              context:
                "Die Stellungnahme der Fakultät zur Kritik der Studierenden fiel schärfer aus, weil diese lange unbeantwortet geblieben war.",
              slots: [
                { id: "meant", label: "Gemeint mit 'diese'" },
                { id: "tempting", label: "Naheliegende Fehlzuordnung" }
              ],
              options: [
                { id: "o1", label: "die Kritik", detail: "inhaltlich gemeint" },
                { id: "o2", label: "die Fakultät", detail: "formal näher" },
                { id: "o3", label: "die Studierenden", detail: "Plural, aber nicht passend" },
                { id: "o4", label: "die Stellungnahme", detail: "Distraktor" }
              ],
              correctMap: { meant: "o1", tempting: "o2" },
              hint: "Trenne Satzlogik von bloßer Nähe im Ausdruck.",
              solution: "Gemeint ist die Kritik; die Fakultät ist nur der formale Fehlbezug.",
              explanation:
                "Die Kritik blieb unbeantwortet, nicht die Fakultät. Weil mehrere feminine Ausdrücke im Satz stehen, entsteht Mehrdeutigkeit.",
              visual: visualBezug("die Kritik", "diese", "die Fakultät", "logischen Bezug vor formaler Nähe prüfen")
            }),
            text({
              id: "pr-sb-3",
              title: "Relativanschluss präzisieren",
              prompt: "Ersetze nur das Relativpronomen so, dass sich der Satz eindeutig auf den Entwurf bezieht.",
              context: "Der Gutachter kommentierte den Entwurf des Teams, das erneut überarbeitet werden müsse.",
              inputLabel: "Korrigierte Formulierung für den Anschluss",
              expectedAnswers: ["der erneut überarbeitet werden müsse"],
              acceptedAnswers: [
                "der erneut überarbeitet werden müsse",
                "und dieser müsse erneut überarbeitet werden"
              ],
              hint: "Achte darauf, welches Wort tatsächlich überarbeitet werden soll.",
              solution: "der erneut überarbeitet werden müsse",
              explanation:
                "Das Relativpronomen 'das' kann sich leicht auf 'Team' beziehen. Mit 'der' wird der Entwurf als Bezugswort markiert.",
              visual: visualBezug("den Entwurf", "der", "das", "Relativpronomen auf das richtige Bezugswort abstimmen")
            })
          ]
        },
        {
          id: "kongruenz",
          title: "Satzkongruenz",
          summary: "Kongruenz über Distanz und mit konkurrierenden Nominalgruppen sichern.",
          tasks: [
            choice({
              id: "pr-ko-1",
              title: "Entscheidende Nominalgruppe",
              prompt: "Welche Verbform passt?",
              context:
                "Nicht die Ergebnisse der Vorstudien, sondern die Auswertung der Hauptreihe ___ für die Entscheidung ausschlaggebend.",
              options: [
                { id: "a", label: "war" },
                { id: "b", label: "waren" },
                { id: "c", label: "sei" },
                { id: "d", label: "gewesen" }
              ],
              correctOptionId: "a",
              hint: "Frage dich, welches Subjekt nach 'sondern' steht.",
              solution: "war",
              explanation:
                "Entscheidend ist das Subjekt nach 'sondern': 'die Auswertung'. Es steht im Singular und verlangt daher 'war'.",
              visual: visualKongruenz("die Auswertung", "war", "waren", "ersetzendes Subjekt steuert das Verb")
            }),
            text({
              id: "pr-ko-2",
              title: "Mehrheit als Kern",
              prompt: "Setze die korrekte Verbform ein.",
              context: "Die Mehrheit der Anwesenden ___ gegen den Antrag.",
              expectedAnswers: ["stimmte"],
              hint: "Prüfe, welcher Ausdruck der Kern des Subjekts ist.",
              solution: "stimmte",
              explanation:
                "'Die Mehrheit' ist singularisch und bestimmt die Kongruenz. Der Genitivzusatz ändert das nicht.",
              visual: visualKongruenz("die Mehrheit", "stimmte", "stimmten", "Kollektivnomen im Singular")
            }),
            drag({
              id: "pr-ko-3",
              title: "Zwei Strukturen, zwei Formen",
              prompt: "Ziehe die passenden Verbformen in die beiden Lücken.",
              context:
                "Sowohl der Bericht aus Genf als auch die Ergänzung aus Bern ___ gestern eingetroffen. Das Dossier ___ bereits vollständig geprüft.",
              slots: [
                { id: "first", label: "Verb zur Aufzählung" },
                { id: "second", label: "Verb zum Dossier" }
              ],
              options: [
                { id: "o1", label: "sind", detail: "Plural" },
                { id: "o2", label: "ist", detail: "Singular" },
                { id: "o3", label: "wurde", detail: "Singular Präteritum" },
                { id: "o4", label: "wurden", detail: "Plural Präteritum" }
              ],
              correctMap: { first: "o1", second: "o3" },
              hint: "Bearbeite zuerst die Aufzählung, dann den zweiten Satz.",
              solution:
                "Sowohl der Bericht aus Genf als auch die Ergänzung aus Bern sind gestern eingetroffen. Das Dossier wurde bereits vollständig geprüft.",
              explanation:
                "Die durch 'sowohl ... als auch' verbundenen Teile bilden zusammen ein Pluralsubjekt. 'Das Dossier' im zweiten Satz bleibt Singular.",
              visual: visualKongruenz("Bericht + Ergänzung", "sind", "ist", "Aufzählung ergibt Plural")
            })
          ]
        },
        {
          id: "verbformen",
          title: "Verbformen",
          summary: "Modus und Tempus in komplexeren Abhängigkeiten korrekt wählen.",
          tasks: [
            choice({
              id: "pr-vf-1",
              title: "Irreale Folge",
              prompt: "Welche Form passt in den Satz?",
              context: "Hätte der Ausschuss früher reagiert, ___ die Änderung wohl vermeidbar gewesen.",
              options: [
                { id: "a", label: "wäre" },
                { id: "b", label: "waren" },
                { id: "c", label: "ist" },
                { id: "d", label: "sei" }
              ],
              correctOptionId: "a",
              hint: "Achte auf die irreal gedachte Bedingung.",
              solution: "wäre",
              explanation:
                "Der Eingangssatz ist eine irreale Bedingung im Konjunktiv II. Im Folgesatz braucht es daher ebenfalls den Konjunktiv II: 'wäre'.",
              visual: visualVerb("irreale Bedingung", "wäre", "ist", "Konjunktiv II in Bedingung und Folge")
            }),
            text({
              id: "pr-vf-2",
              title: "Indirekter Arbeitsauftrag",
              prompt: "Setze die passende Form ein.",
              context: "Die Vorsitzende verlangte, man ___ den Bericht noch einmal.",
              expectedAnswers: ["überarbeite"],
              hint: "Prüfe den Modus nach einem indirekten Arbeitsauftrag.",
              solution: "überarbeite",
              explanation:
                "Nach 'verlangte' wird hier eine indirekte Aufforderung wiedergegeben. Dafür passt die Konjunktiv-I-Form 'überarbeite'.",
              visual: visualVerb("man", "überarbeite", "überarbeitet", "indirekte Aufforderung im Konjunktiv I")
            }),
            drag({
              id: "pr-vf-3",
              title: "Vorzeitigkeit und Möglichkeit",
              prompt: "Ziehe die passenden Formen in die Lücken.",
              context: "Nachdem die Redaktion die Zitate ___, ___ der Text endlich in Druck gehen.",
              slots: [
                { id: "first", label: "Verb im Nebensatz" },
                { id: "second", label: "Verb im Hauptsatz" }
              ],
              options: [
                { id: "o1", label: "geprüft hatte", detail: "Plusquamperfekt" },
                { id: "o2", label: "geprüft hat", detail: "zu wenig Vorzeitigkeit" },
                { id: "o3", label: "konnte", detail: "Möglichkeit im Präteritum" },
                { id: "o4", label: "konnte nicht", detail: "inhaltlich falsch" }
              ],
              correctMap: { first: "o1", second: "o3" },
              hint: "Welche Handlung war zuerst abgeschlossen?",
              solution: "Nachdem die Redaktion die Zitate geprüft hatte, konnte der Text endlich in Druck gehen.",
              explanation:
                "Die Prüfung der Zitate war bereits abgeschlossen, bevor der Text freigegeben werden konnte. Deshalb stehen Plusquamperfekt und Präteritum nebeneinander.",
              visual: visualVerb("früher abgeschlossene Handlung", "geprüft hatte", "geprüft hat", "Zeitstufen sauber unterscheiden")
            })
          ]
        },
        {
          id: "rektionen",
          title: "Rektionen",
          summary: "Anspruchsvollere Kasus- und Präpositionsbindungen sichern.",
          tasks: [
            choice({
              id: "pr-re-1",
              title: "Schluss auf",
              prompt: "Welche Präposition passt?",
              context: "Die Studie lässt keinen Schluss ___ eine eindeutige Ursache zu.",
              options: [
                { id: "a", label: "auf" },
                { id: "b", label: "zu" },
                { id: "c", label: "für" },
                { id: "d", label: "über" }
              ],
              correctOptionId: "a",
              hint: "Suche die feste Verbindung mit 'Schluss'.",
              solution: "auf",
              explanation:
                "Die feste Verbindung lautet 'einen Schluss auf etwas zulassen'. Darum steht hier 'auf'.",
              visual: visualRektion("Schluss", "auf eine Ursache", "für eine Ursache", "Nomen und Präposition korrekt koppeln")
            }),
            text({
              id: "pr-re-2",
              title: "Plädoyer mit Präposition",
              prompt: "Setze die passende Form ein.",
              context: "Der Autor plädiert ausdrücklich ___ eine präzisere Begriffsverwendung.",
              expectedAnswers: ["für"],
              hint: "Welche Präposition verlangt 'plädieren' in dieser Bedeutung?",
              solution: "für",
              explanation:
                "'Plädieren' verbindet sich hier mit 'für'. Dadurch wird die befürwortete Position markiert.",
              visual: visualRektion("plädieren", "für eine Begriffsverwendung", "auf eine Begriffsverwendung", "Verb + Präposition")
            }),
            drag({
              id: "pr-re-3",
              title: "Kritik und Warnung",
              prompt: "Ordne die passenden Präpositionen zu.",
              context: "Die Kommission übte scharfe Kritik ___ dem Bericht und warnte zugleich ___ vorschnellen Schlüssen.",
              slots: [
                { id: "first", label: "Rektion von 'Kritik'" },
                { id: "second", label: "Rektion von 'warnen'" }
              ],
              options: [
                { id: "o1", label: "an", detail: "passt zu 'Kritik'" },
                { id: "o2", label: "vor", detail: "passt zu 'warnen'" },
                { id: "o3", label: "auf", detail: "Distraktor" },
                { id: "o4", label: "gegen", detail: "Distraktor" }
              ],
              correctMap: { first: "o1", second: "o2" },
              hint: "Prüfe beide Verbindungen getrennt.",
              solution:
                "Die Kommission übte scharfe Kritik an dem Bericht und warnte zugleich vor vorschnellen Schlüssen.",
              explanation:
                "'Kritik an' und 'warnen vor' sind feste Rektionen. Die Präpositionen lassen sich nicht beliebig austauschen.",
              visual: visualRektion("Kritik / warnen", "an / vor", "auf / gegen", "Wortverbindungen genau merken")
            })
          ]
        },
        {
          id: "diagnose",
          title: "Diagnose",
          summary: "Mehrere Ebenen prüfen und die präziseste Korrektur auswählen.",
          tasks: [
            diagnosis({
              id: "pr-di-1",
              title: "Reihe oder Plural?",
              prompt: "Ordne die Fehlerart zu und wähle die richtige Korrektur.",
              context: "Die Reihe von Untersuchungen zeigen, wie komplex das Phänomen ist.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform im Modus" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c2",
              correctionOptions: [
                { id: "k1", label: "Die Reihe von Untersuchungen zeigt, wie komplex das Phänomen ist." },
                { id: "k2", label: "Die Reihe von Untersuchungen zeigten, wie komplex das Phänomen ist." },
                { id: "k3", label: "Die Reihe von Untersuchungen hat gezeigt, wie komplex das Phänomen ist." },
                { id: "k4", label: "Die Reihe an Untersuchungen zeigt, wie komplex das Phänomen ist." }
              ],
              correctCorrectionId: "k1",
              hint: "Prüfe den Kopf des Subjekts.",
              solution: "Fehlerart: Kongruenz. Korrektur: Die Reihe von Untersuchungen zeigt, wie komplex das Phänomen ist.",
              explanation:
                "Nicht 'Untersuchungen', sondern 'die Reihe' bestimmt die Verbform. Das Verb muss darum im Singular stehen.",
              visual: visualKongruenz("die Reihe", "zeigt", "zeigen", "Kernsubjekt statt Genitivergänzung")
            }),
            diagnosis({
              id: "pr-di-2",
              title: "Erinnern daran",
              prompt: "Welche Fehlerart liegt vor, und welche Korrektur stimmt?",
              context: "Die Dozentin erinnerte die Studierenden an, die Quellen sauber zu belegen.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c4",
              correctionOptions: [
                { id: "k1", label: "Die Dozentin erinnerte die Studierenden daran, die Quellen sauber zu belegen." },
                { id: "k2", label: "Die Dozentin erinnerte die Studierenden auf, die Quellen sauber zu belegen." },
                { id: "k3", label: "Die Dozentin erinnerte die Studierenden, an die Quellen sauber zu belegen." },
                { id: "k4", label: "Die Dozentin erinnerte die Studierenden darüber, die Quellen sauber zu belegen." }
              ],
              correctCorrectionId: "k1",
              hint: "Suche die vollständige Konstruktion des Verbs.",
              solution:
                "Fehlerart: Rektion. Korrektur: Die Dozentin erinnerte die Studierenden daran, die Quellen sauber zu belegen.",
              explanation:
                "Die Konstruktion lautet 'jemanden daran erinnern, etwas zu tun'. Das fehlende 'daran' ist grammatisch notwendig.",
              visual: visualRektion("erinnern", "daran, ... zu", "an, ... zu", "gesamte Verbkonstruktion prüfen")
            }),
            diagnosis({
              id: "pr-di-3",
              title: "Arbeitsgruppe oder Vorschlag?",
              prompt: "Bestimme die Fehlerart und die beste Korrektur.",
              context: "Der Referent erläuterte dem Publikum den Vorschlag der Arbeitsgruppe, die noch einmal überarbeitet werden müsse.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c1",
              correctionOptions: [
                {
                  id: "k1",
                  label: "Der Referent erläuterte dem Publikum den Vorschlag der Arbeitsgruppe, der noch einmal überarbeitet werden müsse."
                },
                {
                  id: "k2",
                  label: "Der Referent erläuterte dem Publikum den Vorschlag der Arbeitsgruppe, diese noch einmal überarbeitet werden müsse."
                },
                {
                  id: "k3",
                  label: "Der Referent erläuterte dem Publikum der Vorschlag der Arbeitsgruppe, die noch einmal überarbeitet werden müsse."
                },
                {
                  id: "k4",
                  label: "Der Referent erläuterte dem Publikum den Vorschlag der Arbeitsgruppe, die noch einmal überarbeitet werden mussten."
                }
              ],
              correctCorrectionId: "k1",
              hint: "Prüfe genau, worauf sich der Relativanschluss beziehen soll.",
              solution:
                "Fehlerart: Satzbezug. Korrektur: Der Referent erläuterte dem Publikum den Vorschlag der Arbeitsgruppe, der noch einmal überarbeitet werden müsse.",
              explanation:
                "Überarbeitet werden soll der Vorschlag, nicht die Arbeitsgruppe. Das Relativpronomen muss daher auf 'den Vorschlag' zurückgehen.",
              visual: visualBezug("den Vorschlag", "der", "die Arbeitsgruppe", "Relativsatz am richtigen Kern anschliessen")
            })
          ]
        }
      ]
    },
    {
      id: "experte",
      rank: "06",
      title: "Experte",
      subtitle: "Feine Fehlerquellen trennen",
      description:
        "Verschachtelte Strukturen, subtile Rektionen und anspruchsvolle Verb- und Kongruenzentscheidungen.",
      modules: [
        {
          id: "satzbezug",
          title: "Satzbezüge",
          summary: "Subtile Fehlbezüge in verschachtelten Sätzen auflösen.",
          tasks: [
            choice({
              id: "ex-sb-1",
              title: "Kritik oder Stellungnahme?",
              prompt: "Welche Fassung klärt den Bezug von 'diese' eindeutig?",
              context:
                "Die Stellungnahme des Dekans zur Kritik der Fachschaft wurde erst veröffentlicht, nachdem diese überarbeitet worden war.",
              options: [
                {
                  id: "a",
                  label: "Die Stellungnahme des Dekans zur Kritik der Fachschaft wurde erst veröffentlicht, nachdem die Stellungnahme überarbeitet worden war."
                },
                {
                  id: "b",
                  label: "Die Stellungnahme des Dekans zur Kritik der Fachschaft wurde erst veröffentlicht, nachdem jene überarbeitet worden war."
                },
                {
                  id: "c",
                  label: "Die Stellungnahme des Dekans zur Kritik der Fachschaft wurde erst veröffentlicht, nachdem diese Kritik überarbeitet worden war."
                },
                {
                  id: "d",
                  label: "Die Stellungnahme des Dekans zur Kritik der Fachschaft wurde erst veröffentlicht, nachdem sie überarbeitet worden war."
                }
              ],
              correctOptionId: "a",
              hint: "Achte auf den tatsächlich überarbeiteten Gegenstand.",
              solution:
                "Die Stellungnahme des Dekans zur Kritik der Fachschaft wurde erst veröffentlicht, nachdem die Stellungnahme überarbeitet worden war.",
              explanation:
                "Im Ausgangssatz ist nicht klar, ob 'diese' die Stellungnahme oder die Kritik meint. Die explizite Wiederaufnahme von 'die Stellungnahme' beseitigt den Fehlbezug.",
              visual: visualBezug("die Stellungnahme", "diese", "die Kritik", "Substantiv statt mehrdeutigem Pronomen")
            }),
            drag({
              id: "ex-sb-2",
              title: "Grammatisch nah versus logisch gemeint",
              prompt: "Ordne den gemeinten und den nur grammatisch naheliegenden Bezug zu.",
              context:
                "Dass die Leiterin des Archivs der Historikerin schrieb, nachdem sie die Notiz geprüft hatte, blieb im Protokoll unklar.",
              slots: [
                { id: "meant", label: "Gemeint mit 'sie'" },
                { id: "tempting", label: "Nur formal naheliegend" }
              ],
              options: [
                { id: "o1", label: "die Leiterin des Archivs", detail: "gemeint" },
                { id: "o2", label: "die Historikerin", detail: "naheliegender Fehlbezug" },
                { id: "o3", label: "die Notiz", detail: "Sachwort" },
                { id: "o4", label: "das Protokoll", detail: "Distraktor" }
              ],
              correctMap: { meant: "o1", tempting: "o2" },
              hint: "Unterscheide das Gemeinte von der grammatischen Nähe.",
              solution: "Gemeint ist die Leiterin des Archivs; die Historikerin ist der naheliegende Fehlbezug.",
              explanation:
                "Beide Personen sind feminin und grammatisch mögliche Bezugswörter. Erst die Satzlogik klärt, wer die Notiz geprüft hat.",
              visual: visualBezug("die Leiterin des Archivs", "sie", "die Historikerin", "logischen und formalen Bezug trennen")
            }),
            text({
              id: "ex-sb-3",
              title: "Relativsatz an den richtigen Kern anschliessen",
              prompt: "Ersetze nur das fehlerhafte Relativpronomen.",
              context: "Die Redaktion kommentierte die Stellungnahme des Ombudsmanns, der zunächst unbeachtet geblieben war.",
              inputLabel: "Korrektes Relativpronomen",
              expectedAnswers: ["die"],
              hint: "Frage dich, was unbeachtet geblieben war.",
              solution: "die",
              explanation:
                "Unbeachtet blieb die Stellungnahme, nicht der Ombudsmann. Darum muss der Relativsatz mit 'die' an 'die Stellungnahme' angeschlossen werden.",
              visual: visualBezug("die Stellungnahme", "die", "der", "Relativpronomen am gemeinten Bezugswort ausrichten")
            })
          ]
        },
        {
          id: "kongruenz",
          title: "Satzkongruenz",
          summary: "Kongruenz in Distanzstellungen und bei komplexem Aufbau sichern.",
          tasks: [
            choice({
              id: "ex-ko-1",
              title: "Nachtrag statt Kopie",
              prompt: "Welche Form passt?",
              context:
                "Nicht die mit Randbemerkungen versehene Kopie der Gutachten, sondern der Nachtrag zum Bericht ___ zuletzt verschickt worden.",
              options: [
                { id: "a", label: "ist" },
                { id: "b", label: "sind" },
                { id: "c", label: "war" },
                { id: "d", label: "waren" }
              ],
              correctOptionId: "a",
              hint: "Suche das tatsächlich mit dem Prädikat verbundene Subjekt.",
              solution: "ist",
              explanation:
                "Der Satz kontrastiert zwei Nominalgruppen. Das Prädikat richtet sich nach 'der Nachtrag', also nach einem Singularsubjekt.",
              visual: visualKongruenz("der Nachtrag", "ist", "sind", "Kontrastkonstruktion richtig auflösen")
            }),
            text({
              id: "ex-ko-2",
              title: "Weder-noch mit Distanz",
              prompt: "Setze die passende Verbform ein.",
              context: "Weder das Kapitel über die Methode noch die Anmerkungen im Anhang ___ vollständig überarbeitet.",
              expectedAnswers: ["sind"],
              hint: "Achte auf das nähere Subjekt direkt vor dem Verb.",
              solution: "sind",
              explanation:
                "Direkt vor dem Verb steht 'die Anmerkungen im Anhang' im Plural. Daher lautet die Verbform 'sind'.",
              visual: visualKongruenz("die Anmerkungen", "sind", "ist", "naher Pluralteil steuert die Verbform")
            }),
            drag({
              id: "ex-ko-3",
              title: "Kollektiv und Einzelhinweis trennen",
              prompt: "Ordne die beiden Verbformen korrekt zu.",
              context:
                "Eine Vielzahl von Einwänden ___ im Protokoll festgehalten; zugleich ___ der entscheidende Hinweis im letzten Absatz beinahe unter.",
              slots: [
                { id: "first", label: "Verb zur Vielzahl" },
                { id: "second", label: "Verb zum Hinweis" }
              ],
              options: [
                { id: "o1", label: "wurde", detail: "Singular" },
                { id: "o2", label: "wurden", detail: "Plural" },
                { id: "o3", label: "ging", detail: "Singular Präteritum" },
                { id: "o4", label: "gingen", detail: "Plural Präteritum" }
              ],
              correctMap: { first: "o1", second: "o3" },
              hint: "Prüfe die beiden Subjekte unabhängig voneinander.",
              solution:
                "Eine Vielzahl von Einwänden wurde im Protokoll festgehalten; zugleich ging der entscheidende Hinweis im letzten Absatz beinahe unter.",
              explanation:
                "'Eine Vielzahl' wird hier als singularische Sammelbezeichnung behandelt. 'Der entscheidende Hinweis' ist ebenfalls Singular.",
              visual: visualKongruenz("eine Vielzahl / der Hinweis", "wurde / ging", "wurden / gingen", "zwei Singularsubjekte erkennen")
            })
          ]
        },
        {
          id: "verbformen",
          title: "Verbformen",
          summary: "Modus und Zeitbezug in anspruchsvollen Gefügen sichern.",
          tasks: [
            choice({
              id: "ex-vf-1",
              title: "Nicht freigeben dürfen",
              prompt: "Welche Form passt in den Satz?",
              context: "Ohne dass die Belege erneut geprüft worden wären, ___ die Redaktion den Text freigeben dürfen.",
              options: [
                { id: "a", label: "hätte" },
                { id: "b", label: "hat" },
                { id: "c", label: "habe" },
                { id: "d", label: "hatten" }
              ],
              correctOptionId: "a",
              hint: "Die Konstruktion beschreibt eine irreale Möglichkeit in der Vergangenheit.",
              solution: "hätte",
              explanation:
                "Die Belege wurden eben nicht erneut geprüft. Deshalb wird die gedachte Möglichkeit mit Konjunktiv II Vergangenheit ausgedrückt: 'hätte ... dürfen'.",
              visual: visualVerb("irreale Möglichkeit", "hätte", "hat", "Konjunktiv II der Vergangenheit")
            }),
            text({
              id: "ex-vf-2",
              title: "Irrealer Vergleich mit Partizip",
              prompt: "Setze die passende Form ein.",
              context: "Der Bericht klingt, als ___ er unter grossem Zeitdruck entstanden.",
              expectedAnswers: ["sei"],
              hint: "Achte auf die Form nach 'als' in einem Vergleichssatz.",
              solution: "sei",
              explanation:
                "Die Konstruktion 'als sei er entstanden' markiert einen nur scheinbaren Eindruck. Dafür wird hier der Konjunktiv I verwendet.",
              visual: visualVerb("als", "sei", "ist", "Vergleichseindruck im Konjunktiv")
            }),
            drag({
              id: "ex-vf-3",
              title: "Irreale Vorzeitigkeit bilden",
              prompt: "Ziehe die passenden Formen in die beiden Felder.",
              context: "Wäre der Hinweis früher ernst genommen ___, ___ man die spätere Korrektur vermeiden können.",
              slots: [
                { id: "first", label: "Partizipialform" },
                { id: "second", label: "Finite Form" }
              ],
              options: [
                { id: "o1", label: "worden", detail: "korrekte Ergänzung" },
                { id: "o2", label: "würde", detail: "falscher Modus" },
                { id: "o3", label: "hätte", detail: "richtige Folgeform" },
                { id: "o4", label: "hatte", detail: "falscher Modus" }
              ],
              correctMap: { first: "o1", second: "o3" },
              hint: "Die Konstruktion ist irreal und rückblickend.",
              solution:
                "Wäre der Hinweis früher ernst genommen worden, hätte man die spätere Korrektur vermeiden können.",
              explanation:
                "Im irrealen Bedingungssatz braucht das Passiv die Form 'worden'. Im Folgesatz steht passend dazu 'hätte ... vermeiden können'.",
              visual: visualVerb("irreale Bedingung", "worden / hätte", "würde / hatte", "Modus konsequent halten")
            })
          ]
        },
        {
          id: "rektionen",
          title: "Rektionen",
          summary: "Subtile Verbindungen von Verben, Nomen und Adjektiven sichern.",
          tasks: [
            choice({
              id: "ex-re-1",
              title: "Bestehen auf",
              prompt: "Welche Präposition passt?",
              context: "Die Autorin besteht weiterhin ___ einer präzisen Trennung von Befund und Bewertung.",
              options: [
                { id: "a", label: "auf" },
                { id: "b", label: "an" },
                { id: "c", label: "für" },
                { id: "d", label: "mit" }
              ],
              correctOptionId: "a",
              hint: "Prüfe die feste Verbindung des Verbs.",
              solution: "auf",
              explanation:
                "'Auf etwas bestehen' ist eine feste Rektion. Nur 'auf' bildet hier die idiomatische Verbindung.",
              visual: visualRektion("bestehen", "auf einer Trennung", "an einer Trennung", "Verbbindung nicht austauschen")
            }),
            text({
              id: "ex-re-2",
              title: "Sich richten gegen",
              prompt: "Setze die passende Präposition ein.",
              context: "Die Kritik richtet sich nicht ___ einzelne Personen, sondern gegen die Methode.",
              expectedAnswers: ["gegen"],
              hint: "Achte auf die parallele Struktur im Satz.",
              solution: "gegen",
              explanation:
                "Die Konstruktion lautet 'sich gegen etwas richten'. Die zweite Hälfte des Satzes bestätigt dieselbe Rektion.",
              visual: visualRektion("sich richten", "gegen einzelne Personen", "an einzelne Personen", "Parallelstruktur hilft bei der Rektion")
            }),
            drag({
              id: "ex-re-3",
              title: "Anlass und Schutz",
              prompt: "Ordne die passenden Präpositionen den beiden Konstruktionen zu.",
              context: "Die Notiz gibt Anlass ___ Rückfragen, schützt aber nicht ___ dem Vorwurf der Unschärfe.",
              slots: [
                { id: "first", label: "Rektion von 'Anlass geben'" },
                { id: "second", label: "Rektion von 'schützen'" }
              ],
              options: [
                { id: "o1", label: "zu", detail: "passt zu 'Anlass'" },
                { id: "o2", label: "vor", detail: "passt zu 'schützen'" },
                { id: "o3", label: "für", detail: "Distraktor" },
                { id: "o4", label: "an", detail: "Distraktor" }
              ],
              correctMap: { first: "o1", second: "o2" },
              hint: "Suche die beiden festen Präpositionsanschlüsse.",
              solution:
                "Die Notiz gibt Anlass zu Rückfragen, schützt aber nicht vor dem Vorwurf der Unschärfe.",
              explanation:
                "'Anlass zu' und 'vor etwas schützen' sind eigenständige Rektionen. Beide müssen gezielt erinnert werden.",
              visual: visualRektion("Anlass geben / schützen", "zu / vor", "für / an", "zwei feste Anschlüsse trennen")
            })
          ]
        },
        {
          id: "diagnose",
          title: "Diagnose",
          summary: "Mehrere Fehlerbereiche gegeneinander abgrenzen.",
          tasks: [
            diagnosis({
              id: "ex-di-1",
              title: "Leitfrage oder Diskussion?",
              prompt: "Ordne die Fehlerart zu und wähle die richtige Korrektur.",
              context: "Die Diskussion um die Leitfrage zeigen, wie unscharf der Begriff verwendet wurde.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c2",
              correctionOptions: [
                { id: "k1", label: "Die Diskussion um die Leitfrage zeigt, wie unscharf der Begriff verwendet wurde." },
                { id: "k2", label: "Die Diskussion um die Leitfrage zeigten, wie unscharf der Begriff verwendet wurde." },
                { id: "k3", label: "Die Diskussion über die Leitfrage zeigen, wie unscharf der Begriff verwendet wurde." },
                { id: "k4", label: "Die Diskussion um die Leitfrage habe gezeigt, wie unscharf der Begriff verwendet wurde." }
              ],
              correctCorrectionId: "k1",
              hint: "Prüfe den Kopf des Subjekts, nicht den Präpositionalzusatz.",
              solution:
                "Fehlerart: Kongruenz. Korrektur: Die Diskussion um die Leitfrage zeigt, wie unscharf der Begriff verwendet wurde.",
              explanation:
                "'Die Diskussion' ist Singular. Der Zusatz 'um die Leitfrage' ändert daran nichts.",
              visual: visualKongruenz("die Diskussion", "zeigt", "zeigen", "Präpositionalergänzung steuert das Verb nicht")
            }),
            diagnosis({
              id: "ex-di-2",
              title: "Bericht freigeben",
              prompt: "Bestimme die Fehlerart und die beste Korrektur.",
              context: "Die Gutachterin drängte auf, den Bericht noch einmal zu prüfen.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c4",
              correctionOptions: [
                { id: "k1", label: "Die Gutachterin drängte darauf, den Bericht noch einmal zu prüfen." },
                { id: "k2", label: "Die Gutachterin drängte auf den Bericht, ihn noch einmal zu prüfen." },
                { id: "k3", label: "Die Gutachterin drängte an, den Bericht noch einmal zu prüfen." },
                { id: "k4", label: "Die Gutachterin drängte, auf den Bericht noch einmal zu prüfen." }
              ],
              correctCorrectionId: "k1",
              hint: "Prüfe die vollständige Ergänzung zum Verb.",
              solution:
                "Fehlerart: Rektion. Korrektur: Die Gutachterin drängte darauf, den Bericht noch einmal zu prüfen.",
              explanation:
                "Die Konstruktion lautet 'auf etwas drängen' beziehungsweise mit Infinitivanschluss 'darauf drängen, etwas zu tun'.",
              visual: visualRektion("drängen", "darauf, ... zu", "auf, ... zu", "Korrelat korrekt bilden")
            }),
            diagnosis({
              id: "ex-di-3",
              title: "Einwand oder Ombudsstelle?",
              prompt: "Ordne die Fehlerart zu und wähle die präziseste Korrektur.",
              context: "Die Redaktion kommentierte den Einwand der Ombudsstelle, der zunächst unbeachtet geblieben war.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c1",
              correctionOptions: [
                { id: "k1", label: "Die Redaktion kommentierte den Einwand der Ombudsstelle, der zunächst unbeachtet geblieben war." },
                { id: "k2", label: "Die Redaktion kommentierte den Einwand der Ombudsstelle, welcher zunächst unbeachtet geblieben war." },
                { id: "k3", label: "Die Redaktion kommentierte die Ombudsstelle, deren Einwand zunächst unbeachtet geblieben war." },
                { id: "k4", label: "Die Redaktion kommentierte den Einwand der Ombudsstelle, die zunächst unbeachtet geblieben war." }
              ],
              correctCorrectionId: "k1",
              hint: "Prüfe, ob der Relativsatz wirklich am gemeinten Wort anschliesst.",
              solution:
                "Fehlerart: Satzbezug. Korrektur: Die Redaktion kommentierte den Einwand der Ombudsstelle, der zunächst unbeachtet geblieben war.",
              explanation:
                "Hier ist gerade der Einwand unbeachtet geblieben; der Relativsatz muss also auf 'den Einwand' zurückgehen. Die Variante mit 'die' würde fälschlich auf die Ombudsstelle verweisen.",
              visual: visualBezug("den Einwand", "der", "die Ombudsstelle", "Relativsatz am Kernnomen befestigen")
            })
          ]
        }
      ]
    },
    {
      id: "grammatik-pro",
      rank: "07",
      title: "Grammatik-Pro",
      subtitle: "Grenzfälle fachlich begründen",
      description:
        "Sehr feine Aufgaben mit Mehrdeutigkeiten, Grenzfällen und fachlich anspruchsvollen Rektionen und Bezügen.",
      modules: [
        {
          id: "satzbezug",
          title: "Satzbezüge",
          summary: "Subtile Bezugsfehler fachlich präzise auflösen.",
          tasks: [
            choice({
              id: "nd-sb-1",
              title: "Anmerkung oder Einwand?",
              prompt: "Welche Fassung klärt den problematischen Bezug fachlich sauber?",
              context:
                "Die Anmerkung des Gutachters zum Einwand der Kommission wurde erst aufgenommen, nachdem dieser überarbeitet worden war.",
              options: [
                {
                  id: "a",
                  label: "Die Anmerkung des Gutachters zum Einwand der Kommission wurde erst aufgenommen, nachdem der Einwand überarbeitet worden war."
                },
                {
                  id: "b",
                  label: "Die Anmerkung des Gutachters zum Einwand der Kommission wurde erst aufgenommen, nachdem diese überarbeitet worden war."
                },
                {
                  id: "c",
                  label: "Die Anmerkung des Gutachters zum Einwand der Kommission wurde erst aufgenommen, nachdem jener überarbeitet worden war."
                },
                {
                  id: "d",
                  label: "Die Anmerkung des Gutachters zum Einwand der Kommission wurde erst aufgenommen, nachdem man ihn überarbeitet worden war."
                }
              ],
              correctOptionId: "a",
              hint: "Frage dich, welches Element tatsächlich überarbeitet wurde.",
              solution:
                "Die Anmerkung des Gutachters zum Einwand der Kommission wurde erst aufgenommen, nachdem der Einwand überarbeitet worden war.",
              explanation:
                "In dem Satz konkurrieren mehrere maskuline Formen. Die Wiederholung von 'der Einwand' beseitigt die fachlich heikle Mehrdeutigkeit.",
              visual: visualBezug("der Einwand", "dieser", "der Gutachter", "bei Grenzfällen Kernnomen wiederholen")
            }),
            drag({
              id: "nd-sb-2",
              title: "Bezugsanalyse im Satzgefüge",
              prompt: "Ordne den gemeinten und den bloß formal verfügbaren Bezug zu.",
              context:
                "Dass die Leiterin der Fachstelle der Autorin schrieb, nachdem sie die Passage noch einmal abgewogen hatte, blieb selbst im Kommentarstrang unklar.",
              slots: [
                { id: "meant", label: "Gemeint mit 'sie'" },
                { id: "tempting", label: "Formal ebenfalls möglich" }
              ],
              options: [
                { id: "o1", label: "die Leiterin der Fachstelle", detail: "gemeinter Bezug" },
                { id: "o2", label: "die Autorin", detail: "formal möglicher Bezug" },
                { id: "o3", label: "die Passage", detail: "nicht personal" },
                { id: "o4", label: "der Kommentarstrang", detail: "Distraktor" }
              ],
              correctMap: { meant: "o1", tempting: "o2" },
              hint: "Unterscheide formale Anschlussmöglichkeit und gemeinte Verantwortung.",
              solution: "Gemeint ist die Leiterin der Fachstelle; die Autorin bleibt der formale Fehlbezug.",
              explanation:
                "Gerade in Lehrerkommentaren ist diese Art von Mehrdeutigkeit problematisch. Fachlich sauber ist nur eine Lösung, die Verantwortlichkeit explizit benennt.",
              visual: visualBezug("die Leiterin der Fachstelle", "sie", "die Autorin", "formale und logische Lesart auseinanderhalten")
            }),
            text({
              id: "nd-sb-3",
              title: "Relativsatz bei Grenzfall",
              prompt: "Ersetze nur den problematischen Relativanschluss.",
              context: "Die Redaktion kritisierte die Zusammenfassung des Gutachtens, die fachlich unpräzise gewesen sei.",
              inputLabel: "Ersatz für den Relativanschluss",
              expectedAnswers: ["das fachlich unpräzise gewesen sei"],
              acceptedAnswers: [
                "das fachlich unpräzise gewesen sei",
                "wobei das Gutachten fachlich unpräzise gewesen sei"
              ],
              hint: "Frage dich, ob die Unpräzision die Zusammenfassung oder das Gutachten betrifft.",
              solution: "das fachlich unpräzise gewesen sei",
              explanation:
                "Wenn das Gutachten gemeint ist, darf der Relativsatz nicht an 'die Zusammenfassung' angeschlossen werden. Die korrigierte Formulierung richtet den Bezug auf das neutrale 'Gutachten'.",
              visual: visualBezug("das Gutachten", "das", "die Zusammenfassung", "Relativanschluss semantisch präzisieren")
            })
          ]
        },
        {
          id: "kongruenz",
          title: "Satzkongruenz",
          summary: "Kongruenz in besonders heiklen Distanz- und Sammelfällen sichern.",
          tasks: [
            choice({
              id: "nd-ko-1",
              title: "Kernnomen unter Einschüben",
              prompt: "Welche Verbform ist fachlich präzise?",
              context:
                "Nicht die Vielzahl der in den Randbemerkungen aufgeführten Einzelfälle, sondern der Hinweis auf das methodische Grundproblem ___ für die Revision entscheidend gewesen.",
              options: [
                { id: "a", label: "ist" },
                { id: "b", label: "sind" },
                { id: "c", label: "war" },
                { id: "d", label: "waren" }
              ],
              correctOptionId: "c",
              hint: "Achte auf Tempus und auf das eigentliche Subjekt.",
              solution: "war",
              explanation:
                "Der Satz berichtet rückblickend und verlangt deshalb Präteritum. Subjekt des Prädikats ist 'der Hinweis', also Singular: 'war'.",
              visual: visualKongruenz("der Hinweis", "war", "waren", "Kernsubjekt trotz langer Distanz erkennen")
            }),
            text({
              id: "nd-ko-2",
              title: "Weder-noch mit verdecktem Numerus",
              prompt: "Setze die korrekte Verbform ein.",
              context:
                "Weder die in den Anhängen dokumentierte Vorstudie noch das anschliessend formulierte Resümee ___ für die Schlussfolgerung tragfähig gewesen.",
              expectedAnswers: ["ist"],
              hint: "Prüfe, welches Element dem Verb am nächsten steht und zugleich der Satzlogik entspricht.",
              solution: "ist",
              explanation:
                "Das nähere Subjekt 'das ... Resümee' steht im Singular. In dieser Konstruktion ist daher 'ist' die fachlich stimmige Form.",
              visual: visualKongruenz("das Resümee", "ist", "sind", "nahes Singularsubjekt bei 'weder ... noch'")
            }),
            drag({
              id: "nd-ko-3",
              title: "Kollektiv und Nachtrag fachlich trennen",
              prompt: "Ordne die beiden passenden Verbformen zu.",
              context:
                "Eine Fülle von Rückmeldungen ___ eingegangen; der Nachtrag mit den zentralen Korrekturen ___ jedoch erst am Folgetag versandt worden.",
              slots: [
                { id: "first", label: "Verb zur Fülle" },
                { id: "second", label: "Verb zum Nachtrag" }
              ],
              options: [
                { id: "o1", label: "ist", detail: "Singular" },
                { id: "o2", label: "sind", detail: "Plural" },
                { id: "o3", label: "ist", detail: "zweite Singularform" },
                { id: "o4", label: "sind", detail: "zweite Pluralform" }
              ],
              correctMap: { first: "o1", second: "o3" },
              hint: "Kollektiva wirken pluralisch, bleiben hier aber singularisch.",
              solution:
                "Eine Fülle von Rückmeldungen ist eingegangen; der Nachtrag mit den zentralen Korrekturen ist jedoch erst am Folgetag versandt worden.",
              explanation:
                "Sowohl 'eine Fülle' als auch 'der Nachtrag' sind Singularsubjekte. Gerade die pluralischen Ergänzungen dürfen die Kongruenz nicht übersteuern.",
              visual: visualKongruenz("eine Fülle / der Nachtrag", "ist / ist", "sind / sind", "Kollektivsubjekt bleibt singularisch")
            })
          ]
        },
        {
          id: "verbformen",
          title: "Verbformen",
          summary: "Feine Unterschiede in Modus und Zeitlogik begründen.",
          tasks: [
            choice({
              id: "nd-vf-1",
              title: "Irreale Rückschau mit Passiv",
              prompt: "Welche Form passt fachlich genau?",
              context:
                "Wäre die Passage vor dem Druck noch einmal gegengelesen worden, ___ der Einwand vermutlich gar nicht entstanden.",
              options: [
                { id: "a", label: "wäre" },
                { id: "b", label: "ist" },
                { id: "c", label: "sei" },
                { id: "d", label: "war" }
              ],
              correctOptionId: "a",
              hint: "Die Bedingung ist irreal und rückblickend.",
              solution: "wäre",
              explanation:
                "Der Bedingungssatz steht im irrealen Rückblick. Der Folgesatz verlangt deshalb ebenfalls den Konjunktiv II Vergangenheit: 'wäre ... entstanden'.",
              visual: visualVerb("irreale Rückschau", "wäre", "ist", "Zeitlogik und Modus koppeln")
            }),
            text({
              id: "nd-vf-2",
              title: "Indirekte Wiedergabe mit Distanz",
              prompt: "Setze die passende Verbform ein.",
              context:
                "Die Fachleitung hielt fest, die Passage ___ in ihrer jetzigen Form weder terminologisch präzise noch argumentativ tragfähig.",
              expectedAnswers: ["sei"],
              hint: "Prüfe den Modus der indirekten Wiedergabe.",
              solution: "sei",
              explanation:
                "Die Aussage wird berichtend wiedergegeben. In dieser distanzierten Wiedergabe ist der Konjunktiv I 'sei' die präzise Form.",
              visual: visualVerb("indirekte Wiedergabe", "sei", "ist", "Konjunktiv I als Distanzsignal")
            }),
            drag({
              id: "nd-vf-3",
              title: "Mehrstufige Zeitlogik",
              prompt: "Ziehe die passenden Formen in den Satz.",
              context:
                "Nachdem die Redaktion den Nachtrag noch einmal ___, ___ sie die frühere Formulierung kaum aufrechterhalten können.",
              slots: [
                { id: "first", label: "Form im Nebensatz" },
                { id: "second", label: "Form im Hauptsatz" }
              ],
              options: [
                { id: "o1", label: "überprüft hatte", detail: "Vorzeitigkeit" },
                { id: "o2", label: "überprüft hat", detail: "zu wenig Vorzeitigkeit" },
                { id: "o3", label: "hätte", detail: "irreale Folgerung" },
                { id: "o4", label: "hatte", detail: "falscher Modus" }
              ],
              correctMap: { first: "o1", second: "o3" },
              hint: "Trenne tatsächliche Vorzeitigkeit und gedachte Folgerung.",
              solution:
                "Nachdem die Redaktion den Nachtrag noch einmal überprüft hatte, hätte sie die frühere Formulierung kaum aufrechterhalten können.",
              explanation:
                "Die Prüfung liegt zeitlich vor der gedachten Konsequenz. Darum braucht der Nebensatz Plusquamperfekt und der Hauptsatz Konjunktiv II Vergangenheit.",
              visual: visualVerb("Vorzeitigkeit + Irrealität", "überprüft hatte / hätte", "überprüft hat / hatte", "Zeitstufe und Modus gemeinsam prüfen")
            })
          ]
        },
        {
          id: "rektionen",
          title: "Rektionen",
          summary: "Heikle Präpositions- und Kasusbindungen fachlich sauber anwenden.",
          tasks: [
            choice({
              id: "nd-re-1",
              title: "Verpflichtung zu",
              prompt: "Welche Präposition passt?",
              context: "Die Passage begründet keine Verpflichtung ___ einer bestimmten Lesart.",
              options: [
                { id: "a", label: "zu" },
                { id: "b", label: "für" },
                { id: "c", label: "an" },
                { id: "d", label: "auf" }
              ],
              correctOptionId: "a",
              hint: "Achte auf die feste Nominalrektion.",
              solution: "zu",
              explanation:
                "Das Nomen 'Verpflichtung' wird hier mit 'zu' angeschlossen: 'Verpflichtung zu einer Lesart'.",
              visual: visualRektion("Verpflichtung", "zu einer Lesart", "für einer Lesart", "Nominalrektion präzise setzen")
            }),
            text({
              id: "nd-re-2",
              title: "Bedarf an",
              prompt: "Setze die passende Präposition ein.",
              context: "Der Kommentar lässt einen erheblichen Bedarf ___ begrifflicher Klärung erkennen.",
              expectedAnswers: ["an"],
              hint: "Prüfe die feste Verbindung des Nomens.",
              solution: "an",
              explanation:
                "'Bedarf' verbindet sich mit 'an'. Deshalb lautet die Form 'Bedarf an begrifflicher Klärung'.",
              visual: visualRektion("Bedarf", "an begrifflicher Klärung", "für begriffliche Klärung", "Nomen und Präposition korrekt koppeln")
            }),
            drag({
              id: "nd-re-3",
              title: "Appell und Einspruch unterscheiden",
              prompt: "Ordne die beiden Präpositionen den passenden Konstruktionen zu.",
              context:
                "Die Stellungnahme enthält einen Appell ___ grössere begriffliche Sorgfalt, zugleich aber auch einen deutlichen Einspruch ___ die bisherige Einordnung.",
              slots: [
                { id: "first", label: "Rektion von 'Appell'" },
                { id: "second", label: "Rektion von 'Einspruch'" }
              ],
              options: [
                { id: "o1", label: "an", detail: "passt zu 'Appell'" },
                { id: "o2", label: "gegen", detail: "passt zu 'Einspruch'" },
                { id: "o3", label: "für", detail: "Distraktor" },
                { id: "o4", label: "zu", detail: "Distraktor" }
              ],
              correctMap: { first: "o1", second: "o2" },
              hint: "Prüfe beide Nomen unabhängig voneinander.",
              solution:
                "Die Stellungnahme enthält einen Appell an grössere begriffliche Sorgfalt, zugleich aber auch einen deutlichen Einspruch gegen die bisherige Einordnung.",
              explanation:
                "'Appell an' und 'Einspruch gegen' sind feste nominale Rektionen. Gerade bei abstrakten Nomen lohnt sich genaues Prüfen.",
              visual: visualRektion("Appell / Einspruch", "an / gegen", "für / zu", "feine Nominalrektionen sichern")
            })
          ]
        },
        {
          id: "diagnose",
          title: "Diagnose",
          summary: "Grenzfälle fachlich einordnen und begründet korrigieren.",
          tasks: [
            diagnosis({
              id: "nd-di-1",
              title: "Ergebnis oder Arbeitsgruppe?",
              prompt: "Bestimme die Fehlerart und die präziseste Korrektur.",
              context:
                "Die Arbeitsgruppe erläuterte das Ergebnis der Vorprüfung, das im Kommentarstrang widersprüchlich erschienen seien.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c3",
              correctionOptions: [
                {
                  id: "k1",
                  label: "Die Arbeitsgruppe erläuterte das Ergebnis der Vorprüfung, das im Kommentarstrang widersprüchlich erschienen sei."
                },
                {
                  id: "k2",
                  label: "Die Arbeitsgruppe erläuterte das Ergebnis der Vorprüfung, die im Kommentarstrang widersprüchlich erschienen sei."
                },
                {
                  id: "k3",
                  label: "Die Arbeitsgruppe erläuterte das Ergebnis der Vorprüfung, das im Kommentarstrang widersprüchlich erschienenen sei."
                },
                {
                  id: "k4",
                  label: "Die Arbeitsgruppe erläuterte das Ergebnis der Vorprüfung, das im Kommentarstrang widersprüchlich erschienen sind."
                }
              ],
              correctCorrectionId: "k1",
              hint: "Prüfe den Modus der berichteten Einschätzung.",
              solution:
                "Fehlerart: Verbform. Korrektur: Die Arbeitsgruppe erläuterte das Ergebnis der Vorprüfung, das im Kommentarstrang widersprüchlich erschienen sei.",
              explanation:
                "Der Satz verlangt in der indirekten Wiedergabe die Form 'sei'. Die anderen Varianten verletzen entweder den Modus oder die Flexion des Partizips.",
              visual: visualVerb("indirekte Einschätzung", "sei", "seien", "Modus statt bloßer Lautähnlichkeit prüfen")
            }),
            diagnosis({
              id: "nd-di-2",
              title: "Zusammenfassung oder Bericht?",
              prompt: "Ordne die Fehlerart zu und wähle die fachlich beste Korrektur.",
              context:
                "Die Lektorin überarbeitete die Zusammenfassung des Berichts, der an mehreren Stellen missverständlich formuliert war.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c1",
              correctionOptions: [
                {
                  id: "k1",
                  label: "Die Lektorin überarbeitete die Zusammenfassung des Berichts, die an mehreren Stellen missverständlich formuliert war."
                },
                {
                  id: "k2",
                  label: "Die Lektorin überarbeitete die Zusammenfassung des Berichts, welcher an mehreren Stellen missverständlich formuliert war."
                },
                {
                  id: "k3",
                  label: "Die Lektorin überarbeitete die Zusammenfassung, der Bericht war an mehreren Stellen missverständlich formuliert."
                },
                {
                  id: "k4",
                  label: "Die Lektorin überarbeitete die Zusammenfassung des Berichts, das an mehreren Stellen missverständlich formuliert war."
                }
              ],
              correctCorrectionId: "k1",
              hint: "Frage dich, welches Element missverständlich formuliert war.",
              solution:
                "Fehlerart: Satzbezug. Korrektur: Die Lektorin überarbeitete die Zusammenfassung des Berichts, die an mehreren Stellen missverständlich formuliert war.",
              explanation:
                "Missverständlich formuliert war die Zusammenfassung, nicht der Bericht als Bezugswort des Relativsatzes. Darum muss der Anschluss an 'die Zusammenfassung' erfolgen.",
              visual: visualBezug("die Zusammenfassung", "die", "der Bericht", "Relativsatz am fachlich gemeinten Ausdruck befestigen")
            }),
            diagnosis({
              id: "nd-di-3",
              title: "Feine Rektion im Kommentar",
              prompt: "Bestimme die Fehlerart und die passende Korrektur.",
              context:
                "Der Kommentar enthält keinen Hinweis für eine absichtliche Verschleierung, spricht aber deutlich gegen eine ungenaue Redaktion.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c4",
              correctionOptions: [
                {
                  id: "k1",
                  label: "Der Kommentar enthält keinen Hinweis auf eine absichtliche Verschleierung, spricht aber deutlich gegen eine ungenaue Redaktion."
                },
                {
                  id: "k2",
                  label: "Der Kommentar enthält keinen Hinweis an eine absichtliche Verschleierung, spricht aber deutlich gegen eine ungenaue Redaktion."
                },
                {
                  id: "k3",
                  label: "Der Kommentar enthält keinen Hinweis für eine absichtliche Verschleierung, spricht aber deutlich auf eine ungenaue Redaktion."
                },
                {
                  id: "k4",
                  label: "Der Kommentar enthält keinen Hinweis zu eine absichtliche Verschleierung, spricht aber deutlich gegen eine ungenaue Redaktion."
                }
              ],
              correctCorrectionId: "k1",
              hint: "Suche die präzise Präposition des Nomens 'Hinweis'.",
              solution:
                "Fehlerart: Rektion. Korrektur: Der Kommentar enthält keinen Hinweis auf eine absichtliche Verschleierung, spricht aber deutlich gegen eine ungenaue Redaktion.",
              explanation:
                "Die feste Verbindung lautet 'Hinweis auf etwas'. Gerade bei nominalen Rektionen wirken falsche Präpositionen oft fast plausibel.",
              visual: visualRektion("Hinweis", "auf eine Verschleierung", "für eine Verschleierung", "Nominalrektion auch im Grenzfall sichern")
            })
          ]
        }
      ]
    },
    {
      id: "adlerauge",
      rank: "08",
      title: "Adlerauge",
      subtitle: "Subtilste Fehler bis ins Detail erkennen",
      description:
        "Das höchste Level bündelt Grenzfälle, nahezu plausible Fehlformen und besonders heikle Anschluss-, Kongruenz- und Rektionentscheidungen.",
      modules: [
        {
          id: "satzbezug",
          title: "Satzbezüge",
          summary: "Minimal unterschiedliche Lesarten sicher voneinander trennen.",
          tasks: [
            choice({
              id: "ad-sb-1",
              title: "Stellungnahme oder Einordnung?",
              prompt: "Welche Fassung macht fachlich präzise klar, dass die Einordnung überarbeitet wurde?",
              context:
                "Die Stellungnahme zum Gutachten der Kommission wurde erst zitiert, nachdem diese überarbeitet worden war.",
              options: [
                {
                  id: "a",
                  label: "Die Stellungnahme zum Gutachten der Kommission wurde erst zitiert, nachdem die Einordnung überarbeitet worden war."
                },
                {
                  id: "b",
                  label: "Die Stellungnahme zum Gutachten der Kommission wurde erst zitiert, nachdem diese Kommission überarbeitet worden war."
                },
                {
                  id: "c",
                  label: "Die Stellungnahme zum Gutachten der Kommission wurde erst zitiert, nachdem jene überarbeitet worden war."
                },
                {
                  id: "d",
                  label: "Die Stellungnahme zum Gutachten der Kommission wurde erst zitiert, nachdem sie überarbeitet worden war."
                }
              ],
              correctOptionId: "a",
              hint: "Prüfe, welches Element semantisch überhaupt überarbeitet werden kann.",
              solution:
                "Die Stellungnahme zum Gutachten der Kommission wurde erst zitiert, nachdem die Einordnung überarbeitet worden war.",
              explanation:
                "Das Pronomen 'diese' eröffnet mehrere formal mögliche Bezüge. Fachlich sauber ist nur eine Fassung, die den überarbeiteten Gegenstand ausdrücklich nennt.",
              visual: visualBezug("die Einordnung", "diese", "die Kommission", "semantisch möglichen Bezug ausdrücklich nennen")
            }),
            drag({
              id: "ad-sb-2",
              title: "Logik gegen Nähe",
              prompt: "Ordne den gemeinten und den formal näheren, aber falschen Bezug zu.",
              context:
                "Dass die Leiterin der Prüfungsstelle der Referentin schrieb, nachdem sie die Passage noch einmal gegeneinander abgewogen hatte, blieb selbst im Nachtrag unklar.",
              slots: [
                { id: "meant", label: "Gemeint mit 'sie'" },
                { id: "tempting", label: "Formal näher, aber falsch" }
              ],
              options: [
                { id: "o1", label: "die Leiterin der Prüfungsstelle", detail: "gemeinte Person" },
                { id: "o2", label: "die Referentin", detail: "naheliegender Fehlbezug" },
                { id: "o3", label: "die Passage", detail: "Sachwort" },
                { id: "o4", label: "der Nachtrag", detail: "Distraktor" }
              ],
              correctMap: { meant: "o1", tempting: "o2" },
              hint: "Trenne grammatische Nähe und verantwortete Handlung.",
              solution: "Gemeint ist die Leiterin der Prüfungsstelle; die Referentin bleibt der formale Fehlbezug.",
              explanation:
                "Gerade auf diesem Niveau entstehen Fehler nicht aus grober Unkenntnis, sondern aus einem zu schnellen Anschluss an das nähere Wort.",
              visual: visualBezug("die Leiterin der Prüfungsstelle", "sie", "die Referentin", "logischen Bezug gegen formale Nähe verteidigen")
            }),
            text({
              id: "ad-sb-3",
              title: "Relativsatz im Grenzfall",
              prompt: "Ersetze nur den problematischen Relativanschluss so, dass sich der Satz eindeutig auf das Resümee bezieht.",
              context: "Die Redaktion verwarf die Schlussbemerkung zum Resümee, die erneut präzisiert werden müsse.",
              inputLabel: "Korrigierter Anschluss",
              expectedAnswers: ["das erneut präzisiert werden müsse"],
              acceptedAnswers: [
                "das erneut präzisiert werden müsse",
                "wobei das Resümee erneut präzisiert werden müsse"
              ],
              hint: "Frage dich, welcher Ausdruck tatsächlich präzisiert werden soll.",
              solution: "das erneut präzisiert werden müsse",
              explanation:
                "Wenn das Resümee gemeint ist, darf der Relativsatz nicht an 'die Schlussbemerkung' angeschlossen werden. Die neutrale Form richtet den Bezug auf das Resümee.",
              visual: visualBezug("das Resümee", "das", "die Schlussbemerkung", "Relativanschluss semantisch justieren")
            })
          ]
        },
        {
          id: "kongruenz",
          title: "Satzkongruenz",
          summary: "Kongruenz auch in stark verschachtelten Kontrast- und Sammelformen sichern.",
          tasks: [
            choice({
              id: "ad-ko-1",
              title: "Nachtrag statt Materialien",
              prompt: "Welche Verbform ist hier fachlich präzise?",
              context:
                "Nicht die in den Anlagen mehrfach erwähnten Materialien, sondern der Nachtrag zum methodischen Einwand ___ schliesslich ausschlaggebend gewesen.",
              options: [
                { id: "a", label: "ist" },
                { id: "b", label: "sind" },
                { id: "c", label: "war" },
                { id: "d", label: "waren" }
              ],
              correctOptionId: "c",
              hint: "Achte zugleich auf Tempus und auf das ersetzende Subjekt.",
              solution: "war",
              explanation:
                "Entscheidend ist das Singularsubjekt 'der Nachtrag'. Da rückblickend berichtet wird, ist zudem das Präteritum 'war' angemessen.",
              visual: visualKongruenz("der Nachtrag", "war", "waren", "Kontrastsubjekt und Tempus gemeinsam prüfen")
            }),
            text({
              id: "ad-ko-2",
              title: "Weder-noch mit Distanz",
              prompt: "Setze die korrekte Verbform ein.",
              context:
                "Weder die in Fussnoten ausgelagerte Begründung noch das später eingefügte Gegenargument ___ im Wortlaut stimmig gewesen.",
              expectedAnswers: ["ist"],
              hint: "Prüfe das nähere Subjekt unmittelbar vor dem Verb.",
              solution: "ist",
              explanation:
                "Das nähere Subjekt 'das ... Gegenargument' steht im Singular. Deshalb lautet die Verbform hier 'ist'.",
              visual: visualKongruenz("das Gegenargument", "ist", "sind", "nahes Singularsubjekt trotz langer Distanz")
            }),
            drag({
              id: "ad-ko-3",
              title: "Kollektiv, Zusatz und Einzelhinweis",
              prompt: "Ordne die beiden passenden Verbformen zu.",
              context:
                "Eine Vielzahl von Einwänden aus den Randspalten ___ im Kommentar berücksichtigt; der entscheidende Verweis auf die Begriffsgrenze ___ jedoch unerwähnt geblieben.",
              slots: [
                { id: "first", label: "Verb zur Vielzahl" },
                { id: "second", label: "Verb zum Verweis" }
              ],
              options: [
                { id: "o1", label: "ist", detail: "Singular" },
                { id: "o2", label: "sind", detail: "Plural" },
                { id: "o3", label: "ist", detail: "zweite Singularform" },
                { id: "o4", label: "waren", detail: "Distraktor" }
              ],
              correctMap: { first: "o1", second: "o3" },
              hint: "Lass dich nicht von pluralischen Ergänzungen täuschen.",
              solution:
                "Eine Vielzahl von Einwänden aus den Randspalten ist im Kommentar berücksichtigt; der entscheidende Verweis auf die Begriffsgrenze ist jedoch unerwähnt geblieben.",
              explanation:
                "Sowohl 'eine Vielzahl' als auch 'der Verweis' sind Singularsubjekte. Pluralische Zusätze dürfen die Kongruenz nicht überlagern.",
              visual: visualKongruenz("eine Vielzahl / der Verweis", "ist / ist", "sind / waren", "Sammelbegriff und Kernsubjekt trennen")
            })
          ]
        },
        {
          id: "verbformen",
          title: "Verbformen",
          summary: "Irreale, berichtete und zeitlich gestufte Formen ohne Hilfssignale prüfen.",
          tasks: [
            choice({
              id: "ad-vf-1",
              title: "Irreale Folgerung",
              prompt: "Welche Form passt in den Satz?",
              context:
                "Wären die Anmerkungen vor der Endredaktion ernst genommen worden, ___ der spätere Einwand wohl entfallen.",
              options: [
                { id: "a", label: "wäre" },
                { id: "b", label: "sei" },
                { id: "c", label: "ist" },
                { id: "d", label: "war" }
              ],
              correctOptionId: "a",
              hint: "Prüfe den Modus der gedachten Folge.",
              solution: "wäre",
              explanation:
                "Der Bedingungssatz ist irreal. Die Folge wird darum mit dem Konjunktiv II Vergangenheit 'wäre ... entfallen' ausgedrückt.",
              visual: visualVerb("irreale Folge", "wäre", "ist", "Konjunktiv II konsequent halten")
            }),
            text({
              id: "ad-vf-2",
              title: "Berichtete Bewertung",
              prompt: "Setze die passende Form ein.",
              context:
                "Die Fachkommission hielt fest, der abschliessende Vergleich ___ in dieser Form sachlich nicht tragfähig.",
              expectedAnswers: ["sei"],
              hint: "Achte auf die Distanz in der berichteten Bewertung.",
              solution: "sei",
              explanation:
                "Die Beurteilung wird nicht direkt behauptet, sondern referiert. Darum ist der Konjunktiv I 'sei' die präzise Form.",
              visual: visualVerb("berichtete Bewertung", "sei", "ist", "Konjunktiv I als Distanzsignal")
            }),
            drag({
              id: "ad-vf-3",
              title: "Vorzeitigkeit und irreale Konsequenz",
              prompt: "Ziehe die passenden Formen in die beiden Lücken.",
              context:
                "Nachdem die Redaktion den Einwand noch einmal ___, ___ sie die ältere Fassung kaum beibehalten können.",
              slots: [
                { id: "first", label: "Form im Nebensatz" },
                { id: "second", label: "Form im Hauptsatz" }
              ],
              options: [
                { id: "o1", label: "geprüft hatte", detail: "Vorzeitigkeit" },
                { id: "o2", label: "geprüft hat", detail: "zu wenig Vorzeitigkeit" },
                { id: "o3", label: "hätte", detail: "irreale Konsequenz" },
                { id: "o4", label: "hatte", detail: "falscher Modus" }
              ],
              correctMap: { first: "o1", second: "o3" },
              hint: "Trenne tatsächliche Vorzeitigkeit und gedachte Folge.",
              solution:
                "Nachdem die Redaktion den Einwand noch einmal geprüft hatte, hätte sie die ältere Fassung kaum beibehalten können.",
              explanation:
                "Die Prüfung liegt zeitlich vor der Bewertung der hypothetischen Folge. Deshalb stehen Plusquamperfekt und Konjunktiv II Vergangenheit nebeneinander.",
              visual: visualVerb("Vorzeitigkeit + Irrealität", "geprüft hatte / hätte", "geprüft hat / hatte", "Zeit- und Moduslogik zusammen prüfen")
            })
          ]
        },
        {
          id: "rektionen",
          title: "Rektionen",
          summary: "Besonders heikle Rektionen mit beinahe plausiblen Alternativen entscheiden.",
          tasks: [
            choice({
              id: "ad-re-1",
              title: "Anlass zu",
              prompt: "Welche Präposition passt?",
              context: "Die Formulierung gab Anlass ___ einer erneuten Präzisierung.",
              options: [
                { id: "a", label: "zu" },
                { id: "b", label: "für" },
                { id: "c", label: "auf" },
                { id: "d", label: "an" }
              ],
              correctOptionId: "a",
              hint: "Suche die feste Verbindung des Nomens.",
              solution: "zu",
              explanation:
                "Die feste Verbindung lautet 'Anlass zu etwas geben'. Gerade 'für' wirkt plausibel, ist hier aber nicht idiomatisch.",
              visual: visualRektion("Anlass", "zu einer Präzisierung", "für einer Präzisierung", "Nominalrektion fein unterscheiden")
            }),
            text({
              id: "ad-re-2",
              title: "Abgrenzung von",
              prompt: "Setze die passende Präposition ein.",
              context: "Der Kommentar lebt von einer klaren Abgrenzung ___ bloss assoziativen Lesarten.",
              expectedAnswers: ["von"],
              hint: "Prüfe die typische Präposition des Nomens 'Abgrenzung'.",
              solution: "von",
              explanation:
                "'Abgrenzung von etwas' ist die geläufige nominale Rektion. Sie markiert, wovon sich der Begriff trennt.",
              visual: visualRektion("Abgrenzung", "von Lesarten", "gegen Lesarten", "Nomenrektion nicht verwechseln")
            }),
            drag({
              id: "ad-re-3",
              title: "Appell und Verweis im Grenzfall",
              prompt: "Ordne die beiden passenden Präpositionen den Konstruktionen zu.",
              context:
                "Die Stellungnahme enthält einen Appell ___ grössere Präzision und einen deutlichen Verweis ___ die Grenzen der bisherigen Deutung.",
              slots: [
                { id: "first", label: "Rektion von 'Appell'" },
                { id: "second", label: "Rektion von 'Verweis'" }
              ],
              options: [
                { id: "o1", label: "an", detail: "passt zu 'Appell'" },
                { id: "o2", label: "auf", detail: "passt zu 'Verweis'" },
                { id: "o3", label: "für", detail: "Distraktor" },
                { id: "o4", label: "gegen", detail: "Distraktor" }
              ],
              correctMap: { first: "o1", second: "o2" },
              hint: "Prüfe beide nominalen Anschlüsse getrennt.",
              solution:
                "Die Stellungnahme enthält einen Appell an grössere Präzision und einen deutlichen Verweis auf die Grenzen der bisherigen Deutung.",
              explanation:
                "'Appell an' und 'Verweis auf' sind nahe beieinander, aber nicht austauschbar. Hier entscheidet die feste Nominalrektion.",
              visual: visualRektion("Appell / Verweis", "an / auf", "für / gegen", "nominale Rektionen präzise sortieren")
            })
          ]
        },
        {
          id: "diagnose",
          title: "Diagnose",
          summary: "Fast korrekte Sätze fachlich exakt einordnen und korrigieren.",
          tasks: [
            diagnosis({
              id: "ad-di-1",
              title: "Berichtete Bewertung oder Indikativ?",
              prompt: "Bestimme die Fehlerart und wähle die fachlich präziseste Korrektur.",
              context:
                "Die Fachgruppe hielt fest, der letzte Abschnitt ist in seiner jetzigen Form weder logisch sauber noch begrifflich präzise.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c3",
              correctionOptions: [
                {
                  id: "k1",
                  label: "Die Fachgruppe hielt fest, der letzte Abschnitt sei in seiner jetzigen Form weder logisch sauber noch begrifflich präzise."
                },
                {
                  id: "k2",
                  label: "Die Fachgruppe hielt fest, der letzte Abschnitt wäre in seiner jetzigen Form weder logisch sauber noch begrifflich präzise."
                },
                {
                  id: "k3",
                  label: "Die Fachgruppe hielt fest, der letzte Abschnitt seien in seiner jetzigen Form weder logisch sauber noch begrifflich präzise."
                },
                {
                  id: "k4",
                  label: "Die Fachgruppe hielt fest, dass der letzte Abschnitt sei in seiner jetzigen Form weder logisch sauber noch begrifflich präzise."
                }
              ],
              correctCorrectionId: "k1",
              hint: "Prüfe den Modus der berichteten Aussage.",
              solution:
                "Fehlerart: Verbform. Korrektur: Die Fachgruppe hielt fest, der letzte Abschnitt sei in seiner jetzigen Form weder logisch sauber noch begrifflich präzise.",
              explanation:
                "Die Aussage wird als Feststellung der Fachgruppe wiedergegeben. Dafür ist der Konjunktiv I 'sei' die präziseste Form.",
              visual: visualVerb("berichtete Aussage", "sei", "ist", "Indikativ nicht ungeprüft übernehmen")
            }),
            diagnosis({
              id: "ad-di-2",
              title: "Zusatz oder Kernsubjekt?",
              prompt: "Ordne die Fehlerart zu und wähle die richtige Korrektur.",
              context:
                "Die Summe der in den Kommentaren aufgeworfenen Fragen sprechen gegen eine vorschnelle Entscheidung.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c2",
              correctionOptions: [
                {
                  id: "k1",
                  label: "Die Summe der in den Kommentaren aufgeworfenen Fragen spricht gegen eine vorschnelle Entscheidung."
                },
                {
                  id: "k2",
                  label: "Die Summe der in den Kommentaren aufgeworfenen Fragen sprachen gegen eine vorschnelle Entscheidung."
                },
                {
                  id: "k3",
                  label: "Die Summe der in den Kommentaren aufgeworfenen Fragen spreche gegen eine vorschnelle Entscheidung."
                },
                {
                  id: "k4",
                  label: "Die Summe von den in den Kommentaren aufgeworfenen Fragen spricht gegen eine vorschnelle Entscheidung."
                }
              ],
              correctCorrectionId: "k1",
              hint: "Prüfe, welcher Ausdruck im Subjekt tatsächlich den Kopf bildet.",
              solution:
                "Fehlerart: Kongruenz. Korrektur: Die Summe der in den Kommentaren aufgeworfenen Fragen spricht gegen eine vorschnelle Entscheidung.",
              explanation:
                "Kopf des Subjekts ist 'die Summe', also Singular. Der lange Genitivzusatz darf die Verbform nicht in den Plural ziehen.",
              visual: visualKongruenz("die Summe", "spricht", "sprechen", "Kopf der Nominalgruppe trotz Distanz erkennen")
            }),
            diagnosis({
              id: "ad-di-3",
              title: "Hinweis auf oder für?",
              prompt: "Bestimme die Fehlerart und wähle die fachlich beste Korrektur.",
              context:
                "Der Abschnitt enthält keinen Hinweis für eine absichtliche Verschiebung der Begriffe, lässt aber Raum für Irritationen.",
              categoryOptions: [
                { id: "c1", label: "Satzbezug" },
                { id: "c2", label: "Kongruenz" },
                { id: "c3", label: "Verbform" },
                { id: "c4", label: "Rektion" }
              ],
              correctCategoryId: "c4",
              correctionOptions: [
                {
                  id: "k1",
                  label: "Der Abschnitt enthält keinen Hinweis auf eine absichtliche Verschiebung der Begriffe, lässt aber Raum für Irritationen."
                },
                {
                  id: "k2",
                  label: "Der Abschnitt enthält keinen Hinweis an eine absichtliche Verschiebung der Begriffe, lässt aber Raum für Irritationen."
                },
                {
                  id: "k3",
                  label: "Der Abschnitt enthält keinen Hinweis für eine absichtliche Verschiebung der Begriffe, lässt aber Raum auf Irritationen."
                },
                {
                  id: "k4",
                  label: "Der Abschnitt enthält keinen Hinweis zu eine absichtliche Verschiebung der Begriffe, lässt aber Raum für Irritationen."
                }
              ],
              correctCorrectionId: "k1",
              hint: "Achte auf die präzise Präposition des Nomens 'Hinweis'.",
              solution:
                "Fehlerart: Rektion. Korrektur: Der Abschnitt enthält keinen Hinweis auf eine absichtliche Verschiebung der Begriffe, lässt aber Raum für Irritationen.",
              explanation:
                "Die feste Verbindung lautet 'Hinweis auf etwas'. Genau diese Präposition macht deutlich, worauf der Text hindeutet oder eben nicht hindeutet.",
              visual: visualRektion("Hinweis", "auf eine Verschiebung", "für eine Verschiebung", "nominale Präposition fein entscheiden")
            })
          ]
        }
      ]
    }
  ];

  const taskTypeLabels = {
    choice: "Auswahl",
    text: "Freie Eingabe",
    drag: "Drag-and-Drop",
    diagnosis: "Diagnose"
  };

  const totalTasks = levels.reduce(function (sum, level) {
    return (
      sum +
      level.modules.reduce(function (moduleSum, module) {
        return moduleSum + module.tasks.length;
      }, 0)
    );
  }, 0);

  window.GrammarTrainerData = {
    levels: levels,
    taskTypeLabels: taskTypeLabels,
    totalTasks: totalTasks
  };
})();
