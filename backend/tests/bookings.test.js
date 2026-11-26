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

describe('DELETE /api/bookings (delete all)', () => {
  it('requires an admin token', async () => {
    const res = await request(app).delete('/api/bookings');
    expect(res.status).toBe(401);
  });

  it('removes every booking for a logged-in admin', async () => {
    const Admin = require('../src/models/Admin');
    const passwordHash = await Admin.hashPassword('secret123');
    await Admin.create({ name: 'Owner', email: 'owner-del@test.com', passwordHash, role: 'owner' });
    const login = await request(app).post('/api/auth/login').send({ email: 'owner-del@test.com', password: 'secret123' });
    const token = login.body.token;

    await Booking.create([
      { name: 'A', phone: '021 111 1111', email: 'a@example.com', service: 'Hair Services' },
      { name: 'B', phone: '021 222 2222', email: 'b@example.com', service: 'Hair Services' },
    ]);
    const res = await request(app).delete('/api/bookings').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.deleted).toBeGreaterThanOrEqual(2);
    expect(await Booking.countDocuments()).toBe(0);
  });
});
