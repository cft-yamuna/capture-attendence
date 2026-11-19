# The Gathering microsite

Run `npm start`, then open <http://localhost:3000>.

Guests enter their name, company, and attendance response. Locally, responses are saved to `rsvps.json`. On Vercel, responses are saved as private JSON objects in a connected Vercel Blob store; changing a response overwrites its existing object. Attendees can take or upload a photo, then download or share a personalized PNG. Photos are processed in the browser and are not stored by the server.

For Vercel deployment, connect a **private** Blob store to the project so `BLOB_READ_WRITE_TOKEN` is available to the API function. The static site and `api/rsvp.js` deploy from this repository without a build step.

The event title, artwork, and copy are placeholders. Edit `index.html`, `styles.css`, and the canvas drawing in `script.js` to match your event. Camera access requires localhost or HTTPS. Native image sharing depends on browser support; the site offers clipboard copy or download as a fallback.
