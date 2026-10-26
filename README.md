# venue-portal

The client-facing pages for North Star House, published at **https://venue.northstarhouse.org**.

- `/` : the client event page. A client types their venue code (their wedding date, like DEC-28-2026) to see payments, insurance, the wedding questionnaire, brick wording and a message box.
- `/guidebook/` : the Client Guidebook (plain pages, no login).

It's a static site. The event page is a small React bundle (`assets/app.js`, committed) that talks to the Supabase `client-pay` function. Staff tools stay in the separate Portal project.

## Changing the event page
```
npm install
# edit src/venue-client-pay.jsx
npm run build      # rebuilds assets/app.js and stamps index.html
git add -A && git commit && git push
```
Pushing to `main` publishes automatically (GitHub Pages workflow).

## Domain
`CNAME` holds `venue.northstarhouse.org`. DNS: a CNAME record `venue` pointing to `northstarhouse.github.io` (DNS is hosted at IONOS).
