const steps = {
  rsvp: document.getElementById('rsvp-step'),
  decline: document.getElementById('decline-step'),
  photo: document.getElementById('photo-step'),
  share: document.getElementById('share-step'),
};
const canvas = document.getElementById('result-canvas');
const context = canvas.getContext('2d');
const video = document.getElementById('camera-video');
let stream = null;
let guest = { name: '', company: '' };

function showStep(name) {
  Object.entries(steps).forEach(([key, element]) => { element.hidden = key !== name; });
  document.getElementById('step-count').textContent = name === 'rsvp' || name === 'decline' ? '01' : name === 'photo' ? '02' : '03';
  document.getElementById('preview-stage').textContent = `PREVIEW / ${name === 'share' ? '03' : name === 'photo' ? '02' : '01'}`;
  if (name !== 'photo') stopCamera();
  if (name !== 'share') {
    canvas.hidden = true;
    document.getElementById('placeholder-frame').hidden = false;
    document.getElementById('preview-caption').textContent = 'Your photo, name and company will appear here.';
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('rsvp-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  guest = {
    name: document.getElementById('guest-name').value.trim(),
    company: document.getElementById('guest-company').value.trim(),
  };
  if (!guest.name || !guest.company) return;
  if (new FormData(form).get('attendance') === 'no') {
    document.getElementById('decline-name').textContent = guest.name;
    showStep('decline');
  } else showStep('photo');
});

function stopCamera() {
  if (stream) stream.getTracks().forEach(track => track.stop());
  stream = null;
  video.srcObject = null;
  video.hidden = true;
  document.getElementById('camera-placeholder').hidden = false;
  document.getElementById('open-camera').hidden = false;
  document.getElementById('capture-photo').hidden = true;
}

document.getElementById('open-camera').addEventListener('click', async () => {
  const error = document.getElementById('camera-error');
  error.hidden = true;
  try {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera unavailable');
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    video.srcObject = stream;
    await video.play();
    video.hidden = false;
    document.getElementById('camera-placeholder').hidden = true;
    document.getElementById('open-camera').hidden = true;
    document.getElementById('capture-photo').hidden = false;
  } catch {
    stopCamera();
    error.textContent = 'Camera access is unavailable. You can upload a photo instead.';
    error.hidden = false;
  }
});

document.getElementById('capture-photo').addEventListener('click', () => {
  if (!video.videoWidth) return;
  const photo = document.createElement('canvas');
  photo.width = video.videoWidth;
  photo.height = video.videoHeight;
  const photoContext = photo.getContext('2d');
  photoContext.translate(photo.width, 0);
  photoContext.scale(-1, 1);
  photoContext.drawImage(video, 0, 0);
  createImage(photo);
});

document.getElementById('photo-upload').addEventListener('change', async event => {
  const file = event.target.files?.[0];
  if (!file) return;
  const error = document.getElementById('camera-error');
  try {
    const image = await createImageBitmap(file);
    createImage(image);
    image.close();
    error.hidden = true;
  } catch {
    error.textContent = 'That image could not be opened. Please choose another photo.';
    error.hidden = false;
  }
  event.target.value = '';
});

function drawCover(source, x, y, width, height) {
  const sourceWidth = source.width || source.videoWidth;
  const sourceHeight = source.height || source.videoHeight;
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  context.save();
  context.beginPath();
  context.rect(x, y, width, height);
  context.clip();
  context.drawImage(source, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
  context.restore();
}

function fitText(text, maxWidth, initialSize, weight = 600) {
  let size = initialSize;
  do {
    context.font = `${weight} ${size}px Oswald, sans-serif`;
    if (context.measureText(text).width <= maxWidth) break;
    size -= 2;
  } while (size > 30);
  return size;
}

function createImage(photo) {
  const width = canvas.width;
  const height = canvas.height;
  context.fillStyle = '#e85d36';
  context.fillRect(0, 0, width, height);
  context.fillStyle = '#ffffff';
  context.textBaseline = 'top';
  context.font = '600 106px Oswald, sans-serif';
  context.fillText('THE', 58, 49);
  context.fillText('GATHERING ✳', 58, 145);
  context.textAlign = 'right';
  context.font = '700 18px "DM Sans", sans-serif';
  context.fillText('A MOMENT', 1022, 62);
  context.fillText('TO REMEMBER', 1022, 89);
  context.textAlign = 'left';
  drawCover(photo, 58, 281, 964, 800);
  context.fillStyle = '#ffffff';
  const name = guest.name.toUpperCase();
  fitText(name, 900, 82);
  context.fillText(name, 58, 1114);
  context.font = '500 33px Oswald, sans-serif';
  context.fillText(guest.company.toUpperCase(), 58, 1211, 760);
  context.textAlign = 'right';
  context.font = '600 27px Oswald, sans-serif';
  context.fillText('SEE YOU THERE ↗', 1022, 1254);
  context.textAlign = 'left';
  showStep('share');
  canvas.hidden = false;
  document.getElementById('placeholder-frame').hidden = true;
  document.getElementById('preview-caption').textContent = 'Your personalized event image is ready.';
}

function imageBlob() {
  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}

document.getElementById('download-image').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `the-gathering-${guest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

document.getElementById('share-image').addEventListener('click', async () => {
  const feedback = document.getElementById('share-feedback');
  feedback.hidden = true;
  const blob = await imageBlob();
  if (!blob) return;
  const file = new File([blob], 'the-gathering.png', { type: 'image/png' });
  try {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: 'The Gathering' });
    } else if (navigator.clipboard?.write && window.ClipboardItem) {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      feedback.textContent = 'Image copied. Paste it wherever you’d like to share it.';
      feedback.hidden = false;
    } else {
      feedback.textContent = 'Sharing is unavailable in this browser. Download the image to share it.';
      feedback.hidden = false;
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      feedback.textContent = 'Sharing did not work. Download the image to share it.';
      feedback.hidden = false;
    }
  }
});

document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
  const action = button.dataset.action;
  if (action === 'start-over' || action === 'back-rsvp') showStep('rsvp');
  if (action === 'change-photo') showStep('photo');
}));
