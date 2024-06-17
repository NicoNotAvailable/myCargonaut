# KMS-Projekt Cargonaut

CS2016 Praktikum Konzepte moderner Softwareentwicklung\
Sommersemester 24\
**Gruppe 4:** Ganswint Stefan, Schäfer Annalena, Hofmann Nico, Fimmen, Fabian, Haser Tina, Mutig Alexander, Moustafa Chasan \
https://moodle.thm.de/course/view.php?id=3301

Dies ist das README-Dokument für das KMS-Projekt, das im Rahmen der Prüfungsleistung entwickelt wird. In diesem Projekt werden die folgenden Anforderungen umgesetzt:

## Anforderungen

- Registrierung:
    - Vorname, Nachname, Email (zweimal angeben), Passwort, Geburtstag (nur ab 18+)
    - Sobald man Angebot erstellen will zusätzlich: Handynummer (unsichtbar), Bild


- Login:
    - Mit Email und Passwort


- Suche:
    - Nach Angebot
    - Nach Gesuch
    - Von/Bis, Datum, Fracht (Gewicht/Maße), Nach Bewertung, Anzahl verfügbare Plätze


- Profilansicht:
    - Nur für registrierte Benutzer
    - Öffentlich: Vorname, Nachname (Erster Buchstabe), Bild, Alter, zusätzliche Notiz,
      Bewertungen, Anzahl Fahrten(Angeboten/Gesuch),
    - Erfahrung Messen an: Anzahl Mitfahrer, Anzahl Gewicht (von Elefant bis Todesstern),
      Strecke, Sprachen, Raucher


- Benutzer-/Fahrzeugverwaltung:
    - Profil editierbar, siehe Profilansicht (Attribute)
    - Fahrzeug editierbar
    - Sonderfunktionen (z.B. Kühlung), Gewicht, Maße


- Bewertung
    - Nach erfolgter Fahrt
    - 5-Sterne-Skala (5 Sterne entsprechen der besten, 1 Stern der schlechtesten
      Bewertung)
    - Nach einer Fahrt werden alle Teilnehmer aufgefordert, sich gegenseitig zu bewerten.
      Fahrer bewerten dabei ihre Mitfahrer, Mitfahrer ihre Fahrer. Bewertungen können
      nur bei Fahrten vorgenommen werden, die nicht storniert wurden. Dabei sind jeweils
      drei Fragen zu beantworten:


- Bewertung der Fahrer durch die Mitfahrer
    - War der Fahrer pünktlich? (+/- 5 Minuten)
    - Hat sich der Fahrer an alle Abmachungen gehalten? (Treffpunkt usw.)
    - Haben Sie sich bei der Fahrt wohl gefühlt?
    - Ist die Fracht unbeschadet angekommen?


- Bewertung der Mitfahrer durch die Fahrer
    - War der Mitfahrer pünktlich? (+/- 5 Minuten)
    - Hat sich der Mitfahrer an alle Abmachungen gehalten? (Treffpunkt
      usw.)
    - Haben Sie den Mitfahrer gerne mitgenommen?


- Bewertung erst sichtbar, wenn alle Beteiligten bewertet haben


- Angebot/Gesuch erstellen
    - Ablauf:
        1. Feste Zusage per Button auf der Plattform inkl. Zahlungsvorgang
        2. Möglichkeit der Kommunikation per Telefon/Nachrichten
        3. Nach der Fahrt (Bewertung des Fahrers/Mitfahrers)
        4. Speichern aller Daten für statistische Zwecke
    - Von/Bis/Zwischenziele, Zeitraum, Fahrzeug/Anhänger auswählen
    - Verfügbar: Gewicht/Maß/Sitzplätze, Preis fest pro Person/Fracht verhandelbar
    - Einschränkungen: Nehme keine Tiere mit, Nichtraucher
    - Info/Hinweis: höre gerne Musik, Unterhalte mich gern, richte mich nach Mitfahrern
    - Informationen über Fahrzeug/Anhänger


