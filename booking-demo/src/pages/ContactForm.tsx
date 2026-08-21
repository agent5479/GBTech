import { useState, type FormEvent } from 'react';
import { FORM_ENDPOINT } from '../data/formConfig';
import { IS_SHOWCASE_MODE } from '@shared/showcaseMode';

const ENQUIRY_TOPICS = IS_SHOWCASE_MODE
  ? [
      { value: 'general', label: 'General enquiry' },
      { value: 'equipment', label: 'Equipment hire question' },
      { value: 'other', label: 'Other' },
    ]
  : [
      { value: 'general', label: 'General enquiry' },
      { value: 'allotment', label: 'Allotment interest' },
      { value: 'equipment', label: 'Equipment hire question' },
      { value: 'other', label: 'Other' },
    ];

export default function ContactForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [topic, setTopic] = useState('general');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'enquiry',
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          organisation: organisation.trim(),
          topic,
          category: topic === 'allotment' ? 'allotment-enquiry' : 'facility',
          message: message.trim(),
          website: '',
        }),
      });
      const data = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || !data.success) {
        setError(data.message || 'Could not send enquiry.');
        return;
      }
      setSuccess(true);
    } catch {
      setError('Could not send enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="contact-success">
        <h3>Enquiry sent</h3>
        <p>Thank you — Hub staff will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Name *</span>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label className="field">
        <span>Phone *</span>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </label>
      <label className="field">
        <span>Email *</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label className="field">
        <span>Organisation</span>
        <input type="text" value={organisation} onChange={(e) => setOrganisation(e.target.value)} />
      </label>
      <label className="field">
        <span>Topic</span>
        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          {ENQUIRY_TOPICS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Message *</span>
        <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
      </label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp-field" aria-hidden="true" />
      {error && <p className="error">{error}</p>}
      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  );
}
