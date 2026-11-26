const nodemailer = require('nodemailer');

// Email can go out two ways:
//  1. Resend (an email service used over HTTPS) when RESEND_API_KEY is set. This is the one to use on
//     Railway's Hobby plan, which blocks SMTP. Mail is sent from EMAIL_FROM_ADDRESS, an address on a
//     domain verified in Resend (for example bookings@xshairbeauty.nz).
//  2. Plain SMTP (EMAIL_HOST / EMAIL_USER / EMAIL_PASS) otherwise, e.g. Gmail on a normal server.
// If neither is configured, booking emails are skipped and the booking is still saved.
let transporter = null;

function usingResend() {
  return Boolean(process.env.RESEND_API_KEY);
}

function fromAddress() {
  return process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER;
}

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
}

function emailConfigured() {
  if (usingResend()) return Boolean(fromAddress());
  return Boolean(getTransporter());
}

let warned = false;
function warnOnce() {
  if (warned) return;
  warned = true;
  console.warn('Email is not configured (set RESEND_API_KEY + EMAIL_FROM_ADDRESS, or EMAIL_HOST/EMAIL_USER/EMAIL_PASS) — booking emails will be skipped.');
}

// Sends one email by whichever method is configured. Throws if the provider rejects it.
async function deliver({ fromName, to, replyTo, subject, html }) {
  const from = `"${fromName}" <${fromAddress()}>`;

  if (usingResend()) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], reply_to: replyTo, subject, html }),
    });
    if (!res.ok) {
      // keep the provider's reason for the logs, never the key
      const detail = await res.text().catch(() => '');
      throw new Error(`Resend rejected the email (${res.status}): ${detail.slice(0, 300)}`);
    }
    return true;
  }

  await getTransporter().sendMail({ from, to, replyTo, subject, html });
  return true;
}

async function sendBookingNotification(booking) {
  const to = process.env.SALON_NOTIFICATION_EMAIL || process.env.EMAIL_USER;
  if (!emailConfigured() || !to) {
    warnOnce();
    return false;
  }

  const html = `
    <div style="font-family:sans-serif; max-width:520px;">
      <h2 style="color:#b34a72;">New booking enquiry — XS Hair &amp; Beauty</h2>
      <table style="width:100%; border-collapse:collapse;">
        <tr><td style="padding:8px 0; font-weight:bold; width:120px;">Name</td><td>${escapeHtml(booking.name)}</td></tr>
        <tr><td style="padding:8px 0; font-weight:bold;">Phone</td><td>${escapeHtml(booking.phone)}</td></tr>
        <tr><td style="padding:8px 0; font-weight:bold;">Email</td><td>${escapeHtml(booking.email)}</td></tr>
        <tr><td style="padding:8px 0; font-weight:bold;">Service</td><td>${escapeHtml(booking.service)}</td></tr>
        <tr><td style="padding:8px 0; font-weight:bold; vertical-align:top;">Message</td><td>${escapeHtml(booking.message || '—')}</td></tr>
      </table>
      <p style="color:#8a747c; font-size:12px; margin-top:20px;">Submitted ${new Date(booking.createdAt || Date.now()).toLocaleString('en-NZ')}. View and manage this enquiry in the admin dashboard.</p>
    </div>
  `;

  return deliver({
    fromName: 'XS Hair & Beauty Website',
    to,
    replyTo: booking.email,
    subject: `New booking enquiry from ${booking.name}`,
    html,
  });
}

async function sendCustomerConfirmation(booking) {
  if (!emailConfigured()) {
    warnOnce();
    return false;
  }

  const phone = process.env.SALON_PHONE_DISPLAY || '022 435 9610';
  const whatsapp = process.env.SALON_WHATSAPP || '64224359610';
  const address = process.env.SALON_ADDRESS || '25 Chartwell Avenue, Glenfield, Auckland 0629, New Zealand';
  const salonEmail = process.env.SALON_EMAIL || 'xshairbeautysalon@gmail.com';

  const html = `
    <div style="font-family:sans-serif; max-width:520px;">
      <h2 style="color:#b34a72;">Thank you for your enquiry, ${escapeHtml(booking.name)}!</h2>
      <p>We have received your enquiry for <strong>${escapeHtml(booking.service)}</strong> and we will get back to you soon.</p>
      <p>Need us sooner, or have a question in the meantime? Reach us directly:</p>
      <table style="width:100%; border-collapse:collapse; margin:16px 0;">
        <tr><td style="padding:6px 0; font-weight:bold; width:100px;">Email</td><td><a href="mailto:${escapeHtml(salonEmail)}" style="color:#b34a72;">${escapeHtml(salonEmail)}</a></td></tr>
        <tr><td style="padding:6px 0; font-weight:bold;">Phone</td><td>${escapeHtml(phone)}</td></tr>
        <tr><td style="padding:6px 0; font-weight:bold;">WhatsApp</td><td><a href="https://wa.me/${whatsapp}" style="color:#b34a72;">Message us on WhatsApp</a></td></tr>
        <tr><td style="padding:6px 0; font-weight:bold; vertical-align:top;">Address</td><td>${escapeHtml(address)}</td></tr>
      </table>
      <p style="color:#8a747c; font-size:12px; margin-top:24px;">This is an automatic confirmation that your enquiry was received — a member of our team will follow up personally.</p>
    </div>
  `;

  return deliver({
    fromName: 'XS Hair & Beauty',
    to: booking.email,
    replyTo: salonEmail,
    subject: 'Thank you for your enquiry — XS Hair & Beauty',
    html,
  });
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = { sendBookingNotification, sendCustomerConfirmation };