- Preisgestaltung
    - Angebote und Gesuche sind kostenlos, aber sobald eine Fahrt zustande kommt, muss
      der Mitfahrer an die Plattform den festgelegten Preis zahlen. Auszahlung erfolgt nach
      Abschluss der Fahrt abzüglich unserer Vermittlungsgebühr.
    - Festpreis: Angebot/Gesuch z.B. 5€
    - Variabler Preis: Angebot/Gesuch abhängig von Personenzahl/Gewicht (verfügbar)


- Tracking
    - Fahrer kann Standort mitteilen
    - Status kann dann abgefragt werden


- Zusätzlich wird eine OpenAPI (Swagger)-Dokumentation implementiert, um die API-Routen zu testen. Die DTOs (Data Transfer Objects) werden mit den OpenAPI-Decorators ausgestattet.

## Technologien und Anforderungen

Das Projekt erfüllt die folgenden technischen und fachlichen Anforderungen:

1. Frontend-Framework: Angular
2. Backend-Framework: Das Backend wird mit NestJS entwickelt.
3. Datenbank: Die Daten werden mit TypeORM und SQLite persistiert.
4. Websockets: Websockets werden verwendet, um eine benutzerfreundliche Erfahrung zu bieten.
5. Autorisierung: Es wird eine passende Autorisierung mit Sessions und Rechten implementiert.
6. Statische Route: Das Frontend ist über eine statische Route von NestJS aus erreichbar, um das NestJS Session-System zu ermöglichen.


## Installation und Ausführung

Folgende Schritte sind erforderlich, um das Projekt lokal zum Laufen zu bringen:

## Allgemein:
1. Klone das Repository auf deinen lokalen Computer.
2. Gehe in das Verzeichnis des Frontend-Projekts (Angular) `cd myCargonaut-client` und führe die entsprechenden Befehle zur Installation der Abhängigkeiten aus `npm install`.
3. Gehe in das Verzeichnis des Backend-Projekts (NestJS)  `cd myCargonaut-server` und führe die Befehle zur Installation der Abhängigkeiten aus  `npm install`.
4. Um volle Funktionen zu erhalten musst du die nächsten Schritte durchführen.




## Frontend (nach der Installation):
1. Gehe in das Verzeichnis des Frontend-Projekts (Angular) `cd myCargonaut-client`
2. Nach der Instalation wird das Frontend mit  `npm run start` gestartet.
3. Navigiere nun in deinem Browser an folgende Adresse: http://localhost:4200
4. Stelle sicher, dass eine lokale SQLite-Datenbank vorhanden ist und konfiguriere die Verbindungsinformationen im Backend.



## Backend (nach der Installation):
1. Gehe in das Verzeichnis des Backend-Projekts (NestJS)  `cd myCargonaut-server`
2. Nach der Instalation wird das Backend mit  `npm run start` gestartet.
3. Um die Funktionen des Backends zu Testen Navigiere nun in deinem Browser an folgende Adresse: http://localhost:8000/api


# KMS-Projekt Cargonaut

