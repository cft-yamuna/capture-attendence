# The Gathering microsite

Run `npm start`, then open <http://localhost:3000>.

Guests enter their name, company, and attendance response for this browser visit only. Responses are not sent to a server or saved after a refresh. Attendees can take or upload a photo, then download a personalized PNG. The site prepares a 1200×627 share preview when the photo is ready. The LinkedIn button is a direct link that a phone can route to the LinkedIn app if its app-link settings allow it; otherwise LinkedIn opens in the browser. The full-size PNG stays available from Download image.

The site deploys to Vercel with static files and API functions. Generated previews are stored in Vercel Runtime Cache for up to seven days; no Blob store or extra credentials are needed. The cache can evict images sooner, so old preview links may stop working. Preview pages and image URLs are public to anyone with their unlisted URL, and LinkedIn may keep its own cached copy. This creates a link post preview, not an attached photo post.

The event title, artwork, and copy are placeholders. Edit `index.html`, `styles.css`, and the canvas drawing in `script.js` to match your event. Camera access requires localhost or HTTPS.
