# The Gathering microsite

Run `npm start`, then open <http://localhost:3000>.

Guests enter their name, company, and attendance response for this browser visit only. Responses are not sent to a server or saved after a refresh. Attendees can take or upload a photo, then download a personalized PNG. The LinkedIn button downloads that PNG and opens LinkedIn in a new browser tab. Visitors then tap Post, choose Photo, and select the downloaded image. The site never shares a link or uploads the image.

The site deploys to Vercel as static files. LinkedIn's website does not accept an image file directly from another site, so attaching the downloaded image is a manual step.

The event title, artwork, and copy are placeholders. Edit `index.html`, `styles.css`, and the canvas drawing in `script.js` to match your event. Camera access requires localhost or HTTPS.