CS2016 Praktikum Konzepte moderner Softwareentwicklung  
Sommersemester 24  
**Gruppe 4:** Ganswint Stefan, Schäfer Annalena, Hofmann Nico, Fimmen Fabian, Haser Tina, Mutig Alexander, Moustafa Chasan  
[Projektseite](https://moodle.thm.de/course/view.php?id=3301)

This is the README document for the KMS project, developed as part of the examination performance. The following requirements are implemented in this project:

## Requirements

- **Registration:**
    - First name, Last name, Email (entered twice), Password, Date of birth (only 18+)
    - Additionally, when creating an offer: Phone number (hidden), Picture

- **Login:**
    - With email and password

- **Search:**
    - By offer
    - By request
    - From/To, Date, Cargo (weight/dimensions), By rating, Number of available seats

- **Profile View:**
    - Only for registered users
    - Public: First name, Last name (initial letter), Picture, Age, Additional note, Ratings, Number of rides (offered/requested)
    - Experience measured by: Number of co-riders, Weight carried (from elephant to Death Star), Distance, Languages, Smoking status

- **User/Vehicle Management:**
    - Profile editable, see Profile View (attributes)
    - Vehicle editable
    - Special features (e.g., cooling), Weight, Dimensions

- **Rating:**
    - After a ride
    - 5-star scale (5 stars being the best, 1 star the worst rating)
    - After a ride, all participants are prompted to rate each other. Drivers rate their co-riders, and co-riders rate their drivers. Ratings can only be given for rides that were not canceled. Three questions are to be answered:

- **Driver Rating by Co-riders:**
    - Was the driver punctual? (+/- 5 minutes)
    - Did the driver follow all agreements? (meeting point, etc.)
    - Did you feel comfortable during the ride?
    - Did the cargo arrive undamaged?

- **Co-rider Rating by Drivers:**
    - Was the co-rider punctual? (+/- 5 minutes)
    - Did the co-rider follow all agreements? (meeting point, etc.)
    - Did you enjoy having the co-rider?

- Ratings are only visible when all parties have rated each other.

- **Creating Offer/Request:**
    - Process:
        1. Firm commitment via button on the platform including payment process
        2. Possibility of communication via phone/messages
        3. After the ride (rating of driver/co-rider)
        4. Saving all data for statistical purposes
    - From/To/Interim destinations, Time period, Select vehicle/trailer
    - Available: Weight/Dimensions/Seats, Fixed price per person/cargo negotiable
    - Restrictions: No animals, Non-smoking
    - Info/Note: Enjoys music, Likes to chat, Adapts to co-riders
    - Information about vehicle/trailer

- **Pricing:**
    - Offers and requests are free, but once a ride takes place, the co-rider must pay the set price to the platform. Payout occurs after the ride, minus our commission fee.
    - Fixed price: Offer/Request e.g., €5
    - Variable price: Offer/Request dependent on number of people/weight (available)

- **Tracking:**
    - Driver can share location
    - Status can then be queried

- Additionally, an OpenAPI (Swagger) documentation is implemented to test the API routes. The DTOs (Data Transfer Objects) are equipped with OpenAPI decorators.

## Technologies and Requirements

The project meets the following technical and functional requirements:

1. **Frontend Framework:** Angular
2. **Backend Framework:** Developed with NestJS
3. **Database:** Persisting data with TypeORM and SQLite
4. **Websockets:** Used to provide a user-friendly experience
5. **Authorization:** Suitable authorization with sessions and rights implemented
6. **Static Route:** Frontend accessible via a static route from NestJS to enable the NestJS session system

## Installation and Execution

The following steps are required to run the project locally:

### General:
1. Clone the repository to your local computer.
2. Navigate to the frontend project directory (Angular) `cd myCargonaut-client` and run the commands to install dependencies `npm install`.
3. Navigate to the backend project directory (NestJS) `cd myCargonaut-server` and run the commands to install dependencies `npm install`.
4. To obtain full functionality, proceed with the next steps.

### Frontend (after installation):
1. Navigate to the frontend project directory (Angular) `cd myCargonaut-client`
2. Start the frontend with `npm run start`.
3. Open your browser and navigate to: [http://localhost:4200](http://localhost:4200)
4. Ensure a local SQLite database is available and configure the connection information in the backend.

### Backend (after installation):
1. Navigate to the backend project directory (NestJS) `cd myCargonaut-server`
2. Start the backend with `npm run start`.
3. To test the backend functions, open your browser and navigate to: [http://localhost:8000/api](http://localhost:8000/api)


# MyCargonautClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# How to start SonarQube

## A little ToDo-List to get your Project started

Run "npm i" on the package.json of "myCargonaut-client", "myCargonaut-server" and in the root folder
> npm i

## Sonar-Qube

Regularly send your current code status to the SonarQube Server with
> npx sonar-scanner