// The email service is mocked (global fetch) — nothing is really sent.
const ORIGINAL_ENV = { ...process.env };

const booking = {
  name: 'Mia <b>Tester</b>',
  phone: '021 000 0000',
  email: 'mia@example.com',
  service: 'Nanoplastia',
  message: 'Saturday morning please',
  createdAt: new Date('2026-11-26T01:00:00Z'),
};

function loadMailer() {
  jest.resetModules();
  return require('../src/utils/mailer');
}

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
  delete process.env.RESEND_API_KEY;
  delete process.env.EMAIL_HOST;
  delete process.env.EMAIL_USER;
  delete process.env.EMAIL_PASS;
  delete process.env.EMAIL_FROM_ADDRESS;
  delete process.env.SALON_NOTIFICATION_EMAIL;
  global.fetch = jest.fn();
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

describe('mailer', () => {
  it('skips quietly (and returns false) when no email is configured', async () => {
    const mailer = loadMailer();
    expect(await mailer.sendBookingNotification(booking)).toBe(false);
    expect(await mailer.sendCustomerConfirmation(booking)).toBe(false);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('sends the salon notification through Resend over HTTPS', async () => {
    process.env.RESEND_API_KEY = 're_test_key';
    process.env.EMAIL_FROM_ADDRESS = 'bookings@xshairbeauty.nz';
    process.env.SALON_NOTIFICATION_EMAIL = 'owner@example.com';
    global.fetch.mockResolvedValue({ ok: true });

    const mailer = loadMailer();
    expect(await mailer.sendBookingNotification(booking)).toBe(true);

    const [url, options] = global.fetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(url).toBe('https://api.resend.com/emails');
    expect(options.headers.Authorization).toBe('Bearer re_test_key');
    expect(body.from).toBe('"XS Hair & Beauty Website" <bookings@xshairbeauty.nz>');
    expect(body.to).toEqual(['owner@example.com']);
    expect(body.reply_to).toBe('mia@example.com');
    expect(body.subject).toContain('Mia');
    // customer-supplied text must be escaped in the HTML
    expect(body.html).not.toContain('<b>Tester</b>');
    expect(body.html).toContain('&lt;b&gt;Tester&lt;/b&gt;');
  });

  it('sends the customer confirmation to the customer, replying to the salon', async () => {
    process.env.RESEND_API_KEY = 're_test_key';
    process.env.EMAIL_FROM_ADDRESS = 'bookings@xshairbeauty.nz';
    global.fetch.mockResolvedValue({ ok: true });

    const mailer = loadMailer();
    expect(await mailer.sendCustomerConfirmation(booking)).toBe(true);

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.from).toBe('"XS Hair & Beauty" <bookings@xshairbeauty.nz>');
    expect(body.to).toEqual(['mia@example.com']);
    expect(body.reply_to).toBe('xshairbeautysalon@gmail.com');
    expect(body.html).toContain('022 435 9610');
  });

  it('throws a useful error, without the key, when Resend rejects the email', async () => {
    process.env.RESEND_API_KEY = 're_secret_key';
    process.env.EMAIL_FROM_ADDRESS = 'bookings@xshairbeauty.nz';
    global.fetch.mockResolvedValue({ ok: false, status: 403, text: async () => 'domain not verified' });

    const mailer = loadMailer();
    await expect(mailer.sendCustomerConfirmation(booking)).rejects.toThrow(/403.*domain not verified/);
    await expect(mailer.sendCustomerConfirmation(booking)).rejects.not.toThrow(/re_secret_key/);
  });

  it('does not send the salon notification when there is nowhere to send it', async () => {
    process.env.RESEND_API_KEY = 're_test_key';
    process.env.EMAIL_FROM_ADDRESS = 'bookings@xshairbeauty.nz';

    const mailer = loadMailer();
    expect(await mailer.sendBookingNotification(booking)).toBe(false);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
