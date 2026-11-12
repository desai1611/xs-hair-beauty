import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import api, { extractErrorMessage } from '../api/client';
import useFetch from '../hooks/useFetch';
import { SALON, waLink, telLink, mapsEmbedSrc, mapsDirectionsLink } from '../config/salon';

const initialForm = { name: '', phone: '', email: '', service: 'Hair Services', message: '' };

const DEFAULT_HOURS = [
  'Monday: Closed',
  'Tuesday: 9:30 AM – 6:00 PM',
  'Wednesday: 9:30 AM – 6:00 PM',
  'Thursday: 9:30 AM – 6:00 PM',
  'Friday: 9:30 AM – 6:00 PM',
  'Saturday: 9:30 AM – 6:00 PM',
  'Sunday: 10:00 AM – 6:00 PM',
];

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const { data: siteContent } = useFetch('/site-content');

  const hoursLines = siteContent?.opening_hours?.value
    ? siteContent.opening_hours.value.split('\n').filter(Boolean)
    : DEFAULT_HOURS;

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      await api.post('/bookings', form);
      setStatus('success');

      // Hand off to WhatsApp with the enquiry pre-filled, so it also reaches
      // the salon's WhatsApp directly — the customer just needs to hit send.
      const summary = `Hi! I just submitted a booking enquiry on your website.\n\nName: ${form.name}\nService: ${form.service}${form.message ? `\nMessage: ${form.message}` : ''}`;
      const link = waLink(summary);
      setWhatsappLink(link);
      // Best-effort auto-open — browsers may block this since it fires after
      // an awaited network call, so the success message below always shows a
      // manual button too as a guaranteed fallback.
      window.open(link, '_blank', 'noopener,noreferrer');

      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMsg(extractErrorMessage(err, 'Could not submit your enquiry. Please try calling or WhatsApp instead.'));
    }
  }

  return (
    <>
      <PageHeader eyebrow="Contact" title="We'd love to hear from you" subtitle="Call, WhatsApp, or send an enquiry below — our team will confirm your appointment as soon as possible." />

      <section className="px-3 sm:px-5 pt-3">
        <div className="tile max-w-[1240px] mx-auto bg-lime px-7 sm:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div>
            <h2 className="text-[26px] sm:text-[34px] leading-tight mb-1">Book online in under a minute</h2>
            <p className="text-plum-900/75 mb-0">Choose your service and time on Fresha and get instant confirmation. Prefer to chat? Use the enquiry form below.</p>
          </div>
          <a href={SALON.booking} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Book on Fresha</a>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-[1180px] mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-11 items-start">
          {/* CONTACT INFO */}
          <div>
            <div className="bg-white border-[1.5px] border-plum-900/10 rounded-[28px] p-8 shadow-soft">
              <InfoRow icon="📍" label="Address"><p className="mb-0">{SALON.address}</p></InfoRow>
              <InfoRow icon="📞" label="Phone"><a href={telLink()} className="font-semibold text-pink-700">{SALON.phoneDisplay}</a> — tap to call</InfoRow>
              <InfoRow icon="💬" label="WhatsApp"><a href={waLink()} target="_blank" rel="noopener noreferrer" className="font-semibold text-pink-700">Message us on WhatsApp</a></InfoRow>
              <InfoRow icon="✉️" label="Email"><a href={`mailto:${SALON.email}`} className="font-semibold text-pink-700 break-all">{SALON.email}</a></InfoRow>
              <InfoRow icon="🕒" label="Opening Hours" last>
                {hoursLines.map((line) => (
                  <p key={line} className="mb-0.5">{line}</p>
                ))}
              </InfoRow>
              <div className="flex gap-2.5 mt-5.5">
                <a href={SALON.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white border-2 border-plum-900 flex items-center justify-center text-plum-900 hover:bg-plum-900 hover:text-white transition-colors">f</a>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-white border-2 border-plum-900 flex items-center justify-center text-plum-900 hover:bg-plum-900 hover:text-white transition-colors">w</a>
              </div>
            </div>

            <div className="rounded-[28px] overflow-hidden shadow-soft border-[1.5px] border-plum-900/10 mt-6.5">
              <iframe src={mapsEmbedSrc()} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="XS Hair & Beauty location" className="w-full h-65 border-0 block" />
            </div>
            <a href={mapsDirectionsLink()} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-block mt-4">Get Directions</a>

          </div>

          {/* FORM */}
          <div id="booking-form">
            <div className="bg-white border-[1.5px] border-plum-900/10 rounded-[28px] p-9 shadow-soft">
              <h2 className="text-2xl mb-1.5">Send a booking enquiry</h2>
              <p className="mb-6.5">Fill out the form and our team will get back to you to confirm your appointment. You can also email us directly at <a href={`mailto:${SALON.email}`} className="font-semibold text-pink-700 break-all">{SALON.email}</a>.</p>

              {status === 'success' && (
                <div className="bg-lime/40 border-2 border-plum-900 text-plum-900 px-4.5 py-3.5 rounded-2xl text-sm mb-4.5">
                  <p className="font-semibold mb-2">Thank you for your enquiry — we will get back to you soon. We've also sent a confirmation email to the address you entered (check your spam folder if you don't see it).</p>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-sm">
                    💬 Also message us on WhatsApp
                  </a>
                </div>
              )}
              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4.5 py-3.5 rounded-[10px] text-sm font-semibold mb-4.5">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4.5">
                  <div className="field mb-4.5">
                    <label htmlFor="name">Full Name</label>
                    <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                  </div>
                  <div className="field mb-4.5">
                    <label htmlFor="phone">Phone Number</label>
                    <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Your phone number" required />
                  </div>
                </div>
                <div className="field mb-4.5">
                  <label htmlFor="email">Email Address</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                </div>
                <div className="field mb-4.5">
                  <label htmlFor="service">Service Interested In</label>
                  <select id="service" name="service" value={form.service} onChange={handleChange}>
                    <option>Hair Services</option>
                    <option>Beauty Services</option>
                    <option>Advanced Beauty</option>
                    <option>Bridal Package</option>
                    <option>Party Package</option>
                    <option>Products</option>
                    <option>Not sure / general enquiry</option>
                  </select>
                </div>
                <div className="field mb-4.5">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows="4" value={form.message} onChange={handleChange} placeholder="Tell us what you're looking for, preferred dates/times, etc." />
                </div>
                <button type="submit" disabled={status === 'submitting'} className="btn btn-primary btn-block disabled:opacity-60">
                  {status === 'submitting' ? 'Sending...' : 'Send Enquiry'}
                </button>
                <p className="text-xs text-text-light mt-2.5">By submitting, you agree to be contacted about your enquiry. We handle your details responsibly in line with the NZ Privacy Act 2020.</p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoRow({ icon, label, children, last = false }) {
  return (
    <div className={`flex gap-4 py-4 ${last ? '' : 'border-b border-plum-900/10'}`}>
      <div className="w-11 h-11 rounded-full bg-lime text-plum-900 border-2 border-plum-900 flex items-center justify-center flex-shrink-0 text-lg">{icon}</div>
      <div>
        <h4 className="text-[15px] mb-1">{label}</h4>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}
