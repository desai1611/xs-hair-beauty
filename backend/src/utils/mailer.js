const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email is not configured (EMAIL_HOST/EMAIL_USER/EMAIL_PASS missing) — booking emails will be skipped.');
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

async function sendBookingNotification(booking) {
  const t = getTransporter();
  const to = process.env.SALON_NOTIFICATION_EMAIL || process.env.EMAIL_USER;
  if (!t || !to) return false;

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

  await t.sendMail({
    from: `"XS Hair & Beauty Website" <${process.env.EMAIL_USER}>`,
    to,
    replyTo: booking.email,
    subject: `New booking enquiry from ${booking.name}`,
    html,
  });

  return true;
}

async function sendCustomerConfirmation(booking) {
  const t = getTransporter();
  if (!t) return false;

  const phone = process.env.SALON_PHONE_DISPLAY || '0022 342 3964';
  const whatsapp = process.env.SALON_WHATSAPP || '223423964';
  const address = process.env.SALON_ADDRESS || '23 Chartwell Avenue, Glenfield, Auckland 0629, New Zealand';

  const html = `
    <div style="font-family:sans-serif; max-width:520px;">
      <h2 style="color:#b34a72;">Thanks for reaching out, ${escapeHtml(booking.name)}!</h2>
      <p>We've received your enquiry for <strong>${escapeHtml(booking.service)}</strong> and XS Hair &amp; Beauty will contact you soon to confirm your appointment.</p>
      <p>Need us sooner, or have a question in the meantime? Reach us directly:</p>
      <table style="width:100%; border-collapse:collapse; margin:16px 0;">
        <tr><td style="padding:6px 0; font-weight:bold; width:100px;">Phone</td><td>${escapeHtml(phone)}</td></tr>
        <tr><td style="padding:6px 0; font-weight:bold;">WhatsApp</td><td><a href="https://wa.me/${whatsapp}" style="color:#b34a72;">Message us on WhatsApp</a></td></tr>
        <tr><td style="padding:6px 0; font-weight:bold; vertical-align:top;">Address</td><td>${escapeHtml(address)}</td></tr>
      </table>
      <p style="color:#8a747c; font-size:12px; margin-top:24px;">This is an automatic confirmation that your enquiry was received — a member of our team will follow up personally.</p>
    </div>
  `;

  await t.sendMail({
    from: `"XS Hair & Beauty" <${process.env.EMAIL_USER}>`,
    to: booking.email,
    subject: 'We received your enquiry — XS Hair & Beauty',
    html,
  });

  return true;
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = { sendBookingNotification, sendCustomerConfirmation };
