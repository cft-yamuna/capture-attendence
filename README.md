# Axis Bank Start-Up Social RSVP microsite

A React + Vite site. Run `npm install`, then `npm run dev`, and open the URL Vite prints (usually <http://localhost:5173>).

Guests enter their name, company, and attendance response. Each response is saved to the `rsvps` table in Supabase before the next step appears; if saving fails, the form shows an error and the guest can try again. Guests who are attending can download the event's I Am Attending artwork (`public/artwork.png`); every guest shares the same image. The LinkedIn button downloads that image and opens LinkedIn's post composer (`linkedin.com/feed/?shareActive=true`) in a new browser tab (or in the same tab, once the download has started, if pop-ups are blocked). Visitors then add a photo and select the downloaded image. If they aren't signed in, LinkedIn asks them to sign in first. The site never shares a link or uploads the image.

## Supabase setup

1. In the Supabase SQL editor, run [`supabase/schema.sql`](supabase/schema.sql). It creates the `rsvps` table and a row-level security policy that lets visitors add a response but not read, change or delete any.
2. Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Project Settings → API. Use the anon key, never the service_role key: values starting with `VITE_` are built into the public JavaScript.
3. On Vercel, add the same two variables under Project Settings → Environment Variables, then redeploy. Vite reads them at build time.

View responses in the Supabase Table Editor.

## Deploying

`vercel.json` builds with `npm run build` and serves the `dist` folder. LinkedIn's website does not accept an image file directly from another site, so attaching the downloaded image is a manual step.

The flow has three screens, built from the designs for desktop and mobile: **Save your seat** (RSVP form, shows the invitation card `public/invite.png`), **You’re in** and **Spread the Word** (both show the I Am Attending frame `public/artwork.png`). Guests who choose “Can’t make it” see a short thank-you screen instead. The header logo is `public/axis-logo.png`.

To change the shared image, replace `public/artwork.png`. Copy lives in `src/App.jsx`; styles and breakpoints in `src/styles.css`.
