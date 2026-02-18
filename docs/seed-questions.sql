-- ============================================================================
-- IPA Question Tool - Seed Data
-- Generated: 2026-02-18
-- ============================================================================
-- 
-- INSTRUCTIONS:
-- 1. Run Part 1 first to create the new Fachbereich "Allgemein"
-- 2. Note the generated ID for Allgemein, then replace ALLGEMEIN_ID below
-- 3. Run Part 2 to create all new Themenkomplexe
-- 4. Note the generated IDs, then replace all TOPIC_ID placeholders
-- 5. Run Parts 3a-3j and Part 4 to insert questions
--
-- PLACEHOLDER IDs to replace after inserts:
--   ALLGEMEIN_ID           -> ID of new "Allgemein" Fachbereich
--   OOP_TOPIC_ID           -> ID of "C# OOP" Themenkomplex
--   FEHLER_TOPIC_ID        -> ID of "C# Fehlerbehandlung" Themenkomplex
--   LINQ_TOPIC_ID          -> ID of "C# LINQ & Collections" Themenkomplex
--   ASYNC_TOPIC_ID         -> ID of "C# Async/Await" Themenkomplex
--   API_TOPIC_ID           -> ID of "API/REST" Themenkomplex
--   GIT_TOPIC_ID           -> ID of "Git / Versionskontrolle" Themenkomplex
--   SECURITY_TOPIC_ID      -> ID of "Security" Themenkomplex
--   DEPLOY_TOPIC_ID        -> ID of "Deployment / CI-CD" Themenkomplex
--   DBDESIGN_TOPIC_ID      -> ID of "Datenbankdesign & Normalisierung" Themenkomplex
--   UNITTEST_TOPIC_ID      -> ID of "Unit Testing" Themenkomplex
-- ============================================================================

-- ============================================================================
-- PART 1: New Fachbereich "Allgemein"
-- ============================================================================

INSERT INTO subject_area (name, description, slug, created_by) VALUES
('Allgemein', 'Uebergreifende IT-Themen wie Git, Security und Deployment', 'allgemein', 'bb47e3bb-600c-4218-a842-d16978894d80');

-- NOTE: After running the above, query the ID: 12
-- SELECT id FROM subject_area WHERE slug = 'allgemein';
-- Replace ALLGEMEIN_ID in Part 2 with the result.


-- ============================================================================
-- PART 2: New Themenkomplexe
-- ============================================================================
-- NOTE: Replace ALLGEMEIN_ID with the actual ID from Part 1 before running.

