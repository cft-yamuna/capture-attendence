export const ARTWORK_URL = '/artwork.png';
const ARTWORK_FILE = 'i-am-attending.png';
const LINKEDIN_URL = 'https://www.linkedin.com/feed/';

let artworkBlob = null;

export async function downloadImage() {
  if (!artworkBlob) {
    const response = await fetch(ARTWORK_URL);
    if (!response.ok) throw new Error(`Artwork request failed: ${response.status}`);
    artworkBlob = await response.blob();
  }
  const url = URL.createObjectURL(artworkBlob);
  const link = Object.assign(document.createElement('a'), { href: url, download: ARTWORK_FILE });
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function shareOnLinkedIn() {
  const downloaded = downloadImage();
  const linkedIn = window.open(LINKEDIN_URL, '_blank');
  if (linkedIn) linkedIn.opener = null;
  else downloaded.finally(() => setTimeout(() => window.location.assign(LINKEDIN_URL), 600)); // popup blocked: let the download start first
}
