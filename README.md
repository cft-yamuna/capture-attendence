# The Gathering microsite

Run `npm start`, then open <http://localhost:3000>.

Guests enter their name, company, and attendance response for this browser visit only. Responses are not sent to a server or saved after a refresh. Attendees can take or upload a photo, then download a personalized PNG. The LinkedIn button shares that PNG as a file through the phone's native share sheet, where the visitor selects LinkedIn. No link or image is uploaded by the site. Browsers without file sharing can use Download image and attach it in LinkedIn.

The site deploys to Vercel as static files. Sharing uses the browser's Web Share API and requires a browser that supports sharing image files.

The event title, artwork, and copy are placeholders. Edit `index.html`, `styles.css`, and the canvas drawing in `script.js` to match your event. Camera access requires localhost or HTTPS.
