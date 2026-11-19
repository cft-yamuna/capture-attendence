# The Gathering microsite

Run `npm start`, then open <http://localhost:3000>.

Guests enter their name, company, and attendance response for this browser visit only. Responses are not sent to a server or saved after a refresh. Attendees can take or upload a photo, then download a personalized PNG. The LinkedIn button uploads a 1200×627 share preview and opens LinkedIn with that image as a link preview. The full-size PNG stays available from Download image.

The site deploys to Vercel with static files and two API functions. Connect a **public Vercel Blob store** to the project so `BLOB_READ_WRITE_TOKEN` is available to the functions. Uploaded previews are public to anyone with their unlisted URL and automatically expire after seven days. LinkedIn may keep its own cached copy after expiration. This creates a link post preview, not an attached photo post.

The event title, artwork, and copy are placeholders. Edit `index.html`, `styles.css`, and the canvas drawing in `script.js` to match your event. Camera access requires localhost or HTTPS.
