# The Gathering microsite

Run `npm start`, then open <http://localhost:3000>.

Guests enter their name, company, and attendance response for this browser visit only. Responses are not sent to a server or saved after a refresh. Guests who are attending can download the event's I Am Attending artwork (`public/artwork.png`); every guest shares the same image. The LinkedIn button downloads that image and opens LinkedIn in a new browser tab (or in the same tab, once the download has started, if pop-ups are blocked). Visitors then tap Post, choose Photo, and select the downloaded image. The site never shares a link or uploads the image.

The site deploys to Vercel as static files. `vercel.json` sets the output directory to the project root, because Vercel would otherwise serve only the `public` folder. LinkedIn's website does not accept an image file directly from another site, so attaching the downloaded image is a manual step.

To change the shared image, replace `public/artwork.png`. The event title and copy are placeholders. Edit `index.html` and `styles.css` to match your event.
