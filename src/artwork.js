export const ARTWORK_URL = '/artwork.png';
const ARTWORK_FILE = 'i-am-attending.png';
const LINKEDIN_URL = 'https://www.linkedin.com/feed/';

let artworkFile = null;
let artworkRequest = null;

// Fetch ahead of the click: navigator.share must run while the tap still counts as a user gesture,
// and Safari drops that gesture if we await a network request first.
export function preloadArtwork() {
  artworkRequest ??= fetch(ARTWORK_URL)
    .then(response => {
      if (!response.ok) throw new Error(`Artwork request failed: ${response.status}`);
      return response.blob();
    })
    .then(blob => (artworkFile = new File([blob], ARTWORK_FILE, { type: 'image/png' })))
    .catch(error => {
      artworkRequest = null;
      throw error;
    });
  return artworkRequest;
}

export async function downloadImage() {
  const file = artworkFile ?? (await preloadArtwork());
  const url = URL.createObjectURL(file);
  const link = Object.assign(document.createElement('a'), { href: url, download: ARTWORK_FILE });
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function canShareImage() {
  return Boolean(artworkFile && navigator.canShare?.({ files: [artworkFile] }));
}

// Returns 'shared', 'cancelled' or 'downloaded' so the UI can tell the guest what happened.
export async function shareOnLinkedIn() {
  if (canShareImage()) {
    try {
      // Files only: adding text or a url makes some share targets (LinkedIn on Android) drop the image.
      await navigator.share({ files: [artworkFile] });
      return 'shared';
    } catch (error) {
      if (error.name === 'AbortError') return 'cancelled';
      // Any other failure falls through to the download flow.
    }
  }
  const linkedIn = window.open(LINKEDIN_URL, '_blank');
  if (linkedIn) linkedIn.opener = null;
  await downloadImage();
  if (!linkedIn) setTimeout(() => window.location.assign(LINKEDIN_URL), 600); // popup blocked: let the download start first
  return 'downloaded';
}
