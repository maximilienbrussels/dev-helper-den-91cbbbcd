# Eén account, twee omgevingen: .site (desktop) en .app (veld)

Doel: wie op de beheersite mag werken, kan met exact hetzelfde profiel en dezelfde rechten inloggen op de mobiele veld-app. Alleen de schermen verschillen: de telefoon blijft licht en minimalistisch, het zware werk blijft op desktop.

## Wat er nu misgaat

De toegangspoort van beide omgevingen kijkt alleen naar de tabel `portal_admins`. Wie zijn rechten via de rollenlijst heeft (eigenaar, super-admin, medewerker, team) staat daar niet altijd in en wordt dan geweigerd — ook al werkt de beheersite verder wel, want die gebruikt voor de rechten zelf een tweede, ruimere controle. Twee verschillende bronnen, dus tegenstrijdige antwoorden. Dezelfde beperkte controle zit ook in de e-mailstromen (inlogcode, wachtwoord vergeten, activatie), waardoor teamleden geen mail krijgen.

## Aanpak

### 1. Eén toegangscontrole voor alles
- Nieuwe gedeelde controle op de server: toegang wanneer iemand vaste eigenaar is, een actieve rij in `portal_admins` heeft, een rol in de rollenlijst heeft, óf minstens één recht uit de rechtenmatrix.
- De poort van het beheerportaal én van de veld-app gebruiken die ene controle, en geven meteen rol + rechten terug.
- Dezelfde controle wordt gebruikt door de e-mailstromen: inlogcode, wachtwoord vergeten en accountactivatie erkennen nu ieder teamlid, niet enkel adressen uit `portal_admins`.
- Gevolg: nooit meer "geen rechten" op de telefoon voor iemand die op desktop wel binnen mag.

### 2. Rechten blijven volledig op de telefoon
- De veld-app knipt geen rollen weg. Beheerders houden hun volledige rechten; de app toont enkel minder schermen.
- Knoppen en tegels op de veldschermen volgen dezelfde rechtenmatrix als de desktop (verbergen, niet blokkeren).
- In "Meer" blijft de doorlink naar het volledige beheer op desktop staan.

### 3. Aanmelden werkt identiek op beide adressen
- De veld-app gebruikt exact dezelfde aanmeldpagina en dezelfde serverfuncties; de sessie wordt op de telefoon bewaard en blijft na herstarten van de app geldig.
- Mails (inloglink, herstel, activatie) verwijzen altijd naar het adres waar de aanvraag vandaan kwam: een aanvraag vanuit de app opent de app, niet de desktopsite.
- Na aanmelden landt iedereen op de juiste startpagina van zijn omgeving: veld → Vandaag in de app, beheer → Vandaag op desktop. Dit geldt ook voor Google-aanmelding, herstel en inloglink.
- Extra gemak: op desktop een knop "Openen in de veld-app" die met een eenmalige, kort geldige inloglink naar de app springt, zodat je daar niet opnieuw hoeft in te typen. (Browsers houden opslag per domein gescheiden; één keer aanmelden per adres blijft dus nodig zonder zo'n link.)

### 4. Veld-app blijft minimalistisch
- Vijf tabbladen: Vandaag, Aanvragen, Scan, Diensten, Meer. Zwaar beheer (rechten, sjablonen, media, instellingen) blijft desktop.
- Grote raakvlakken (minstens 48 px), weinig tekst, snelle acties.

### 5. Bouwen en installeren opruimen (openstaand van eerder)
- De bouwwaarschuwing rond de aanmeldschil oplossen en de bundels splitsen, zodat de telefoon geen zware beheeronderdelen meelaadt.
- In de voettekst een klein, discreet installatiepictogram naast "© 2026 Maximilien" dat de installatievraag van de browser opent en zichzelf verbergt als de app al geïnstalleerd is; het opdringerige venster verdwijnt.

## Technische details

- Nieuwe helper in `src/lib/permission-core.server.ts`: `resolveTeamAccess()` bovenop `resolveAccess()` + `loadGrantedPermissions()`; geeft `{ allowed, email, role, permissions, fullAccess }`.
- `src/lib/portal-access.functions.ts` → `checkPortalAccess` gebruikt die helper (huidige `portal_admins`-only query vervalt) en levert ook de rechten mee.
- `src/lib/activation.server.ts` (`isWhitelistedEmail`) en `src/lib/auth-email.functions.ts` (`isStaffEmail`) gebruiken dezelfde helper.
- `src/routes/veld.tsx` en `src/routes/_authenticated/route.tsx` blijven op `checkPortalAccess`, nu met identiek antwoord.
- `src/lib/google-oauth.server.ts` → `landingPathForRole` wordt modusbewust (veldhostnaam → `/veld`), en `requestTeamMagicLink` gebruikt `postLoginPathFor` in plaats van het vaste `/nl/vandaag`.
- `src/lib/auth.tsx` → `takeRedirect()` valt terug op `postLoginPathFor(resolveAppMode())` in plaats van `/account`.
- Eenmalige overstap: bestaande `redeemAuthToken` / `/inloglink` hergebruiken; nieuwe serverfunctie geeft een korte token + `https://maximilien.app/inloglink?...`.
- `vite.config.ts`: `manualChunks` voor react/router, UI, database-lagen; veldbundel zonder beheerpagina's via `VITE_APP_MODE`.
- Voettekst: `beforeinstallprompt` opvangen in een klein component in `src/components/SiteFooter.tsx`.
- Controle: `bunx tsgo --noEmit`, `bun run build:dev`, plus een aanmeldtest op smalle breedte.
