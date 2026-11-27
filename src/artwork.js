export const ARTWORK_URL = '/artwork.png';
const ARTWORK_FILE = 'i-am-attending.png';
// shareActive=true opens the feed with the "Start a post" composer already open.
const LINKEDIN_URL = 'https://www.linkedin.com/feed/?shareActive=true';

let artworkBlob = null;

async function getArtwork() {
  if (!artworkBlob) {
    const response = await fetch(ARTWORK_URL);
    if (!response.ok) throw new Error(`Artwork request failed: ${response.status}`);
    artworkBlob = await response.blob();
  }
  return artworkBlob;
}

export async function downloadImage() {
  const url = URL.createObjectURL(await getArtwork());
  const link = Object.assign(document.createElement('a'), { href: url, download: ARTWORK_FILE });
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// Download the frame and open LinkedIn's post composer; the guest then adds the saved image.
// Resolves once the download has started, or rejects if the artwork could not be fetched.
export function shareOnLinkedIn() {
  const downloaded = downloadImage();
  // Open synchronously, while the tap still counts as a user gesture, so the tab isn't blocked.
  const linkedIn = window.open(LINKEDIN_URL, '_blank');
  if (linkedIn) linkedIn.opener = null;
  else downloaded.finally(() => setTimeout(() => window.location.assign(LINKEDIN_URL), 600)).catch(() => {}); // popup blocked: let the download start first
  return downloaded;
}
