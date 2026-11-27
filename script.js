const LINKEDIN_URL = 'https://www.linkedin.com/feed/';
const ARTWORK_URL = 'public/artwork.png';
const ARTWORK_FILE = 'i-am-attending.png';
const steps = {
  rsvp: document.getElementById('rsvp-step'),
  decline: document.getElementById('decline-step'),
  share: document.getElementById('share-step'),
};

function showStep(name) {
  Object.entries(steps).forEach(([key, element]) => { element.hidden = key !== name; });
  const step = name === 'share' ? '02' : '01';
  document.getElementById('step-count').textContent = step;
  document.getElementById('preview-stage').textContent = `PREVIEW / ${step}`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('rsvp-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const name = document.getElementById('guest-name').value.trim();
  const company = document.getElementById('guest-company').value.trim();
  if (!name || !company) return;
  if (new FormData(form).get('attendance') === 'no') {
    document.getElementById('decline-name').textContent = name;
    showStep('decline');
  } else showStep('share');
});

let artworkBlob = null;
async function downloadImage() {
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

document.getElementById('download-image').addEventListener('click', downloadImage);

document.getElementById('share-image').addEventListener('click', () => {
  const downloaded = downloadImage();
  const linkedIn = window.open(LINKEDIN_URL, '_blank');
  if (linkedIn) linkedIn.opener = null;
  else downloaded.finally(() => setTimeout(() => window.location.assign(LINKEDIN_URL), 600)); // popup blocked: let the download start first
});

document.querySelectorAll('[data-action="start-over"]').forEach(button => button.addEventListener('click', () => showStep('rsvp')));
