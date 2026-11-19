# The Gathering microsite

Run `npm start`, then open <http://localhost:3000>.

Guests enter their name, company, and attendance response for this browser visit only. Responses are not sent to a server or saved after a refresh. Attendees can take or upload a photo, then download a personalized PNG. The LinkedIn button shares the PNG through the device share menu; guests choose LinkedIn and **Share in a post**. If file sharing is unavailable, the image downloads and LinkedIn opens for manual attachment. Photos are processed in the browser.

The site deploys to Vercel as static files without a build step or storage service.

The event title, artwork, and copy are placeholders. Edit `index.html`, `styles.css`, and the canvas drawing in `script.js` to match your event. Camera access requires localhost or HTTPS.
