require('./setup');
const request = require('supertest');
const app = require('../src/app');
const Booking = require('../src/models/Booking');

describe('POST /api/bookings', () => {
  it('rejects a submission missing required fields', async () => {
    const res = await request(app).post('/api/bookings').send({ name: 'Jane' });
    expect(res.status).toBe(400);
  });

  it('creates a booking with valid data', async () => {
    const res = await request(app).post('/api/bookings').send({
      name: 'Jane Doe',
      phone: '021 123 4567',
      email: 'jane@example.com',
      service: 'Hair Services',
      message: 'Looking for a colour appointment next week.',
    });
    expect(res.status).toBe(201);
    expect(res.body.booking.name).toBe('Jane Doe');

    const saved = await Booking.findOne({ email: 'jane@example.com' });
    expect(saved).not.toBeNull();
    expect(saved.status).toBe('new');
  });

  it('rejects an invalid email address', async () => {
    const res = await request(app).post('/api/bookings').send({
      name: 'Jane Doe',
      phone: '021 123 4567',
      email: 'not-an-email',
    });
    expect(res.status).toBe(400);
  });
});
