# The Gathering microsite

Run `npm start`, then open <http://localhost:3000>.

Guests enter their name, company, and attendance response for this browser visit only. Responses are not sent to a server or saved after a refresh. Attendees can take or upload a photo, then download or share a personalized PNG. Photos are processed in the browser.

The site deploys to Vercel as static files without a build step or storage service.

The event title, artwork, and copy are placeholders. Edit `index.html`, `styles.css`, and the canvas drawing in `script.js` to match your event. Camera access requires localhost or HTTPS. Native image sharing depends on browser support; the site offers clipboard copy or download as a fallback.
