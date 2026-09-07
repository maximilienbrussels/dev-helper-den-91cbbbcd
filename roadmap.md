# Project roadmap

## Import & 3-tier architectuur
- [x] Importeer dev-helper-den repository
- [ ] Zorg dat import stabiel blijft na build/dev-server restart
- [ ] Publieke site (maximilien.brussels) werkend
- [ ] Desktop manager (maximilien.site / manager.maximilien.brussels) werkend
- [ ] Mobiele veld PWA (maximilien.app) werkend

## Mobiele veld PWA (maximilien.app)
- [ ] Complete manifest.json + icons voor "Add to Home Screen"
- [ ] Service worker met offline caching (veld-build)
- [ ] Bottom navigation: Vandaag, Aanvragen, Scanner (center), Diensten, Meer
- [ ] Vandaag: dagelijkse agenda
- [ ] Aanvragen: actieve orders / aanvragen
- [ ] Scanner: continue camera stream, zaklamp toggle, 6-teken fallback, auto-reset, print
- [ ] Diensten: gestroomlijnde lijst
- [ ] Meer: popup menu
- [ ] Geen horizontaal scrollen, grote touch targets
- [ ] Mobiel geoptimaliseerd voor Samsung

## Unified backend
- [ ] Neon PostgreSQL database gekoppeld
- [ ] Gedeelde authenticatie over public/admin/field
- [ ] WebAuthn passkeys
- [ ] Google / GitHub / Mastodon / Bluesky identity providers
- [ ] CORS/oorsprongen correct voor 3 domeinen

## Secrets & API keys
- [ ] DATABASE_URL
- [ ] Brevo API key
- [ ] Scaleway S3 keys
- [ ] Stripe keys
- [ ] OAuth client secrets per provider