INSERT INTO topic_complex (name, description, slug, parent_subject, created_by) VALUES
-- C# topics (parent_subject = 1 = C#)
('C# OOP', 'Objektorientierte Programmierung in C#: Klassen, Vererbung, Interfaces, Polymorphismus', 'csharp-oop', 1, 'bb47e3bb-600c-4218-a842-d16978894d80'),
('C# Fehlerbehandlung', 'Exception Handling, Try-Catch, Custom Exceptions in C#', 'csharp-fehlerbehandlung', 1, 'bb47e3bb-600c-4218-a842-d16978894d80'),
('C# LINQ & Collections', 'LINQ-Abfragen, generische Collections, Lambda-Ausdruecke', 'csharp-linq', 1, 'bb47e3bb-600c-4218-a842-d16978894d80'),
('C# Async/Await', 'Asynchrone Programmierung, Tasks, async/await Pattern in C#', 'csharp-async', 1, 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Frontend topic (parent_subject = 8 = Frontend)
('API/REST', 'REST-APIs, HTTP-Methoden, Fetch, Axios, API-Design', 'api-rest', 8, 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Allgemein topics (parent_subject = ALLGEMEIN_ID)
('Git / Versionskontrolle', 'Git-Workflows, Branching, Merging, Versionskontrollkonzepte', 'git', 12, 'bb47e3bb-600c-4218-a842-d16978894d80'),
('Security', 'IT-Sicherheit, Authentifizierung, Autorisierung, OWASP, Verschluesselung', 'security', 12, 'bb47e3bb-600c-4218-a842-d16978894d80'),
('Deployment / CI-CD', 'Continuous Integration, Continuous Deployment, Build-Pipelines, Docker', 'deployment-cicd', 12, 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- SQL topic (parent_subject = 7 = SQL)
('Datenbankdesign & Normalisierung', 'ER-Modelle, Normalformen, Beziehungen, Datenbankarchitektur', 'sql-datenbankdesign', 7, 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Testing topic (parent_subject = 11 = Testing)
('Unit Testing', 'Unit Tests, Mocking, Test-Frameworks, Test-Patterns', 'unit-testing', 11, 'bb47e3bb-600c-4218-a842-d16978894d80');

-- NOTE: After running the above, get the IDs:
-- SELECT id, name, slug FROM topic_complex WHERE slug IN ('csharp-oop','csharp-fehlerbehandlung','csharp-linq','csharp-async','api-rest','git','security','deployment-cicd','sql-datenbankdesign','unit-testing');
-- Replace all TOPIC_ID placeholders below with the results.


-- ============================================================================
-- PART 3a: Questions for C# OOP (topic_id = OOP_TOPIC_ID)
-- ============================================================================
-- NOTE: Replace OOP_TOPIC_ID with the actual ID from Part 2.

INSERT INTO question (question, answer, difficulty, topic_id, tags, created_by) VALUES

-- Easy (5)
('Was sind die vier Grundprinzipien der objektorientierten Programmierung?',
 'Die vier Grundprinzipien sind Abstraktion, Kapselung (Encapsulation), Vererbung (Inheritance) und Polymorphismus. Abstraktion vereinfacht komplexe Systeme, Kapselung schuetzt interne Daten, Vererbung ermoeglicht die Wiederverwendung von Code, und Polymorphismus erlaubt es, Objekte verschiedener Klassen ueber eine gemeinsame Schnittstelle zu behandeln.',
 1, 15, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Unterschied zwischen einer Klasse und einem Objekt in C#?',
 'Eine Klasse ist ein Bauplan oder eine Vorlage, die Eigenschaften (Properties) und Verhalten (Methoden) definiert. Ein Objekt ist eine konkrete Instanz einer Klasse, die im Speicher erzeugt wird. Zum Beispiel ist "Auto" eine Klasse, waehrend "meinAuto = new Auto()" ein konkretes Objekt davon ist.',
 1, 15, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist Kapselung (Encapsulation) und wie wird sie in C# umgesetzt?',
 'Kapselung bedeutet, dass interne Daten einer Klasse vor direktem Zugriff von aussen geschuetzt werden. In C# wird dies durch Access Modifier (private, protected, public, internal) und Properties mit get/set-Accessoren umgesetzt. Felder werden typischerweise als private deklariert und ueber oeffentliche Properties zugaenglich gemacht.',
 1, 15, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Unterschied zwischen public, private und protected in C#?',
 'public bedeutet, dass auf das Mitglied von ueberall zugegriffen werden kann. private beschraenkt den Zugriff auf die eigene Klasse. protected erlaubt den Zugriff innerhalb der eigenen Klasse und in abgeleiteten Klassen. Zusaetzlich gibt es internal (Zugriff innerhalb der gleichen Assembly) und protected internal (Kombination).',
 1, 15, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist ein Konstruktor in C# und wofuer wird er verwendet?',
 'Ein Konstruktor ist eine spezielle Methode, die automatisch aufgerufen wird, wenn ein Objekt einer Klasse mit dem new-Keyword erstellt wird. Er dient dazu, das Objekt zu initialisieren, also Anfangswerte fuer Felder und Properties zu setzen. In C# hat der Konstruktor denselben Namen wie die Klasse und keinen Rueckgabetyp.',
 1, 15, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Medium (4)
('Was ist der Unterschied zwischen einem Interface und einer abstrakten Klasse in C#?',
 'Ein Interface definiert nur einen Vertrag (Methodensignaturen) ohne Implementierung (seit C# 8 sind Default-Implementierungen moeglich). Eine abstrakte Klasse kann sowohl abstrakte als auch implementierte Methoden enthalten und Felder/Zustand speichern. Eine Klasse kann mehrere Interfaces implementieren, aber nur von einer abstrakten Klasse erben. Interfaces eignen sich fuer Vertraege ueber Klassengrenzen hinweg, abstrakte Klassen fuer gemeinsame Basis-Funktionalitaet.',
 2, 15, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Erklaeren Sie Polymorphismus anhand eines konkreten Beispiels in C#.',
 'Polymorphismus erlaubt es, verschiedene Objekte ueber eine gemeinsame Schnittstelle zu verwenden. Zum Beispiel kann eine Basisklasse "Form" eine virtuelle Methode "BerechneFlaeche()" haben. Die abgeleiteten Klassen "Kreis" und "Rechteck" ueberschreiben diese mit override. Wenn man eine List<Form> hat, kann man fuer jedes Element BerechneFlaeche() aufrufen, und die jeweilige spezifische Implementierung wird ausgefuehrt.',
 2, 15, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was bedeutet das Keyword "virtual" und "override" in C#?',
 'Das Keyword "virtual" markiert eine Methode in einer Basisklasse als ueberschreibbar. "override" wird in der abgeleiteten Klasse verwendet, um die virtuelle Methode mit einer neuen Implementierung zu ersetzen. Ohne virtual kann eine Methode nicht korrekt polymorph ueberschrieben werden. Das Keyword "new" wuerde die Basismethode nur verdecken (hiding), nicht ueberschreiben.',
 2, 15, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist Dependency Injection und warum ist sie fuer OOP wichtig?',
 'Dependency Injection (DI) ist ein Entwurfsmuster, bei dem Abhaengigkeiten einer Klasse von aussen uebergeben werden, anstatt sie intern zu erzeugen. Dies foerdert lose Kopplung und macht den Code testbar, da Abhaengigkeiten durch Mocks ersetzt werden koennen. In ASP.NET Core ist DI fest integriert und wird ueber den ServiceContainer (IServiceCollection) konfiguriert.',
 2, 15, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Hard (2)
('Was sind die SOLID-Prinzipien und nennen Sie ein Beispiel fuer das Single Responsibility Principle?',
 'SOLID steht fuer: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation und Dependency Inversion. Das Single Responsibility Principle besagt, dass eine Klasse nur einen Grund zur Aenderung haben soll. Beispiel: Eine Klasse "InvoiceCalculator" sollte nur Berechnungen durchfuehren, nicht auch noch die Rechnung drucken oder per E-Mail versenden. Das Drucken und Versenden gehoert in separate Klassen.',
 3, 15, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Erklaeren Sie den Unterschied zwischen Komposition und Vererbung. Wann wuerden Sie welchen Ansatz waehlen?',
 'Vererbung modelliert eine "ist-ein"-Beziehung (ein Hund ist ein Tier), waehrend Komposition eine "hat-ein"-Beziehung modelliert (ein Auto hat einen Motor). Komposition ist oft flexibler, da sie lose Kopplung foerdert und zur Laufzeit austauschbar ist. Die Faustregel lautet "Favor composition over inheritance". Vererbung eignet sich, wenn eine echte Typ-Hierarchie vorliegt und gemeinsames Verhalten geteilt werden soll.',
 3, 15, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Expert (1)
('Wie wuerde man das Strategy Pattern in C# implementieren und in welchem Szenario Ihres IPA-Projekts haette es Anwendung finden koennen?',
 'Das Strategy Pattern definiert eine Familie von Algorithmen, kapselt jeden einzelnen und macht sie austauschbar. In C# erstellt man ein Interface (z.B. ISortStrategy) mit einer Methode, implementiert verschiedene konkrete Strategien (BubbleSort, QuickSort) und uebergibt die gewuenschte Strategie per Dependency Injection an den Context. Es eignet sich ueberall dort, wo unterschiedliche Verhaltensweisen zur Laufzeit gewechselt werden muessen, z.B. verschiedene Export-Formate, Validierungsregeln oder Berechnungslogiken.',
 4, 15, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80');


-- ============================================================================
-- PART 3b: Questions for C# Fehlerbehandlung (topic_id = FEHLER_TOPIC_ID)
-- ============================================================================
-- NOTE: Replace FEHLER_TOPIC_ID with the actual ID from Part 2.

INSERT INTO question (question, answer, difficulty, topic_id, tags, created_by) VALUES

-- Easy (5)
('Was ist eine Exception in C# und wie wird sie behandelt?',
 'Eine Exception ist ein Fehler, der waehrend der Laufzeit eines Programms auftritt. In C# werden Exceptions mit try-catch-Bloecken behandelt. Der Code, der einen Fehler verursachen koennte, steht im try-Block. Tritt ein Fehler auf, wird der passende catch-Block ausgefuehrt. Optional kann ein finally-Block fuer Aufraeum-Code verwendet werden.',
 1, 16, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Wofuer wird der finally-Block in einem try-catch-Statement verwendet?',
 'Der finally-Block wird immer ausgefuehrt, unabhaengig davon, ob eine Exception aufgetreten ist oder nicht. Er wird typischerweise fuer Aufraeum-Arbeiten verwendet, wie das Schliessen von Datenbankverbindungen, Dateien oder Netzwerk-Streams. In modernem C# wird stattdessen oft das using-Statement bevorzugt, das IDisposable-Objekte automatisch freigibt.',
 1, 16, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Unterschied zwischen throw und throw ex in einem catch-Block?',
 'throw (ohne Argument) wirft die aktuelle Exception erneut und behaelt den originalen Stack Trace bei. throw ex wirft die Exception zwar erneut, setzt aber den Stack Trace zurueck, wodurch die Information ueber den urspruenglichen Fehlerort verloren geht. Daher sollte man in den meisten Faellen throw verwenden, um die Fehlerquelle nachverfolgen zu koennen.',
 1, 16, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was passiert, wenn eine Exception nicht mit try-catch abgefangen wird?',
 'Wenn eine Exception nicht abgefangen wird, propagiert sie den Call Stack nach oben, bis sie von einem uebergeordneten catch-Block oder vom Laufzeitsystem (Runtime) abgefangen wird. Falls niemand die Exception faengt, wird das Programm mit einer Fehlermeldung und einem Stack Trace abgebrochen. In Webanwendungen fuehrt dies typischerweise zu einem HTTP 500 Internal Server Error.',
 1, 16, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist ein NullReferenceException und wie kann man ihn vermeiden?',
 'Ein NullReferenceException tritt auf, wenn versucht wird, auf ein Objekt zuzugreifen, das null ist. Man kann ihn vermeiden durch Null-Checks (if (obj != null)), den Null-Conditional-Operator (?.), den Null-Coalescing-Operator (??), oder indem man Nullable Reference Types in C# aktiviert, die bereits zur Compile-Zeit vor moeglichen null-Zugriffen warnen.',
 1, 16, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Medium (3)
('Wie erstellt man eine eigene (Custom) Exception in C# und wann ist das sinnvoll?',
 'Man erstellt eine Custom Exception, indem man eine Klasse von Exception (oder einer spezifischeren Exception-Klasse) ableitet. Man sollte mindestens die drei Standard-Konstruktoren implementieren (parameterlos, mit Message, mit Message und InnerException). Custom Exceptions sind sinnvoll, wenn man fachspezifische Fehler ausdruecken moechte, z.B. InsufficientBalanceException, die von der Geschaeftslogik geworfen wird.',
 2, 16, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist das using-Statement in C# und wie haengt es mit der Fehlerbehandlung zusammen?',
 'Das using-Statement stellt sicher, dass Objekte, die IDisposable implementieren, nach Gebrauch automatisch freigegeben werden (Dispose() wird aufgerufen). Es funktioniert wie ein try-finally-Block und garantiert die Freigabe auch bei Exceptions. Seit C# 8 gibt es auch die using-Deklaration, die das Objekt am Ende des aktuellen Scopes disposed, was den Code kompakter macht.',
 2, 16, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Erklaeren Sie den Unterschied zwischen checked und unchecked Exceptions. Gibt es dieses Konzept in C#?',
 'In Java gibt es checked Exceptions (muessen deklariert/gefangen werden) und unchecked Exceptions (RuntimeExceptions). In C# gibt es dieses Konzept nicht. Alle Exceptions in C# sind unchecked, das heisst der Compiler erzwingt nicht, dass sie gefangen werden. Es liegt in der Verantwortung des Entwicklers, die richtigen Stellen mit try-catch abzusichern. Dies macht den Code schlanker, erfordert aber gute Dokumentation.',
 2, 16, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Hard (3)
('Wie wuerden Sie in einer ASP.NET-Webanwendung eine globale Fehlerbehandlung implementieren?',
 'In ASP.NET Core kann man eine globale Fehlerbehandlung ueber eine Exception-Handling-Middleware implementieren (app.UseExceptionHandler), einen eigenen Middleware-Wrapper schreiben, oder Exception Filter verwenden. Best Practice ist eine Middleware, die alle unbehandelten Exceptions faengt, loggt, und dem Client eine standardisierte Fehlerantwort zurueckgibt (z.B. ein ProblemDetails-Objekt), ohne interne Details preiszugeben.',
 3, 16, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was sind Exception Filters in C# (when-Keyword) und wann setzt man sie ein?',
 'Exception Filters erlauben es, catch-Bloecke mit einer Bedingung zu versehen: catch (HttpRequestException ex) when (ex.StatusCode == 404). Der catch-Block wird nur ausgefuehrt, wenn die Bedingung wahr ist. Der Vorteil gegenueber einem if im catch-Block ist, dass der Stack Trace bei Nicht-Zutreffen erhalten bleibt und die Exception weiterpropagiert. Sie eignen sich z.B. fuer die Unterscheidung verschiedener HTTP-Statuscodes.',
 3, 16, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Welche Best Practices gibt es fuer Exception Handling in einer produktiven C#-Anwendung?',
 'Wichtige Best Practices sind: Nur spezifische Exceptions fangen (nicht einfach catch(Exception)); Exceptions nicht fuer Kontrollfluss verwenden; aussagekraeftige Fehlermeldungen verwenden; Exceptions loggen (z.B. mit Serilog/NLog); InnerException beim Re-Wrapping beibehalten; Fail-Fast-Prinzip anwenden und Fehler frueh erkennen; in Web-APIs standardisierte Fehlerformate (ProblemDetails) zurueckgeben; und zwischen transienten und permanenten Fehlern unterscheiden.',
 3, 16, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Expert (1)
('Wie implementiert man ein Retry-Pattern mit exponential Backoff fuer transiente Fehler in C#? Wo haette das in Ihrem IPA-Projekt Sinn gemacht?',
 'Ein Retry-Pattern wiederholt fehlgeschlagene Operationen mit zunehmenden Wartezeiten. Man kann es manuell mit einer Schleife, Task.Delay und try-catch implementieren, oder die Bibliothek Polly verwenden, die Retry, Circuit Breaker und andere Resilience-Patterns bietet. Beispiel mit Polly: Policy.Handle<HttpRequestException>().WaitAndRetryAsync(3, attempt => TimeSpan.FromSeconds(Math.Pow(2, attempt))). In einem IPA-Projekt ist es sinnvoll bei API-Aufrufen, Datenbankverbindungen oder externen Services.',
 4, 16, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80');


-- ============================================================================
-- PART 3c: Questions for C# LINQ & Collections (topic_id = LINQ_TOPIC_ID)
-- ============================================================================
-- NOTE: Replace LINQ_TOPIC_ID with the actual ID from Part 2.

INSERT INTO question (question, answer, difficulty, topic_id, tags, created_by) VALUES

-- Easy (5)
('Was ist LINQ und wofuer wird es in C# verwendet?',
 'LINQ (Language Integrated Query) ist eine Abfragesprache, die in C# integriert ist und es ermoeglicht, Daten aus verschiedenen Quellen (Collections, Datenbanken, XML) mit einer einheitlichen Syntax abzufragen. LINQ erhoert die Lesbarkeit des Codes und bietet Typsicherheit zur Compile-Zeit. Es gibt LINQ in Methodensyntax (z.B. list.Where(x => x > 5)) und Abfragesyntax (from x in list where x > 5 select x).',
 1, 17, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Unterschied zwischen einer List<T> und einem Array in C#?',
 'Ein Array hat eine feste Groesse, die bei der Erstellung definiert wird und nicht geaendert werden kann. Eine List<T> ist eine dynamische Collection, die automatisch wachsen und schrumpfen kann. List<T> bietet zusaetzliche Methoden wie Add(), Remove() und Insert(). Intern verwendet List<T> ein Array, das bei Bedarf vergroessert wird.',
 1, 17, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist ein Lambda-Ausdruck in C# und wie sieht er syntaktisch aus?',
 'Ein Lambda-Ausdruck ist eine anonyme Funktion, die inline definiert wird. Die Syntax ist: (parameter) => ausdruck. Zum Beispiel filtert list.Where(x => x > 10) alle Elemente groesser als 10. Lambda-Ausdruecke werden haeufig mit LINQ und Delegates verwendet. Bei mehreren Anweisungen nutzt man geschweifte Klammern: (x) => { var result = x * 2; return result; }.',
 1, 17, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Nennen Sie drei haeufig verwendete LINQ-Methoden und erklaeren Sie deren Funktion.',
 'Where() filtert Elemente anhand einer Bedingung (z.B. list.Where(x => x.Age > 18)). Select() projiziert jedes Element in eine neue Form (z.B. list.Select(x => x.Name)). OrderBy() sortiert die Elemente aufsteigend nach einem Kriterium (z.B. list.OrderBy(x => x.LastName)). Weitere wichtige Methoden sind FirstOrDefault(), Any(), Count(), GroupBy() und Aggregate().',
 1, 17, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Unterschied zwischen einem Dictionary<TKey, TValue> und einer List<T>?',
 'Eine List<T> speichert Elemente sequenziell und greift ueber einen numerischen Index zu. Ein Dictionary<TKey, TValue> speichert Schluessel-Wert-Paare und ermoeglicht den Zugriff ueber einen eindeutigen Schluessel. Dictionary bietet O(1)-Zugriff ueber den Schluessel, waehrend das Suchen in einer List O(n) dauert. Dictionaries eignen sich zum Beispiel fuer Caching oder Konfigurationsdaten.',
 1, 17, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Medium (4)
('Was ist der Unterschied zwischen IEnumerable<T> und IQueryable<T> in LINQ?',
 'IEnumerable<T> fuehrt Abfragen im Speicher (client-seitig) aus und eignet sich fuer In-Memory-Collections. IQueryable<T> uebersetzt LINQ-Abfragen in die Sprache der Datenquelle (z.B. SQL) und fuehrt sie auf dem Server aus. Bei Datenbankabfragen sollte man IQueryable verwenden, damit Filter und Sortierungen auf dem Datenbankserver ausgefuehrt werden und nicht alle Daten in den Speicher geladen werden muessen.',
 2, 17, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was bedeutet "Deferred Execution" (verzoegerte Ausfuehrung) bei LINQ und welche Auswirkung hat das?',
 'Deferred Execution bedeutet, dass eine LINQ-Abfrage erst dann ausgefuehrt wird, wenn die Ergebnisse tatsaechlich benoetigt werden (z.B. bei foreach, ToList(), Count()). Die Abfrage wird nur als Ausdruck gespeichert, nicht sofort evaluiert. Das kann zu Problemen fuehren, wenn sich die Datenquelle zwischen Definition und Ausfuehrung aendert. Mit ToList() oder ToArray() kann man die sofortige Ausfuehrung erzwingen.',
 2, 17, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Wie funktioniert GroupBy() in LINQ und geben Sie ein praktisches Beispiel?',
 'GroupBy() gruppiert Elemente einer Sequenz nach einem Schluessel. Das Ergebnis ist eine Sequenz von IGrouping<TKey, TElement>-Objekten, wobei jede Gruppe einen Key und die zugehoerigen Elemente hat. Beispiel: bestellungen.GroupBy(b => b.KundenId) gruppiert alle Bestellungen nach Kunde. Man kann dann z.B. pro Gruppe die Anzahl oder Summe berechnen: .Select(g => new { KundenId = g.Key, Anzahl = g.Count() }).',
 2, 17, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Unterschied zwischen First(), FirstOrDefault(), Single() und SingleOrDefault()?',
 'First() gibt das erste Element zurueck und wirft eine Exception wenn die Sequenz leer ist. FirstOrDefault() gibt default(T) bei leerer Sequenz zurueck. Single() gibt das einzige Element zurueck und wirft eine Exception wenn die Sequenz leer ist oder mehr als ein Element enthaelt. SingleOrDefault() gibt default(T) bei leerer Sequenz, wirft aber eine Exception bei mehreren Elementen. Single eignet sich, wenn genau ein Ergebnis erwartet wird.',
 2, 17, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Hard (2)
('Erklaeren Sie den Unterschied zwischen Select() und SelectMany() in LINQ anhand eines Beispiels.',
 'Select() projiziert jedes Element 1:1 in eine neue Form. SelectMany() projiziert jedes Element in eine Sequenz und "flacht" alle Ergebnissequenzen zu einer einzigen zusammen. Beispiel: Wenn jeder Kunde eine Liste von Bestellungen hat, gibt customers.Select(c => c.Orders) eine Liste von Listen zurueck (IEnumerable<List<Order>>), waehrend customers.SelectMany(c => c.Orders) alle Bestellungen in eine einzige flache Liste zusammenfuehrt (IEnumerable<Order>).',
 3, 17, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was sind Expression Trees in C# und welche Rolle spielen sie bei LINQ to SQL?',
 'Expression Trees sind Datenstrukturen, die Code als Baum darstellen, anstatt ihn direkt auszufuehren. Bei LINQ to SQL (oder Entity Framework) werden Lambda-Ausdruecke in Expression Trees uebersetzt, die dann in SQL-Abfragen konvertiert werden. Das ermoeglicht es, C#-Code auf dem Datenbankserver auszufuehren. Deshalb koennen nicht alle C#-Methoden in LINQ-to-SQL-Abfragen verwendet werden, sondern nur solche, die in SQL uebersetzbar sind.',
 3, 17, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Expert (1)
('Wie wuerden Sie eine performante Suche ueber eine grosse Datenmenge mit LINQ implementieren und welche Fallstricke gibt es bei der Kombination von LINQ und Entity Framework?',
 'Bei grossen Datenmengen ist wichtig: IQueryable statt IEnumerable verwenden, damit Filter auf dem Server ausgefuehrt werden. N+1-Probleme vermeiden durch gezieltes Include() fuer Eager Loading. Nicht benoetigte Spalten mit Select() projizieren statt ganze Entities zu laden. AsNoTracking() fuer Read-Only-Abfragen verwenden. Paginierung mit Skip()/Take() implementieren. Fallstricke: Client-seitige Evaluation bei nicht uebersetzbaren Ausdruecken, unerwartete Mehrfach-Ausfuehrung bei Deferred Execution, und fehlende Indizes auf gefilterten Spalten.',
 4, 17, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80');


-- ============================================================================
-- PART 3d: Questions for C# Async/Await (topic_id = ASYNC_TOPIC_ID)
-- ============================================================================
-- NOTE: Replace ASYNC_TOPIC_ID with the actual ID from Part 2.

INSERT INTO question (question, answer, difficulty, topic_id, tags, created_by) VALUES

-- Easy (4)
('Was bedeutet asynchrone Programmierung und warum ist sie wichtig?',
 'Asynchrone Programmierung erlaubt es, lang laufende Operationen (z.B. Datenbankabfragen, HTTP-Requests, Dateizugriffe) auszufuehren, ohne den aufrufenden Thread zu blockieren. Das ist besonders in Webanwendungen wichtig, da der Server waehrend asynchroner Operationen andere Anfragen bearbeiten kann, was die Skalierbarkeit deutlich verbessert.',
 1, 18, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Unterschied zwischen async/await und synchronem Code in C#?',
 'Bei synchronem Code wartet der Thread blockierend auf das Ergebnis einer Operation. Bei async/await wird der Thread freigegeben, waehrend auf das Ergebnis gewartet wird, und die Methode wird fortgesetzt, sobald das Ergebnis vorliegt. Eine async-Methode gibt ein Task oder Task<T> zurueck. Das await-Keyword pausiert die Methode, ohne den Thread zu blockieren.',
 1, 18, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist ein Task in C# und wie unterscheidet er sich von einem Thread?',
 'Ein Task repraesentiert eine asynchrone Operation und ist eine Abstraktion ueber Threads. Tasks werden vom Thread Pool verwaltet und sind ressourcenschonender als eigene Threads. Ein Thread ist eine Betriebssystem-Ressource, waehrend ein Task vom .NET Runtime verwaltet wird. Tasks koennen mit async/await kombiniert werden und bieten einfachere Fehlerbehandlung und Komposition als direkte Thread-Programmierung.',
 1, 18, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Warum sollte man in einer ASP.NET-Anwendung asynchrone Controller-Methoden verwenden?',
 'Asynchrone Controller-Methoden geben den Thread waehrend I/O-Operationen (Datenbankabfragen, API-Calls) an den Thread Pool zurueck. Dadurch kann der Server mit derselben Anzahl Threads deutlich mehr gleichzeitige Anfragen bearbeiten. Bei synchronen Methoden wuerde jeder wartende Thread blockiert, was bei vielen gleichzeitigen Anfragen schnell zu Thread-Pool-Erschoepfung fuehren kann.',
 1, 18, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Medium (4)
('Was ist der Unterschied zwischen Task.Run() und einer natuerlich asynchronen Methode wie HttpClient.GetAsync()?',
 'Task.Run() fuehrt synchronen Code auf einem Thread-Pool-Thread aus und simuliert damit Asynchronitaet. Natuerlich asynchrone Methoden wie HttpClient.GetAsync() verwenden I/O Completion Ports und blockieren keinen Thread waehrend des Wartens. In Webanwendungen sollte man Task.Run() vermeiden, da es einen Thread aus dem Pool belegt. Task.Run() eignet sich fuer CPU-gebundene Arbeit in Desktop-Anwendungen.',
 2, 18, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was passiert, wenn man in einer async-Methode vergisst, await zu verwenden?',
 'Wenn await fehlt, wird die Methode nicht auf das Ergebnis des Tasks warten. Der Task laeuft im Hintergrund weiter (Fire-and-Forget), Exceptions werden verschluckt, und der restliche Code wird sofort fortgesetzt. Der Compiler gibt eine Warnung aus (CS4014). Das kann zu schwer auffindbaren Fehlern fuehren, da Exceptions nicht propagiert werden und die Ausfuehrungsreihenfolge unkontrolliert ist.',
 2, 18, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist Task.WhenAll() und wann verwendet man es?',
 'Task.WhenAll() nimmt mehrere Tasks entgegen und gibt einen Task zurueck, der abgeschlossen ist, wenn alle uebergebenen Tasks fertig sind. Es wird verwendet, wenn mehrere unabhaengige asynchrone Operationen parallel ausgefuehrt werden sollen. Zum Beispiel: await Task.WhenAll(GetUsersAsync(), GetOrdersAsync(), GetProductsAsync()). Das ist effizienter als drei sequenzielle awaits, da die Operationen gleichzeitig laufen.',
 2, 18, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist ein CancellationToken und wofuer wird es in asynchronem Code verwendet?',
 'Ein CancellationToken ermoeglicht es, asynchrone Operationen abzubrechen. Man erstellt eine CancellationTokenSource, uebergibt deren Token an asynchrone Methoden, und kann dann Cancel() aufrufen. Die asynchrone Methode prueft periodisch token.IsCancellationRequested oder wirft mit token.ThrowIfCancellationRequested() eine OperationCanceledException. Das ist wichtig fuer Timeouts, Benutzer-Abbrueche oder das Herunterfahren einer Anwendung.',
 2, 18, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Hard (2)
('Was ist ein Deadlock im Kontext von async/await und wie kann man ihn vermeiden?',
 'Ein Deadlock kann entstehen, wenn synchroner Code (.Result oder .Wait()) auf einen async Task wartet und der SynchronizationContext den gleichen Thread benoetigt, um die Fortsetzung auszufuehren. Das passiert haeufig in UI-Anwendungen oder altem ASP.NET (nicht Core). Vermeidung: Immer await statt .Result/.Wait() verwenden (async all the way), oder ConfigureAwait(false) verwenden, wenn kein SynchronizationContext benoetigt wird.',
 3, 18, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist ConfigureAwait(false) und wann sollte man es verwenden?',
 'ConfigureAwait(false) teilt dem Runtime mit, dass die Fortsetzung nach einem await nicht auf dem urspruenglichen SynchronizationContext (z.B. UI-Thread) ausgefuehrt werden muss. In Library-Code sollte man es verwenden, um Deadlocks zu vermeiden und die Performance zu verbessern. In ASP.NET Core ist es weniger kritisch, da es keinen SynchronizationContext gibt. In UI-Code sollte man es NICHT verwenden, wenn danach auf UI-Elemente zugegriffen wird.',
 3, 18, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Expert (1)
('Erklaeren Sie das Konzept von ValueTask<T> im Vergleich zu Task<T> und wann wuerde man es einsetzen.',
 'ValueTask<T> ist ein Struct (statt class wie Task<T>) und vermeidet Heap-Allocations, wenn das Ergebnis bereits synchron verfuegbar ist (z.B. bei Caching). Bei einem Cache-Hit wird kein Task-Objekt auf dem Heap alloziert, bei einem Cache-Miss verhaelt es sich wie ein normaler Task. Einsatz bei hochperformanten Szenarien mit haeufigen synchronen Ergebnissen. Einschraenkung: ValueTask darf nur einmal awaited werden und nicht mehrfach gecached oder in WhenAll verwendet werden.',
 4, 18, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80');


-- ============================================================================
-- PART 3e: Questions for API/REST (topic_id = API_TOPIC_ID)
-- ============================================================================
-- NOTE: Replace API_TOPIC_ID with the actual ID from Part 2.

INSERT INTO question (question, answer, difficulty, topic_id, tags, created_by) VALUES

-- Easy (5)
('Was ist eine REST-API und wofuer steht REST?',
 'REST steht fuer Representational State Transfer und ist ein Architekturstil fuer die Kommunikation zwischen Client und Server ueber HTTP. Eine REST-API stellt Ressourcen ueber URLs bereit und verwendet HTTP-Methoden (GET, POST, PUT, DELETE) fuer CRUD-Operationen. Daten werden typischerweise im JSON-Format uebertragen. REST-APIs sind zustandslos, jede Anfrage enthaelt alle noetige Information.',
 1, 19, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Welche HTTP-Methoden gibt es und wofuer werden sie typischerweise verwendet?',
 'GET ruft Ressourcen ab (Read), POST erstellt neue Ressourcen (Create), PUT aktualisiert eine komplette Ressource (Update), PATCH aktualisiert Teile einer Ressource, und DELETE loescht eine Ressource. GET und DELETE haben typischerweise keinen Request-Body, waehrend POST, PUT und PATCH Daten im Body senden. GET sollte idempotent und sicher sein (keine Seiteneffekte).',
 1, 19, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was bedeuten die HTTP-Statuscodes 200, 201, 400, 401, 404 und 500?',
 '200 OK: Anfrage erfolgreich. 201 Created: Ressource erfolgreich erstellt. 400 Bad Request: Fehlerhafte Anfrage (z.B. Validierungsfehler). 401 Unauthorized: Authentifizierung fehlt oder ungueltig. 404 Not Found: Ressource wurde nicht gefunden. 500 Internal Server Error: Unbehandelter Serverfehler. Die 2xx-Codes signalisieren Erfolg, 4xx Client-Fehler und 5xx Server-Fehler.',
 1, 19, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist JSON und warum wird es in REST-APIs verwendet?',
 'JSON (JavaScript Object Notation) ist ein leichtgewichtiges Datenformat zum Austausch von strukturierten Daten. Es ist menschenlesbar und einfach zu parsen. JSON wird in REST-APIs als Standard-Datenformat verwendet, weil es von allen Programmiersprachen unterstuetzt wird, kompakter als XML ist, und eine natuerliche Abbildung auf Objekte/Datenstrukturen ermoeglicht. Der Content-Type-Header ist application/json.',
 1, 19, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Wie fuehrt man in JavaScript/React einen API-Aufruf mit fetch durch?',
 'Man verwendet die fetch()-Funktion: const response = await fetch("/api/users"); const data = await response.json();. Fuer POST: fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Max" }) }). fetch gibt ein Promise zurueck und muss mit await oder .then() verwendet werden. Man sollte den response.ok-Status pruefen.',
 1, 19, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Medium (4)
('Was ist der Unterschied zwischen PUT und PATCH in einer REST-API?',
 'PUT ersetzt eine Ressource komplett. Alle Felder muessen mitgeschickt werden; fehlende Felder werden auf null/default gesetzt. PATCH aktualisiert nur die mitgesendeten Felder und laesst die restlichen unveraendert. In der Praxis wird PATCH haeufiger verwendet, da oft nur einzelne Felder geaendert werden. PUT ist idempotent (mehrfaches Ausfuehren liefert dasselbe Ergebnis), PATCH nicht zwingend.',
 2, 19, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist CORS und warum ist es bei API-Aufrufen wichtig?',
 'CORS (Cross-Origin Resource Sharing) ist ein Sicherheitsmechanismus im Browser, der verhindert, dass JavaScript von einer Domain Anfragen an eine andere Domain sendet. Der Server muss CORS explizit erlauben, indem er den Header Access-Control-Allow-Origin setzt. Ohne CORS-Konfiguration blockiert der Browser API-Aufrufe von einem Frontend (z.B. localhost:3000) zu einem Backend auf einer anderen Domain/Port.',
 2, 19, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was sind HTTP-Header und welche sind bei REST-APIs besonders relevant?',
 'HTTP-Header enthalten Metadaten zur Anfrage oder Antwort. Wichtige Header bei REST-APIs sind: Content-Type (Datenformat, z.B. application/json), Authorization (Authentifizierungstoken, z.B. Bearer Token), Accept (gewuenschtes Antwortformat), Cache-Control (Caching-Verhalten), und X-Request-ID (fuer Request-Tracking). Eigene Header beginnen traditionell mit X-, was aber nicht mehr empfohlen wird.',
 2, 19, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Unterschied zwischen Authentifizierung und Autorisierung bei einer API?',
 'Authentifizierung (Authentication) stellt fest, WER der Benutzer ist (z.B. durch Login mit Username/Passwort, JWT-Token, OAuth). Autorisierung (Authorization) bestimmt, WAS der authentifizierte Benutzer tun darf (z.B. ob er auf eine bestimmte Ressource zugreifen darf). Erst wird authentifiziert, dann autorisiert. Ein 401-Fehler bedeutet "nicht authentifiziert", ein 403-Fehler bedeutet "nicht autorisiert".',
 2, 19, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Hard (2)
('Wie wuerden Sie eine REST-API versionieren und welche Strategien gibt es?',
 'Es gibt drei gaengige Strategien: URL-Versionierung (/api/v1/users, /api/v2/users) ist am verbreitetsten und einfachsten. Header-Versionierung (Custom Header: Api-Version: 2) haelt die URL sauber. Query-Parameter (/api/users?version=2) ist ein Kompromiss. Wichtig ist die Abwaertskompatibilitaet: Aenderungen, die bestehende Clients brechen, erfordern eine neue Version. Alte Versionen sollten fuer eine Uebergangszeit weiter unterstuetzt werden.',
 3, 19, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist Rate Limiting bei APIs und wie wuerde man es implementieren?',
 'Rate Limiting beschraenkt die Anzahl von API-Anfragen pro Zeitraum, um den Server vor Ueberlastung und Missbrauch zu schuetzen. Gaengige Algorithmen sind Token Bucket, Fixed Window und Sliding Window. In ASP.NET Core gibt es seit .NET 7 eingebautes Rate Limiting (AddRateLimiter). Die Limits werden typischerweise per IP-Adresse oder API-Key gesetzt. Ueberschrittene Limits werden mit HTTP 429 Too Many Requests beantwortet.',
 3, 19, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Expert (1)
('Welche Probleme koennen bei der Paginierung von API-Ergebnissen auftreten und wie loest man sie?',
 'Offset-basierte Paginierung (page/limit) hat Probleme bei grossen Datenmengen (langsam bei hohem Offset) und bei sich aendernden Daten (Eintraege koennen uebersprungen oder doppelt angezeigt werden). Cursor-basierte Paginierung (next_cursor) loest beide Probleme, indem ein eindeutiger Zeiger verwendet wird. Keyset Paginierung (WHERE id > last_id) ist die performanteste Loesung fuer Datenbanken. Die API sollte Metadaten wie total_count, has_next_page und Cursor/Links in der Antwort mitliefern.',
 4, 19, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80');


-- ============================================================================
-- PART 3f: Questions for Git / Versionskontrolle (topic_id = GIT_TOPIC_ID)
-- ============================================================================
-- NOTE: Replace GIT_TOPIC_ID with the actual ID from Part 2.

INSERT INTO question (question, answer, difficulty, topic_id, tags, created_by) VALUES

-- Easy (5)
('Was ist Git und warum verwendet man Versionskontrolle?',
 'Git ist ein verteiltes Versionskontrollsystem, das Aenderungen an Dateien ueber die Zeit verfolgt. Versionskontrolle ermoeglicht es, aeltere Versionen wiederherzustellen, parallel an Features zu arbeiten, Aenderungen verschiedener Entwickler zusammenzufuehren und eine lueckenlose Historie des Projekts zu fuehren. Git ist dezentral, das heisst jeder Entwickler hat eine vollstaendige Kopie des Repositorys.',
 1, 20, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Unterschied zwischen git add, git commit und git push?',
 'git add fuegt Aenderungen zum Staging-Bereich hinzu (vorbereiten fuer den Commit). git commit speichert die Aenderungen aus dem Staging-Bereich als neuen Commit in der lokalen Historie mit einer Commit-Message. git push uebertraegt die lokalen Commits zum Remote-Repository (z.B. GitHub), damit andere Entwickler die Aenderungen sehen und abrufen koennen.',
 1, 20, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist ein Branch in Git und wofuer wird er verwendet?',
 'Ein Branch ist ein unabhaengiger Entwicklungszweig, der vom Hauptzweig (main/master) abzweigt. Branches werden verwendet, um neue Features, Bugfixes oder Experimente isoliert zu entwickeln, ohne den stabilen Hauptzweig zu beeinflussen. Wenn die Arbeit fertig ist, wird der Branch per Merge oder Pull Request zurueck in den Hauptzweig integriert.',
 1, 20, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist ein Merge-Konflikt und wie loest man ihn?',
 'Ein Merge-Konflikt entsteht, wenn zwei Branches die gleiche Stelle in einer Datei unterschiedlich geaendert haben. Git kann nicht automatisch entscheiden, welche Aenderung gilt, und markiert die Konfliktstellen mit <<<<<<, ====== und >>>>>> Markern. Der Entwickler muss die Konflikte manuell loesen, indem er die gewuenschte Version behaelt, die Marker entfernt, die Datei staged und den Merge mit einem Commit abschliesst.',
 1, 20, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist eine .gitignore-Datei und wofuer braucht man sie?',
 'Die .gitignore-Datei definiert Dateien und Verzeichnisse, die von Git ignoriert und nicht versioniert werden sollen. Typische Eintraege sind: node_modules/, .env (Umgebungsvariablen mit Secrets), Build-Artefakte (bin/, dist/), IDE-Konfigurationen (.idea/, .vscode/) und OS-spezifische Dateien (.DS_Store). Dadurch bleiben das Repository sauber und sensible Daten geschuetzt.',
 1, 20, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Medium (4)
('Was ist der Unterschied zwischen git merge und git rebase?',
 'git merge erstellt einen neuen Merge-Commit, der zwei Branches zusammenfuehrt, und behaelt die komplette Branch-Historie bei. git rebase verschiebt die Commits eines Branches auf die Spitze eines anderen Branches und erstellt dabei neue Commits (rewriting history). Rebase erzeugt eine lineare Historie ohne Merge-Commits. Rebase sollte nur auf lokalen, nicht gepushten Branches verwendet werden, da es die Commit-Hashes aendert.',
 2, 20, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Erklaeren Sie den Git-Workflow mit Feature Branches. Wie haben Sie diesen in Ihrem IPA-Projekt angewendet?',
 'Beim Feature-Branch-Workflow erstellt man fuer jede Aufgabe einen eigenen Branch (z.B. feature/login, bugfix/validation). Der main-Branch bleibt immer stabil und deploybar. Nach Fertigstellung erstellt man einen Pull Request, der von Kollegen reviewed wird. Nach Genehmigung wird der Branch gemergt und kann geloescht werden. Dieser Workflow ermoeglicht parallele Arbeit und Code-Reviews.',
 2, 20, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist ein Pull Request (bzw. Merge Request) und warum ist er wichtig?',
 'Ein Pull Request ist ein Antrag, die Aenderungen eines Feature-Branches in den Hauptbranch zu integrieren. Er ermoeglicht Code-Reviews, bei denen andere Entwickler den Code pruefen, Kommentare hinterlassen und Verbesserungen vorschlagen. Pull Requests koennen mit CI-Pipelines verknuepft werden, die automatisch Tests ausfuehren. Sie foerdern Wissensaustausch im Team und verbessern die Code-Qualitaet.',
 2, 20, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was macht git stash und in welchen Situationen ist es nuetzlich?',
 'git stash speichert unveroffentlichte Aenderungen temporaer, ohne sie zu committen, und setzt das Working Directory auf den letzten Commit zurueck. Mit git stash pop werden die Aenderungen wiederhergestellt. Es ist nuetzlich, wenn man schnell den Branch wechseln muss (z.B. fuer einen Hotfix), aber die aktuelle Arbeit noch nicht commit-bereit ist, oder wenn man pullen moechte, aber lokale Aenderungen Konflikte verursachen wuerden.',
 2, 20, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Hard (2)
('Was ist der Unterschied zwischen git reset, git revert und git checkout in Bezug auf das Rueckgaengigmachen von Aenderungen?',
 'git revert erstellt einen neuen Commit, der die Aenderungen eines bestimmten Commits rueckgaengig macht (sicher, behaelt Historie). git reset verschiebt den HEAD-Pointer zurueck und kann Commits entfernen (--soft behaelt Staging, --mixed behaelt Dateien, --hard loescht alles). git checkout (bzw. git restore) stellt einzelne Dateien auf einen frueheren Stand zurueck. In oeffentlichen Branches sollte man immer revert statt reset verwenden, um die Historie nicht zu veraendern.',
 3, 20, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was sind Git Hooks und wie koennen sie im Entwicklungsprozess eingesetzt werden?',
 'Git Hooks sind Skripte, die automatisch bei bestimmten Git-Events ausgefuehrt werden. Gaengige Hooks sind pre-commit (Code-Formatierung, Linting vor dem Commit), commit-msg (Commit-Message-Validierung), pre-push (Tests vor dem Push). Sie koennen lokal oder serverseitig (pre-receive, post-receive) eingesetzt werden. Tools wie Husky (JavaScript) oder pre-commit (Python) vereinfachen die Verwaltung im Team.',
 3, 20, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Expert (1)
('Wie wuerden Sie eine Git-Strategie fuer ein Team mit mehreren parallel laufenden Releases und Hotfixes entwerfen?',
 'Eine bewährte Strategie ist Gitflow oder eine vereinfachte Variante: main-Branch fuer produktiven Code, develop-Branch fuer Integration, Feature-Branches fuer neue Funktionen, Release-Branches fuer Stabilisierung vor dem Release, und Hotfix-Branches fuer dringende Korrekturen direkt vom main-Branch. Alternativ kann Trunk-Based Development mit Feature Flags verwendet werden. Wichtig sind klare Branch-Naming-Konventionen, automatisierte CI/CD pro Branch, und Schutzregeln (Branch Protection) fuer main und develop.',
 4, 20, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80');


-- ============================================================================
-- PART 3g: Questions for Security (topic_id = SECURITY_TOPIC_ID)
-- ============================================================================
-- NOTE: Replace SECURITY_TOPIC_ID with the actual ID from Part 2.

INSERT INTO question (question, answer, difficulty, topic_id, tags, created_by) VALUES

-- Easy (5)
('Was ist der Unterschied zwischen Authentifizierung und Autorisierung?',
 'Authentifizierung (Authentication) prueft die Identitaet eines Benutzers, also WER jemand ist (z.B. Login mit Benutzername und Passwort). Autorisierung (Authorization) prueft die Berechtigungen, also WAS ein authentifizierter Benutzer tun darf (z.B. ob er Admin-Funktionen nutzen darf). Die Authentifizierung kommt immer vor der Autorisierung.',
 1, 21, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist SQL Injection und wie kann man sich davor schuetzen?',
 'SQL Injection ist ein Angriff, bei dem boesartiger SQL-Code ueber Benutzereingaben in eine Datenbankabfrage eingeschleust wird. Zum Beispiel koennte ein Angreifer im Login-Feld " OR 1=1 --" eingeben. Schutz: Parameterisierte Queries (Prepared Statements) verwenden, niemals Benutzereingaben direkt in SQL-Strings einsetzen, ORMs wie Entity Framework nutzen, und Eingaben serverseitig validieren.',
 1, 21, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist Cross-Site Scripting (XSS) und wie verhindert man es?',
 'XSS ist ein Angriff, bei dem schadhafter JavaScript-Code in eine Webseite eingeschleust wird, der dann im Browser anderer Benutzer ausgefuehrt wird. Zum Beispiel koennte ein Angreifer <script>-Tags in ein Kommentarfeld eingeben. Schutz: Ausgaben immer HTML-encoden/escapen, Content Security Policy (CSP) Header setzen, Benutzereingaben validieren und sanitizen, und in React ist JSX standardmaessig gegen XSS geschuetzt.',
 1, 21, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Warum sollte man Passwoerter nie im Klartext speichern und wie speichert man sie korrekt?',
 'Klartext-Passwoerter koennen bei einem Datenbank-Leak direkt gelesen werden. Stattdessen speichert man einen Hash des Passworts mit einem Salt (zufaelliger Zusatzwert pro Benutzer). Beim Login wird das eingegebene Passwort mit dem gleichen Salt gehasht und mit dem gespeicherten Hash verglichen. Geeignete Algorithmen sind bcrypt, scrypt oder Argon2, die absichtlich langsam sind, um Brute-Force-Angriffe zu erschweren.',
 1, 21, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist HTTPS und warum ist es wichtig?',
 'HTTPS (HTTP Secure) verschluesselt die Kommunikation zwischen Client und Server mit TLS/SSL. Ohne HTTPS werden Daten im Klartext uebertragen und koennen von Dritten abgefangen werden (Man-in-the-Middle-Angriff). HTTPS schuetzt Passwoerter, persoenliche Daten und Session-Cookies. Browser warnen inzwischen aktiv vor Seiten ohne HTTPS, und es ist fuer SEO und moderne Web-APIs (z.B. Service Workers) erforderlich.',
 1, 21, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Medium (3)
('Was ist ein JWT (JSON Web Token) und wie funktioniert die Authentifizierung damit?',
 'Ein JWT ist ein signierter Token, der aus drei Teilen besteht: Header (Algorithmus), Payload (Benutzerdaten/Claims) und Signature. Nach dem Login erstellt der Server einen JWT und sendet ihn an den Client. Der Client sendet den JWT bei jedem Request im Authorization-Header (Bearer Token). Der Server verifiziert die Signatur, ohne die Datenbank abfragen zu muessen. JWTs sind stateless, haben aber den Nachteil, dass sie bis zum Ablauf gueltig sind und nicht widerrufen werden koennen.',
 2, 21, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist CSRF (Cross-Site Request Forgery) und wie schuetzt man sich dagegen?',
 'CSRF ist ein Angriff, bei dem ein Benutzer unwissentlich eine Aktion auf einer Webseite ausfuehrt, auf der er eingeloggt ist. Der Angreifer platziert z.B. ein verstecktes Formular auf seiner Seite, das einen Request an die Zielseite sendet. Schutz: Anti-CSRF-Tokens (serverseitig generiert und bei jedem Formular mitgesendet), SameSite-Cookie-Attribut setzen, und den Origin-Header serverseitig pruefen.',
 2, 21, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was bedeutet das Prinzip der "Least Privilege" und wie wenden Sie es in der Praxis an?',
 'Das Least-Privilege-Prinzip besagt, dass ein Benutzer, Prozess oder System nur die minimal notwendigen Rechte haben sollte. In der Praxis bedeutet das: Datenbank-Benutzer erhalten nur die benoetigten Rechte (SELECT, nicht DROP). API-Endpoints pruefen spezifische Rollen. Umgebungsvariablen enthalten nur noetige Secrets. Container laufen nicht als root. Service Accounts haben eingeschraenkte Berechtigungen.',
 2, 21, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Hard (3)
('Was sind die OWASP Top 10 und welche davon sind fuer Ihre IPA-Arbeit relevant?',
 'Die OWASP Top 10 sind die zehn haeufigsten und kritischsten Sicherheitsrisiken fuer Webanwendungen. Dazu gehoeren: Broken Access Control, Cryptographic Failures, Injection (SQL, XSS), Insecure Design, Security Misconfiguration, Vulnerable Components, Authentication Failures, Software Integrity Failures, Logging Failures, und SSRF. Fuer eine typische IPA sind besonders Injection, Broken Access Control, Security Misconfiguration und Authentication Failures relevant.',
 3, 21, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Wie wuerde man Row Level Security (RLS) in einer Supabase/PostgreSQL-Datenbank implementieren?',
 'Row Level Security erlaubt es, den Zugriff auf einzelne Zeilen basierend auf dem angemeldeten Benutzer zu beschraenken. In PostgreSQL aktiviert man RLS mit ALTER TABLE ... ENABLE ROW LEVEL SECURITY und erstellt dann Policies: CREATE POLICY ... USING (auth.uid() = user_id). In Supabase ist RLS integriert und wird ueber das Dashboard oder SQL konfiguriert. Jede Tabelle kann unterschiedliche Policies fuer SELECT, INSERT, UPDATE und DELETE haben.',
 3, 21, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Erklaeren Sie den Unterschied zwischen symmetrischer und asymmetrischer Verschluesselung und nennen Sie je ein Einsatzgebiet.',
 'Bei symmetrischer Verschluesselung wird derselbe Schluessel zum Ver- und Entschluesseln verwendet (z.B. AES). Sie ist schnell, aber der Schluessel muss sicher uebertragen werden. Bei asymmetrischer Verschluesselung gibt es einen oeffentlichen Schluessel zum Verschluesseln und einen privaten zum Entschluesseln (z.B. RSA). HTTPS nutzt beide: asymmetrisch fuer den Schluesselaustausch (Handshake) und symmetrisch fuer die eigentliche Datenuebertragung.',
 3, 21, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Expert (1)
('Wie wuerden Sie ein umfassendes Sicherheitskonzept fuer eine Webanwendung mit Frontend, Backend und Datenbank erstellen?',
 'Ein umfassendes Sicherheitskonzept umfasst mehrere Schichten: Frontend: Input-Validierung, CSP-Headers, XSS-Schutz, sichere Cookie-Konfiguration (HttpOnly, Secure, SameSite). Backend: Parameterisierte Queries, Rate Limiting, CORS-Konfiguration, Authentifizierung (z.B. JWT/OAuth), rollenbasierte Autorisierung, Logging und Monitoring. Datenbank: Row Level Security, verschluesselte Verbindungen, Least-Privilege-Benutzer, regelmaessige Backups. Infrastruktur: HTTPS, Secrets Management, regelmaessige Dependency-Updates, Security Headers.',
 4, 21, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80');


-- ============================================================================
-- PART 3h: Questions for Deployment / CI-CD (topic_id = DEPLOY_TOPIC_ID)
-- ============================================================================
-- NOTE: Replace DEPLOY_TOPIC_ID with the actual ID from Part 2.

INSERT INTO question (question, answer, difficulty, topic_id, tags, created_by) VALUES

-- Easy (4)
('Was ist Continuous Integration (CI)?',
 'Continuous Integration ist die Praxis, Code-Aenderungen automatisch und haeufig in einen gemeinsamen Branch zu integrieren. Bei jedem Push werden automatisch Builds und Tests ausgefuehrt. Fehler werden dadurch frueh erkannt, bevor sie sich haeufen. Typische CI-Tools sind GitHub Actions, GitLab CI, Jenkins und Azure DevOps. CI foerdert schnelles Feedback und verhindert Integrationsprobleme.',
 1, 22, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Unterschied zwischen Continuous Delivery und Continuous Deployment?',
 'Bei Continuous Delivery wird der Code nach erfolgreichen Tests automatisch in eine produktionsreife Form gebracht (Build, Test, Staging), aber die Veroeffentlichung in Produktion erfolgt manuell per Knopfdruck. Bei Continuous Deployment wird jede Aenderung, die alle Tests besteht, automatisch in Produktion deployt, ohne manuelle Freigabe. Continuous Deployment erfordert ein hohes Mass an Testabdeckung und Vertrauen in die Pipeline.',
 1, 22, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist Docker und wofuer wird es verwendet?',
 'Docker ist eine Containerisierungsplattform, die Anwendungen mit allen Abhaengigkeiten in isolierte Container verpackt. Ein Container enthaelt den Code, die Runtime, Bibliotheken und Systemtools. Im Gegensatz zu virtuellen Maschinen teilen Container den Host-Kernel und sind daher leichter und schneller. Docker stellt sicher, dass die Anwendung in jeder Umgebung gleich laeuft ("works on my machine" wird eliminiert).',
 1, 22, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was sind Umgebungsvariablen und warum sind sie beim Deployment wichtig?',
 'Umgebungsvariablen sind Konfigurationswerte, die ausserhalb des Quellcodes gespeichert werden (z.B. Datenbankverbindungen, API-Keys, Ports). Sie werden beim Deployment wichtig, weil verschiedene Umgebungen (Development, Staging, Production) unterschiedliche Werte benoetigen. Sensible Daten wie Passwoerter und API-Keys duerfen nie im Code stehen, sondern werden ueber Umgebungsvariablen oder Secret-Manager bereitgestellt.',
 1, 22, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Medium (4)
('Was ist ein Dockerfile und aus welchen wichtigen Anweisungen besteht es?',
 'Ein Dockerfile ist ein Textfile, das beschreibt, wie ein Docker-Image gebaut wird. Wichtige Anweisungen: FROM (Basis-Image, z.B. node:18), WORKDIR (Arbeitsverzeichnis), COPY (Dateien kopieren), RUN (Befehle ausfuehren, z.B. npm install), EXPOSE (Port freigeben), ENV (Umgebungsvariablen), und CMD oder ENTRYPOINT (Startbefehl). Multi-Stage-Builds verwenden mehrere FROM-Anweisungen, um das finale Image klein zu halten.',
 2, 22, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Erklaeren Sie den Ablauf einer typischen CI/CD-Pipeline anhand eines konkreten Beispiels.',
 'Eine typische Pipeline hat folgende Stufen: 1. Trigger: Push auf einen Branch oder Pull Request. 2. Build: Code kompilieren/bauen (npm run build). 3. Test: Unit-Tests, Integration-Tests, Linting ausfuehren. 4. Security Scan: Abhaengigkeiten auf Schwachstellen pruefen. 5. Deploy to Staging: Auf eine Testumgebung deployen. 6. E2E-Tests: Automatische Tests auf Staging. 7. Deploy to Production: Manuell oder automatisch auf Produktion deployen.',
 2, 22, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Unterschied zwischen einem Docker-Image und einem Docker-Container?',
 'Ein Docker-Image ist eine unveraenderliche Vorlage, die den Code, die Abhaengigkeiten und die Konfiguration enthaelt. Ein Container ist eine laufende Instanz eines Images. Aus einem Image koennen mehrere Container erstellt werden. Das Verhaeltnis ist wie Klasse zu Objekt in der OOP. Images werden in Registries (z.B. Docker Hub) gespeichert und versioniert. Container sind ephemeral und koennen jederzeit gestoppt und neu erstellt werden.',
 2, 22, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist Vercel/Netlify und wie unterscheidet sich das Deployment dort von einem traditionellen Server?',
 'Vercel und Netlify sind Platform-as-a-Service-Anbieter, die speziell fuer Frontend-Frameworks (Next.js, React) optimiert sind. Sie bieten automatisches Deployment bei Git-Push, Preview-Deployments fuer Pull Requests, CDN-Verteilung, und Serverless Functions. Im Gegensatz zu einem traditionellen Server muss man sich nicht um Infrastruktur, Skalierung, SSL-Zertifikate oder Server-Updates kuemmern. Die Konfiguration erfolgt meist ueber eine Datei (vercel.json) oder die UI.',
 2, 22, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Hard (2)
('Was sind die Vorteile und Nachteile von Serverless-Architektur im Vergleich zu traditionellem Hosting?',
 'Vorteile: Automatische Skalierung, keine Server-Verwaltung, Pay-per-Use-Preismodell, schnelles Deployment. Nachteile: Cold Starts (Latenz bei erster Anfrage), begrenzte Ausfuehrungszeit, Vendor Lock-in, schwierigeres lokales Debugging, moegliche hohe Kosten bei konstantem Traffic. Serverless eignet sich gut fuer Event-getriebene, sporadische Workloads und weniger fuer lang laufende Prozesse oder konstante Auslastung.',
 3, 22, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist eine Blue-Green-Deployment-Strategie und welches Problem loest sie?',
 'Blue-Green-Deployment verwendet zwei identische Produktionsumgebungen (Blue und Green). Die aktive Version laeuft auf Blue, waehrend Green die neue Version erhaelt. Nach erfolgreichem Deployment und Tests auf Green wird der Traffic per Load Balancer oder DNS von Blue auf Green umgeschaltet. Bei Problemen kann sofort auf Blue zurueckgewechselt werden (Instant Rollback). Das eliminiert Downtime und reduziert das Risiko bei Deployments.',
 3, 22, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Expert (1)
('Wie wuerden Sie eine CI/CD-Pipeline fuer eine Next.js-Anwendung mit Supabase-Backend implementieren, einschliesslich Datenbank-Migrationen?',
 'Die Pipeline umfasst: 1. Build-Stage: npm ci, npm run build, Linting/Typecheck. 2. Test-Stage: Unit-Tests, ggf. gegen eine Supabase-Testinstanz. 3. DB-Migration: Supabase CLI (supabase db push) auf Staging ausfuehren, Schema-Aenderungen pruefen. 4. Deploy Staging: Vercel Preview Deployment oder Staging-Branch. 5. E2E-Tests auf Staging. 6. Deploy Production: Promotion oder erneuter Build fuer main-Branch. 7. DB-Migration Production. Secrets werden als Pipeline-Variablen konfiguriert. Rollback-Strategie fuer DB-Migrationen mit reversiblen Migrationen planen.',
 4, 22, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80');


-- ============================================================================
-- PART 3i: Questions for Datenbankdesign & Normalisierung (topic_id = DBDESIGN_TOPIC_ID)
-- ============================================================================
-- NOTE: Replace DBDESIGN_TOPIC_ID with the actual ID from Part 2.

INSERT INTO question (question, answer, difficulty, topic_id, tags, created_by) VALUES

-- Easy (5)
('Was ist ein Primaerschluessel (Primary Key) und warum ist er wichtig?',
 'Ein Primaerschluessel ist ein Attribut oder eine Kombination von Attributen, das jede Zeile in einer Tabelle eindeutig identifiziert. Er darf nicht NULL sein und muss einzigartig sein. Der Primaerschluessel wird fuer die Verknuepfung mit anderen Tabellen (Fremdschluessel) und fuer effiziente Suche verwendet. Gaengige Primaerschluessel sind Auto-Increment-IDs oder UUIDs.',
 1, 23, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist ein Fremdschluessel (Foreign Key) und wofuer wird er verwendet?',
 'Ein Fremdschluessel ist ein Attribut in einer Tabelle, das auf den Primaerschluessel einer anderen Tabelle verweist. Er stellt die referenzielle Integritaet sicher, das heisst, es koennen nur Werte eingefuegt werden, die in der referenzierten Tabelle existieren. Zum Beispiel verweist die Spalte "user_id" in einer Bestellungstabelle auf die "id"-Spalte der Benutzertabelle.',
 1, 23, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was sind die verschiedenen Beziehungstypen in einer relationalen Datenbank?',
 'Es gibt drei Beziehungstypen: 1:1 (One-to-One): Ein Benutzer hat genau ein Profil. 1:n (One-to-Many): Ein Kunde hat viele Bestellungen, aber jede Bestellung gehoert zu einem Kunden. n:m (Many-to-Many): Schueler besuchen viele Kurse und Kurse haben viele Schueler. Eine n:m-Beziehung wird ueber eine Zwischentabelle (Junction Table) mit zwei Fremdschluesseln aufgeloest.',
 1, 23, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist ein ER-Diagramm und welche Elemente enthaelt es?',
 'Ein ER-Diagramm (Entity-Relationship-Diagramm) ist eine grafische Darstellung der Datenbankstruktur. Es enthaelt Entitaeten (Tabellen, dargestellt als Rechtecke), Attribute (Eigenschaften, dargestellt als Ovale oder innerhalb der Rechtecke) und Beziehungen (Verbindungen zwischen Entitaeten mit Kardinalitaeten). ER-Diagramme werden in der Planungsphase erstellt, um die Datenbankstruktur zu entwerfen, bevor man sie implementiert.',
 1, 23, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Unterschied zwischen einer Tabelle und einer View in SQL?',
 'Eine Tabelle speichert Daten physisch in der Datenbank. Eine View ist eine gespeicherte Abfrage (SELECT-Statement), die wie eine virtuelle Tabelle funktioniert, aber keine eigenen Daten speichert. Views werden fuer komplexe Abfragen, Zugriffsbeschraenkung und Abstraktion verwendet. Bei jedem Zugriff auf eine View wird die zugrunde liegende Abfrage ausgefuehrt. Materialized Views hingegen speichern das Ergebnis physisch und muessen explizit aktualisiert werden.',
 1, 23, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Medium (4)
('Erklaeren Sie die erste, zweite und dritte Normalform anhand eines Beispiels.',
 '1. Normalform (1NF): Jede Spalte enthaelt nur atomare (unteilbare) Werte. Keine wiederholenden Gruppen. Falsch: "Telefon: 044 123, 078 456". Richtig: Separate Zeilen oder Tabelle. 2. Normalform (2NF): 1NF plus jedes Nicht-Schluessel-Attribut haengt vom gesamten Primaerschluessel ab (keine partiellen Abhaengigkeiten bei zusammengesetzten Schluesseln). 3. Normalform (3NF): 2NF plus keine transitiven Abhaengigkeiten (Nicht-Schluessel-Attribute haengen nur vom Schluessel ab, nicht voneinander). Beispiel: PLZ bestimmt Stadt, also gehoert Stadt nicht in die Kundentabelle.',
 2, 23, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist Denormalisierung und wann ist sie sinnvoll?',
 'Denormalisierung ist das bewusste Einfuegen von Redundanz in eine normalisierte Datenbankstruktur, um die Leseperformance zu verbessern. Statt mehrerer JOINs werden haeufig abgefragte Daten in einer Tabelle zusammengefasst. Sie ist sinnvoll bei hoher Leselast, wenn JOINs zu langsam sind, oder fuer Reporting-Datenbanken. Der Nachteil ist erhoehte Komplexitaet bei Aenderungen und die Gefahr von Dateninkonsistenzen.',
 2, 23, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was sind Indizes in einer Datenbank und wann sollte man sie erstellen?',
 'Ein Index ist eine Datenstruktur, die den Datenzugriff beschleunigt, aehnlich einem Buchindex. Er wird auf Spalten erstellt, die haeufig in WHERE-Klauseln, JOINs oder ORDER BY verwendet werden. Indizes beschleunigen SELECT-Abfragen, verlangsamen aber INSERT, UPDATE und DELETE, da der Index mitgepflegt werden muss. Man sollte sie auf Fremdschluessel, haeufig gesuchte Spalten und Spalten mit hoher Kardinalitaet erstellen, aber nicht auf jede Spalte.',
 2, 23, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist referenzielle Integritaet und welche Aktionen gibt es bei ON DELETE?',
 'Referenzielle Integritaet stellt sicher, dass Fremdschluessel immer auf gueltige Datensaetze verweisen. Bei ON DELETE gibt es verschiedene Aktionen: CASCADE (loescht abhaengige Datensaetze mit), SET NULL (setzt den Fremdschluessel auf NULL), SET DEFAULT (setzt auf den Standardwert), RESTRICT/NO ACTION (verhindert das Loeschen, wenn abhaengige Datensaetze existieren). Die Wahl haengt vom Anwendungsfall ab. Bestellungen sollten z.B. nicht geloescht werden, wenn ein Kunde geloescht wird.',
 2, 23, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Hard (2)
('Was sind die Vor- und Nachteile von UUIDs gegenueber Auto-Increment-IDs als Primaerschluessel?',
 'UUIDs: Vorteile sind globale Eindeutigkeit (kein Konflikt bei verteilten Systemen), keine sequenziellen IDs (schwerer abschaetzbar, mehr Security), unabhaengig von der Datenbank generierbar. Nachteile: 16 Bytes statt 4/8 Bytes, schlechtere Index-Performance bei B-Tree (zufaellige Verteilung), und weniger lesbar. Auto-Increment: Kompakter, schnellere Indexierung, lesbar, aber nicht global eindeutig und potenziell vorhersagbar. Fuer verteilte Systeme oder APIs sind UUIDs oft die bessere Wahl.',
 3, 23, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Wie wuerden Sie die Datenbank fuer ein System mit verschiedenen Benutzerrollen (Admin, Experte, Lehrling) entwerfen?',
 'Es gibt verschiedene Ansaetze: 1. Rollen-Tabelle: Eine separate "roles"-Tabelle mit einer Many-to-Many-Beziehung zu Users (user_roles-Zwischentabelle). Flexibel, erweiterbar. 2. Enum/Flag: Eine "role"-Spalte in der Users-Tabelle (einfacher, aber weniger flexibel). 3. Berechtigungs-basiert: Rollen haben Berechtigungen (permissions), und Berechtigungen werden geprueft statt Rollen. Zusaetzlich kann Row Level Security auf Datenbankebene die Zugriffsrechte durchsetzen. Die Wahl haengt von der Komplexitaet der Berechtigungsstruktur ab.',
 3, 23, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Expert (1)
('Wie wuerden Sie die Performance einer langsamen Datenbankabfrage systematisch analysieren und optimieren?',
 'Systematischer Ansatz: 1. EXPLAIN ANALYZE ausfuehren, um den Query Plan zu verstehen (Sequential Scan vs. Index Scan, Join-Typen). 2. Fehlende Indizes identifizieren und erstellen. 3. Die Abfrage optimieren: Nur benoetigte Spalten selektieren, JOINs ueberpruefen, Subqueries durch JOINs oder CTEs ersetzen. 4. Datenvolumen reduzieren durch fruehes Filtern. 5. Connection Pooling ueberpruefen. 6. Denormalisierung oder Materialized Views fuer haeufige teure Abfragen erwaegen. 7. Caching-Strategien auf Anwendungsebene implementieren.',
 4, 23, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80');


-- ============================================================================
-- PART 3j: Questions for Unit Testing (topic_id = UNITTEST_TOPIC_ID)
-- ============================================================================
-- NOTE: Replace UNITTEST_TOPIC_ID with the actual ID from Part 2.

INSERT INTO question (question, answer, difficulty, topic_id, tags, created_by) VALUES

-- Easy (5)
('Was ist ein Unit Test und was ist sein Zweck?',
 'Ein Unit Test ist ein automatisierter Test, der eine einzelne Einheit (Unit) des Codes isoliert testet, typischerweise eine Methode oder Funktion. Sein Zweck ist es, sicherzustellen, dass die Einheit korrekt funktioniert. Unit Tests werden haeufig und schnell ausgefuehrt, geben sofortiges Feedback und helfen, Regressionen (erneut auftretende Fehler) zu verhindern.',
 1, 24, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was bedeutet das AAA-Pattern (Arrange, Act, Assert) bei Unit Tests?',
 'AAA ist ein gaengiges Muster zur Strukturierung von Unit Tests. Arrange: Die Testumgebung wird vorbereitet (Objekte erstellen, Testdaten setzen). Act: Die zu testende Methode wird aufgerufen. Assert: Das Ergebnis wird ueberprueft (Ist das Ergebnis wie erwartet?). Diese Struktur macht Tests lesbar und einheitlich. Beispiel: Arrange: var calculator = new Calculator(); Act: var result = calculator.Add(2, 3); Assert: Assert.Equal(5, result).',
 1, 24, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Unterschied zwischen einem Unit Test, einem Integrationstest und einem E2E-Test?',
 'Unit Tests testen einzelne Methoden/Funktionen isoliert, sind schnell und zahlreich (Basis der Testpyramide). Integrationstests testen das Zusammenspiel mehrerer Komponenten (z.B. API mit Datenbank). E2E-Tests (End-to-End) simulieren echte Benutzerinteraktionen im Browser und testen den gesamten Ablauf. Je hoeher in der Testpyramide, desto langsamer und aufwaendiger, aber desto naeher am realen Verhalten.',
 1, 24, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was sind Assertions in Unit Tests und nennen Sie Beispiele.',
 'Assertions sind Pruefungen, die das erwartete Ergebnis mit dem tatsaechlichen vergleichen. Wenn eine Assertion fehlschlaegt, schlaegt der Test fehl. Beispiele: Assert.Equal(expected, actual) prueft Gleichheit, Assert.True(condition) prueft ob wahr, Assert.Null(obj) prueft auf null, Assert.Throws<Exception>() prueft ob eine Exception geworfen wird, Assert.Contains(item, list) prueft ob ein Element in einer Sammlung enthalten ist.',
 1, 24, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist Code Coverage und welche Abdeckung sollte man anstreben?',
 'Code Coverage misst, welcher Anteil des Quellcodes von Tests ausgefuehrt wird, angegeben in Prozent. Es gibt verschiedene Metriken: Line Coverage (Zeilen), Branch Coverage (if/else-Zweige) und Method Coverage. Eine gaengige Empfehlung ist 70-80% Coverage. 100% ist meist nicht wirtschaftlich. Wichtiger als die Zahl ist, dass kritische Geschaeftslogik gut abgedeckt ist. Hohe Coverage garantiert nicht fehlerfreien Code, da die Qualitaet der Assertions entscheidend ist.',
 1, 24, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Medium (4)
('Was ist Mocking und warum ist es bei Unit Tests wichtig?',
 'Mocking ersetzt reale Abhaengigkeiten (Datenbank, API, Dateisystem) durch kontrollierte Attrappen (Mocks). Das ermoeglicht es, eine Unit isoliert zu testen, ohne von externen Systemen abzuhaengig zu sein. Ein Mock kann konfiguriert werden, bestimmte Werte zurueckzugeben oder Exceptions zu werfen. In C# sind gaengige Mocking-Frameworks Moq und NSubstitute. In JavaScript/TypeScript nutzt man jest.mock() oder jest.fn().',
 2, 24, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Unterschied zwischen einem Mock, einem Stub und einem Fake?',
 'Ein Stub gibt vordefinierte Antworten zurueck, ohne Verhalten zu pruefen (z.B. ein Repository, das immer dieselben Daten liefert). Ein Mock wird zusaetzlich verifiziert, ob bestimmte Methoden aufgerufen wurden (Behavior Verification). Ein Fake ist eine funktionierende, vereinfachte Implementierung (z.B. eine In-Memory-Datenbank statt einer echten). In der Praxis werden die Begriffe oft synonym verwendet, Mocking-Frameworks decken alle drei ab.',
 2, 24, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist Test-Driven Development (TDD) und wie funktioniert der Red-Green-Refactor-Zyklus?',
 'TDD ist ein Entwicklungsansatz, bei dem Tests VOR dem Produktivcode geschrieben werden. Der Zyklus: 1. Red: Einen fehlschlagenden Test schreiben, der das gewuenschte Verhalten beschreibt. 2. Green: Den minimalen Code schreiben, damit der Test besteht. 3. Refactor: Den Code verbessern, waehrend alle Tests bestehen bleiben. TDD fuehrt zu besserem Design, hoher Testabdeckung und vertrauenswuerdigem Code.',
 2, 24, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Welche Eigenschaften sollte ein guter Unit Test haben?',
 'Gute Unit Tests sind: Fast (schnell ausfuehrbar), Independent (unabhaengig von anderen Tests und der Reihenfolge), Repeatable (liefern immer dasselbe Ergebnis), Self-Validating (bestehen oder scheitern ohne manuelle Pruefung), Timely (rechtzeitig geschrieben). Zusaetzlich sollten sie nur ein Konzept pro Test pruefen, aussagekraeftige Namen haben (z.B. CalculateTotal_WithDiscount_ReturnsDiscountedPrice), und keine Logik (if/else, Schleifen) enthalten.',
 2, 24, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Hard (2)
('Wie testet man Code, der von externen APIs abhaengt, ohne die echte API aufzurufen?',
 'Man kann verschiedene Ansaetze verwenden: 1. Interface-Abstraktion: Die API-Klasse implementiert ein Interface, das im Test durch einen Mock ersetzt wird. 2. HTTP-Mocking: Tools wie WireMock (C#) oder msw (JavaScript) simulieren HTTP-Antworten. 3. Recorded Responses: Echte API-Antworten aufzeichnen und als Fixtures verwenden. 4. Dependency Injection: Die HTTP-Client-Instanz wird injiziert und kann im Test ersetzt werden. Wichtig ist, auch Fehlerfaelle (Timeouts, 500er, ungueltige Antworten) zu testen.',
 3, 24, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist Mutation Testing und welchen Vorteil bietet es gegenueber reiner Code Coverage?',
 'Mutation Testing aendert automatisch den Produktivcode (Mutationen, z.B. > wird zu <, true zu false, Methode wird entfernt) und prueft, ob die Tests die Mutation erkennen (der Test schlaegt fehl = Mutant getoetet). Wenn Tests trotz einer Mutation bestehen, fehlt ein aussagekraeftiger Test. Mutation Testing misst die Qualitaet der Tests, nicht nur die Abdeckung. Hohe Code Coverage mit schwachen Assertions wird so aufgedeckt. Tools: Stryker (JavaScript/C#), PITest (Java).',
 3, 24, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Expert (1)
('Wie wuerden Sie eine Teststrategie fuer ein Fullstack-Projekt mit React-Frontend und REST-API-Backend entwerfen?',
 'Die Strategie folgt der Testpyramide: Basis: Viele Unit Tests fuer Business-Logik im Backend (z.B. Validierung, Berechnungen) und reine Utility-Funktionen im Frontend. Mittlere Schicht: Integrationstests fuer API-Endpoints (z.B. mit Supertest/TestServer gegen eine Testdatenbank), und React Testing Library fuer Komponenten mit User-Interaktion. Spitze: Wenige E2E-Tests (Cypress/Playwright) fuer kritische User Journeys (Login, Hauptprozess). Zusaetzlich: Contract Tests fuer die API-Schnittstelle, Visual Regression Tests fuer UI-Aenderungen, und Performance-Tests fuer kritische Endpoints. CI-Pipeline fuehrt alle Tests bei jedem Push aus.',
 4, 24, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80');


-- ============================================================================
-- PART 4a: Additional Questions for C# General (topic_id = 1, existing)
-- ============================================================================

INSERT INTO question (question, answer, difficulty, topic_id, tags, created_by) VALUES

-- Easy (4)
('Was ist der Unterschied zwischen Werttypen (Value Types) und Referenztypen (Reference Types) in C#?',
 'Werttypen (int, double, bool, struct, enum) speichern den Wert direkt auf dem Stack. Referenztypen (class, string, array, object) speichern auf dem Stack nur eine Referenz (Zeiger) auf das eigentliche Objekt, das auf dem Heap liegt. Bei Werttypen wird bei einer Zuweisung eine Kopie erstellt, bei Referenztypen wird nur die Referenz kopiert, beide Variablen zeigen auf dasselbe Objekt.',
 1, 1, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Unterschied zwischen var und einem expliziten Typ in C#?',
 'var ist implizite Typisierung: Der Compiler ermittelt den Typ automatisch aus dem zugewiesenen Wert. var x = 42 ist identisch mit int x = 42. Der Code wird dadurch kuerzer und lesbarer, besonders bei langen Typnamen. Wichtig: var ist NICHT dynamisch typisiert, der Typ steht zur Compile-Zeit fest und kann danach nicht geaendert werden. var darf nur bei lokalen Variablen mit Initialisierung verwendet werden.',
 1, 1, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist ein Namespace in C# und wofuer wird er verwendet?',
 'Ein Namespace ist ein Organisationselement, das Klassen und andere Typen logisch gruppiert und Namenskonflikte vermeidet. Zum Beispiel koennten zwei Bibliotheken beide eine Klasse "Timer" haben, durch unterschiedliche Namespaces (System.Timers.Timer vs. System.Threading.Timer) koennen sie koexistieren. Man importiert Namespaces mit dem using-Statement am Anfang der Datei.',
 1, 1, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Unterschied zwischen == und .Equals() in C#?',
 'Bei Werttypen vergleichen beide den Wert und verhalten sich gleich. Bei Referenztypen vergleicht == standardmaessig die Referenz (ob es dasselbe Objekt ist), waehrend .Equals() den Inhalt vergleichen kann (wenn ueberschrieben). Die Klasse string ist eine Ausnahme: == vergleicht bei Strings den Inhalt, da der ==-Operator dafuer ueberladen wurde. Man kann sowohl == als auch .Equals() in eigenen Klassen ueberschreiben.',
 1, 1, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Medium (3)
('Was sind Generics in C# und welchen Vorteil bieten sie?',
 'Generics erlauben es, Klassen, Methoden und Interfaces mit einem Typ-Parameter zu definieren, der erst bei der Verwendung festgelegt wird. Zum Beispiel List<T> kann als List<int>, List<string> usw. verwendet werden. Vorteile: Typsicherheit zur Compile-Zeit, Vermeidung von Boxing/Unboxing, und Code-Wiederverwendung ohne Typumwandlung. Generics verhindern Laufzeitfehler, die bei der Verwendung von object auftreten koennten.',
 2, 1, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Unterschied zwischen einer struct und einer class in C#?',
 'struct ist ein Werttyp (auf dem Stack, Kopie bei Zuweisung), class ist ein Referenztyp (auf dem Heap, Referenz bei Zuweisung). structs unterstuetzen keine Vererbung (ausser Interface-Implementierung), koennen keinen parameterlosen Konstruktor haben (vor C# 10), und sollten fuer kleine, unveraenderliche Datenpakete verwendet werden (z.B. Point, Color). Records (record struct) bieten seit C# 10 eine kompakte Syntax fuer Datentypen mit Wertvergleich.',
 2, 1, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was sind Delegates und Events in C# und wie haengen sie zusammen?',
 'Ein Delegate ist ein Typ, der eine Referenz auf eine Methode mit einer bestimmten Signatur speichert. Er funktioniert wie ein typsicherer Funktionszeiger. Ein Event ist ein Mechanismus, der auf Delegates basiert und das Publisher-Subscriber-Pattern implementiert. Der Publisher deklariert ein Event, Subscriber registrieren sich mit += und werden benachrichtigt, wenn das Event ausgeloest wird (Invoke). Events koennen nur innerhalb der deklarierenden Klasse ausgeloest werden.',
 2, 1, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Hard (2)
('Was ist Reflection in C# und wofuer wird es eingesetzt?',
 'Reflection ermoeglicht es, zur Laufzeit Informationen ueber Typen, Methoden, Properties und Attribute abzufragen und zu manipulieren. Man kann damit Typen dynamisch instanziieren, Methoden aufrufen und Attribute auslesen. Anwendungsgebiete sind Serialisierung, Dependency-Injection-Container, ORM-Frameworks und Plugin-Systeme. Reflection ist langsamer als direkte Aufrufe und sollte sparsam eingesetzt werden.',
 3, 1, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Garbage Collector in C# und wie funktioniert er grundlegend?',
 'Der Garbage Collector (GC) verwaltet automatisch den Speicher auf dem Heap. Er erkennt Objekte, auf die keine Referenz mehr zeigt, und gibt deren Speicher frei. Der GC arbeitet in Generationen: Generation 0 (kurzlebig), Generation 1 (mittelfristig) und Generation 2 (langlebig). Kurzlebige Objekte werden haeufiger geprueft, was die Performance optimiert. Man kann den GC nicht direkt steuern, aber mit IDisposable und using die Freigabe unmanaged Ressourcen (Dateien, Verbindungen) kontrollieren.',
 3, 1, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Expert (1)
('Was sind die Unterschiede zwischen .NET Framework, .NET Core und .NET 5+, und welche Version wuerden Sie fuer ein neues Projekt waehlen?',
 '.NET Framework ist die aeltere, nur Windows-basierte Plattform. .NET Core war der plattformuebergreifende Nachfolger (Windows, Linux, macOS) mit besserer Performance. Ab .NET 5 wurden beide unter dem Namen ".NET" vereint. Fuer neue Projekte sollte man die aktuellste .NET-Version (z.B. .NET 8 LTS) verwenden, da sie plattformuebergreifend ist, bessere Performance bietet, aktiv weiterentwickelt wird und Zugang zu allen modernen Features wie Minimal APIs, AOT-Kompilierung und verbesserte Container-Unterstuetzung hat.',
 4, 1, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80');


-- ============================================================================
-- PART 4b: Additional Questions for SQL Queries (topic_id = 5, existing)
-- ============================================================================

INSERT INTO question (question, answer, difficulty, topic_id, tags, created_by) VALUES

-- Easy (5)
('Was ist der Unterschied zwischen WHERE und HAVING in SQL?',
 'WHERE filtert einzelne Zeilen vor der Gruppierung und kann nicht mit Aggregatfunktionen verwendet werden. HAVING filtert Gruppen nach der Gruppierung (GROUP BY) und wird typischerweise mit Aggregatfunktionen (COUNT, SUM, AVG) verwendet. Beispiel: SELECT department, COUNT(*) FROM employees WHERE active = true GROUP BY department HAVING COUNT(*) > 5 filtert erst inaktive Mitarbeiter heraus und dann Abteilungen mit weniger als 6 aktiven Mitarbeitern.',
 1, 5, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was sind die wichtigsten Aggregatfunktionen in SQL?',
 'Die wichtigsten Aggregatfunktionen sind: COUNT() zaehlt Zeilen, SUM() berechnet die Summe, AVG() berechnet den Durchschnitt, MIN() findet den kleinsten Wert, MAX() findet den groessten Wert. Aggregatfunktionen werden oft mit GROUP BY verwendet und ignorieren NULL-Werte (ausser COUNT(*)). Beispiel: SELECT AVG(salary) FROM employees berechnet das Durchschnittsgehalt.',
 1, 5, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was macht ein INNER JOIN und wie unterscheidet er sich von einem LEFT JOIN?',
 'Ein INNER JOIN gibt nur die Zeilen zurueck, die in beiden Tabellen eine Uebereinstimmung haben. Ein LEFT JOIN gibt alle Zeilen der linken Tabelle zurueck, auch wenn es keine Uebereinstimmung in der rechten Tabelle gibt (fehlende Werte werden mit NULL aufgefuellt). Beispiel: SELECT * FROM orders INNER JOIN customers ON orders.customer_id = customers.id gibt nur Bestellungen mit existierendem Kunden zurueck.',
 1, 5, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Unterschied zwischen DISTINCT und GROUP BY?',
 'DISTINCT entfernt doppelte Zeilen aus dem Ergebnis: SELECT DISTINCT city FROM customers. GROUP BY gruppiert Zeilen mit gleichen Werten und wird typischerweise mit Aggregatfunktionen verwendet: SELECT city, COUNT(*) FROM customers GROUP BY city. DISTINCT ist einfacher fuer die reine Deduplizierung, GROUP BY bietet zusaetzlich die Moeglichkeit, Aggregationen pro Gruppe durchzufuehren.',
 1, 5, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Wie sortiert man Ergebnisse in SQL und wie kann man die Ergebnismenge begrenzen?',
 'Sortierung erfolgt mit ORDER BY spalte ASC (aufsteigend, Standard) oder DESC (absteigend). Man kann nach mehreren Spalten sortieren: ORDER BY last_name ASC, first_name ASC. Die Ergebnismenge begrenzt man mit LIMIT (PostgreSQL/MySQL) oder TOP (SQL Server): SELECT * FROM products ORDER BY price DESC LIMIT 10 gibt die 10 teuersten Produkte zurueck. OFFSET ermoeglicht Paginierung: LIMIT 10 OFFSET 20.',
 1, 5, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Medium (4)
('Was ist eine Subquery (Unterabfrage) in SQL und wann verwendet man sie?',
 'Eine Subquery ist ein SELECT innerhalb eines anderen SQL-Statements. Sie kann im WHERE (SELECT * FROM products WHERE price > (SELECT AVG(price) FROM products)), im FROM (als abgeleitete Tabelle), oder im SELECT (skalare Subquery) stehen. Subqueries eignen sich fuer Vergleiche mit aggregierten Werten oder fuer Existenzpruefungen (EXISTS). Bei manchen Faellen sind JOINs oder CTEs performanter und lesbarer als Subqueries.',
 2, 5, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Unterschied zwischen UNION und UNION ALL?',
 'Beide kombinieren die Ergebnisse zweier SELECT-Statements. UNION entfernt doppelte Zeilen aus dem kombinierten Ergebnis, was eine zusaetzliche Sortierung/Vergleich erfordert. UNION ALL behaelt alle Zeilen bei, auch Duplikate, und ist daher performanter. Die SELECT-Statements muessen die gleiche Anzahl Spalten mit kompatiblen Datentypen haben. UNION ALL sollte bevorzugt werden, wenn Duplikate ausgeschlossen sind oder nicht stoeren.',
 2, 5, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Erklaeren Sie, was ein Common Table Expression (CTE) ist und geben Sie ein Beispiel.',
 'Ein CTE ist eine temporaere, benannte Ergebnismenge, die mit dem WITH-Keyword definiert wird und nur innerhalb der nachfolgenden Abfrage gueltig ist. CTEs verbessern die Lesbarkeit komplexer Abfragen. Beispiel: WITH active_users AS (SELECT * FROM users WHERE active = true) SELECT department, COUNT(*) FROM active_users GROUP BY department. CTEs koennen auch rekursiv sein, z.B. fuer hierarchische Daten wie Organigramme oder Kategoriebaeme.',
 2, 5, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Was ist der Unterschied zwischen IN und EXISTS in SQL und wann verwendet man welches?',
 'IN prueft, ob ein Wert in einer Liste oder Subquery-Ergebnismenge enthalten ist: WHERE id IN (SELECT user_id FROM orders). EXISTS prueft, ob eine korrelierte Subquery mindestens eine Zeile zurueckgibt: WHERE EXISTS (SELECT 1 FROM orders WHERE orders.user_id = users.id). EXISTS ist oft performanter bei grossen Datenmengen, da es nach dem ersten Treffer abbricht. IN ist intuitiver bei kleinen, statischen Listen.',
 2, 5, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Hard (2)
('Was sind Window Functions in SQL und nennen Sie ein praktisches Beispiel?',
 'Window Functions fuehren Berechnungen ueber eine Menge von Zeilen durch, die mit der aktuellen Zeile in Beziehung stehen, ohne die Zeilen zu gruppieren. Im Gegensatz zu GROUP BY bleibt jede Zeile im Ergebnis erhalten. Beispiel: SELECT name, salary, RANK() OVER (ORDER BY salary DESC) as rang FROM employees gibt jedem Mitarbeiter einen Rang nach Gehalt. Weitere Window Functions: ROW_NUMBER(), LAG(), LEAD(), SUM() OVER(), und Partitionierung mit PARTITION BY.',
 3, 5, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

('Wie wuerde man in SQL eine hierarchische Abfrage (rekursiver CTE) fuer eine Baumstruktur implementieren?',
 'Ein rekursiver CTE besteht aus einem Anker (Startpunkt) und einem rekursiven Teil: WITH RECURSIVE category_tree AS (SELECT id, name, parent_id, 0 as level FROM categories WHERE parent_id IS NULL UNION ALL SELECT c.id, c.name, c.parent_id, ct.level + 1 FROM categories c JOIN category_tree ct ON c.parent_id = ct.id) SELECT * FROM category_tree. Dies traversiert den Baum von der Wurzel und berechnet die Tiefe. Nuetzlich fuer Kategorien, Organisationsstrukturen oder Menuebaeme.',
 3, 5, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80'),

-- Expert (1)
('Wie wuerden Sie eine komplexe Reporting-Abfrage optimieren, die mehrere JOINs, Aggregationen und Subqueries enthaelt und langsam ist?',
 'Optimierungsschritte: 1. EXPLAIN ANALYZE nutzen, um den Query Plan zu verstehen. 2. Passende Indizes auf JOIN-Spalten und WHERE-Bedingungen erstellen. 3. Subqueries durch JOINs oder CTEs ersetzen, wenn moeglich. 4. Fruehes Filtern: WHERE-Bedingungen so frueh wie moeglich anwenden, bevor gejoined wird. 5. Nur benoetigte Spalten selektieren. 6. Materialized Views fuer haeufig abgefragte Reports erwaegen. 7. Bei sehr grossen Datenmengen: Partitionierung der Tabelle oder Pre-Aggregation in Staging-Tabellen. 8. Datenbankstatistiken aktualisieren (ANALYZE).',
 4, 5, '{}', 'bb47e3bb-600c-4218-a842-d16978894d80');


-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Part 1:  1 new Fachbereich (Allgemein)
-- Part 2:  10 new Themenkomplexe
-- Part 3a: 12 questions (C# OOP)
-- Part 3b: 12 questions (C# Fehlerbehandlung)
-- Part 3c: 13 questions (C# LINQ & Collections)
-- Part 3d: 11 questions (C# Async/Await)
-- Part 3e: 12 questions (API/REST)
-- Part 3f: 12 questions (Git / Versionskontrolle)
-- Part 3g: 12 questions (Security)
-- Part 3h: 11 questions (Deployment / CI-CD)
-- Part 3i: 12 questions (Datenbankdesign & Normalisierung)
-- Part 3j: 12 questions (Unit Testing)
-- Part 4a: 10 questions (C# General, existing topic_id=1)
-- Part 4b: 12 questions (SQL Queries, existing topic_id=5)
-- ============================================================================
-- TOTAL: 141 new questions
-- ============================================================================
