# The Gathering microsite

Run `npm start`, then open <http://localhost:3000>.

Guests enter their name, company, and attendance response. Responses are saved to `rsvps.json` in this folder; changing a response updates its existing record. Attendees can take or upload a photo, then download or share a personalized PNG. Photos are processed in the browser and are not stored by the server.

The event title, artwork, and copy are placeholders. Edit `index.html`, `styles.css`, and the canvas drawing in `script.js` to match your event. Camera access requires localhost or HTTPS. Native image sharing depends on browser support; the site offers clipboard copy or download as a fallback.
