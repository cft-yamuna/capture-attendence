import { useEffect, useRef, useState } from 'react';
import { ARTWORK_URL, downloadImage, shareOnLinkedIn } from './artwork.js';
import { saveRsvp } from './supabase.js';

const INVITE_URL = '/invite.png';

const CHOICES = [
  ['yes', 'Yes, I’ll be there'],
  ['no', 'Can’t make it'],
];

function Heading({ id, light, bold }) {
  return <h1 id={id}>{light} <strong>{bold}</strong></h1>;
}

function RsvpStep({ guest, onSubmit }) {
  const [form, setForm] = useState(guest);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const update = field => event => setForm({ ...form, [field]: event.target.value });

  async function handleSubmit(event) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const response = { ...form, name: form.name.trim(), company: form.company.trim() };
    if (!response.name || !response.company) return;
    setSaving(true);
    setError('');
    try {
      await saveRsvp(response);
    } catch (saveError) {
      setError(saveError.message);
      setSaving(false);
      return;
    }
    onSubmit(response);
  }

  return (
    <section className="step" aria-labelledby="rsvp-title">
      <p className="kicker">You’re invited</p>
      <Heading id="rsvp-title" light="Save your" bold="seat." />
      <p className="intro">An evening of ideas, innovation and ambition. Tell us you’re coming and get your <span className="accent">I Am Attending</span> frame to share.</p>
      <form onSubmit={handleSubmit}>
        <label className="field">
          <span>Full name</span>
          <input name="name" type="text" autoComplete="name" maxLength={48} placeholder="Your name" required value={form.name} onChange={update('name')} />
        </label>
        <label className="field">
          <span>Company</span>
          <input name="company" type="text" autoComplete="organization" maxLength={48} placeholder="Your company" required value={form.company} onChange={update('company')} />
        </label>
        <fieldset className="attendance">
          <legend>Will you attend?</legend>
          <div className="toggle">
            {CHOICES.map(([value, label]) => (
              <label key={value}>
                <input type="radio" name="attendance" value={value} required checked={form.attendance === value} onChange={update('attendance')} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Continue'}</button>
      </form>
    </section>
  );
}

function ConfirmedStep({ name, onContinue, onBack }) {
  return (
    <section className="step" aria-labelledby="in-title">
      <p className="kicker">You’re invited</p>
      <Heading id="in-title" light="You’re" bold="in." />
      <p className="intro">Thanks, {name}. Here’s your Start-Up Social frame. Let your network know you’re attending.</p>
      <div className="actions">
        <button className="btn btn-primary" type="button" onClick={onContinue}>Continue</button>
        <button className="btn btn-secondary" type="button" onClick={onBack}>Back</button>
      </div>
    </section>
  );
}

function ShareStep() {
  const [notice, setNotice] = useState('');

  async function run(action) {
    setNotice('');
    try {
      await action();
    } catch {
      setNotice('The frame could not be loaded. Check your connection and try again.');
    }
  }

  return (
    <section className="step" aria-labelledby="share-title">
      <p className="kicker">You’re invited</p>
      <Heading id="share-title" light="Spread the" bold="Word." />
      <p className="intro">Download your frame and post it. On LinkedIn: tap <strong>Post</strong>, add a photo, and pick the image you just saved.</p>
      <div className="actions">
        <button className="btn btn-primary" type="button" onClick={() => run(shareOnLinkedIn)}>LinkedIn</button>
        <button className="btn btn-secondary" type="button" onClick={() => run(downloadImage)}>Download frame</button>
      </div>
      {notice && <p className="intro" role="status">{notice}</p>}
    </section>
  );
}

function DeclineStep({ name, onBack }) {
  return (
    <section className="step" aria-labelledby="decline-title">
      <p className="kicker">Response noted</p>
      <Heading id="decline-title" light="We’ll miss" bold="you." />
      <p className="intro">Thanks for letting us know, {name}. We hope to see you at the next Start-Up Social.</p>
      <div className="actions">
        <button className="btn btn-secondary" type="button" onClick={onBack}>Change my response</button>
      </div>
    </section>
  );
}

export default function App() {
  const [step, setStep] = useState('rsvp');
  const [guest, setGuest] = useState({ name: '', company: '', attendance: '' });
  const firstRender = useRef(true);
  const attending = step === 'in' || step === 'share';

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  function handleRsvp(response) {
    setGuest(response);
    setStep(response.attendance === 'no' ? 'decline' : 'in');
  }
  const back = () => setStep('rsvp');

  return (
    <div className="page">
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="./" aria-label="Axis Bank Start-Up Social home">
            <img src="/axis-logo.png" width="349" height="96" alt="Axis Bank" />
          </a>
        </div>
        <svg className="header-notch" viewBox="0 0 260 130" preserveAspectRatio="xMaxYMin meet" aria-hidden="true">
          <path d="M260 32H146c-12 0-21 5-28 14L66 116c-7 9-15 14-28 14V140H260z" fill="#fff" />
        </svg>
      </header>

      <main className="container layout">
        <figure className="frame">
          <img
            src={attending ? ARTWORK_URL : INVITE_URL}
            width="800"
            height="800"
            alt={attending
              ? 'I Am Attending — Axis Bank Start-Up Social frame'
              : 'Axis Bank Start-Up Social — Beyond Software: India’s Deep Tech Moment. 02 December 2026, Bengaluru'}
          />
        </figure>

        <div className="content">
          {step === 'rsvp' && <RsvpStep guest={guest} onSubmit={handleRsvp} />}
          {step === 'in' && <ConfirmedStep name={guest.name} onContinue={() => setStep('share')} onBack={back} />}
          {step === 'share' && <ShareStep />}
          {step === 'decline' && <DeclineStep name={guest.name} onBack={back} />}
        </div>
      </main>
    </div>
  );
}
