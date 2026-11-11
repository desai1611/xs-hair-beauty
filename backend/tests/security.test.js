require('./setup');
const request = require('supertest');
const app = require('../src/app');
const Admin = require('../src/models/Admin');
const Booking = require('../src/models/Booking');
const Service = require('../src/models/Service');

async function adminToken() {
  const passwordHash = await Admin.hashPassword('secret123');
  await Admin.create({ name: 'Owner', email: 'owner@test.com', passwordHash, role: 'owner' });
  const res = await request(app).post('/api/auth/login').send({ email: 'owner@test.com', password: 'secret123' });
  return res.body.token;
}

describe('input validation and injection protection', () => {
  it('rejects a login body that tries a MongoDB operator', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: { $ne: null }, password: { $ne: null } });
    expect(res.status).toBe(400);
  });

  it('rejects a malformed email on login', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nope', password: 'x' });
    expect(res.status).toBe(400);
  });

  it('validates admin writes on the server', async () => {
    const token = await adminToken();
    const bad = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Cut', category: 'not-a-category', price: -5 });
    expect(bad.status).toBe(400);

    const good = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Cut', category: 'hair', price: 55 });
    expect(good.status).toBe(201);
  });

  it('treats search text as plain text, not a regex', async () => {
    await Service.create({ name: 'Colour (full)', category: 'hair' });
    const res = await request(app).get('/api/services').query({ search: '(a+)+$' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);

    const literal = await request(app).get('/api/services').query({ search: '(full)' });
    expect(literal.body).toHaveLength(1);
  });

  it('does not crash when category is sent as an object', async () => {
    const res = await request(app).get('/api/services?category[foo]=bar');
    expect(res.status).toBe(200);
  });
});

describe('spam protection', () => {
  it('drops honeypot submissions without saving them', async () => {
    const res = await request(app).post('/api/bookings').send({
      name: 'Bot', phone: '021 000 0000', email: 'bot@example.com', website: 'http://spam.example',
    });
    expect(res.status).toBe(201);
    expect(await Booking.countDocuments()).toBe(0);
  });
});

describe('error handling', () => {
  it('gives a plain 403 for a blocked origin without echoing it back', async () => {
    const res = await request(app).get('/api/health').set('Origin', 'https://evil.example');
    expect(res.status).toBe(403);
    expect(JSON.stringify(res.body)).not.toContain('evil.example');
  });

  it('hides internal details on unexpected server errors', async () => {
    const spy = jest.spyOn(Service, 'find').mockImplementation(() => {
      throw new Error('secret internal detail /var/app/db.js');
    });
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const res = await request(app).get('/api/services');
    spy.mockRestore();
    errSpy.mockRestore();
    expect(res.status).toBe(500);
    expect(JSON.stringify(res.body)).not.toContain('secret internal detail');
  });

  it('reports the database state on the health endpoint', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.database).toBe('connected');
  });
});

describe('prototype tampering', () => {
  it('ignores __proto__ / constructor keys in a request body', async () => {
    const token = await adminToken();
    const res = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send('{"name":"Cut","category":"hair","__proto__":{"isAdmin":true},"constructor":{"prototype":{"x":1}}}');
    expect(res.status).toBe(201);
    expect({}.isAdmin).toBeUndefined();
    expect(res.body.isAdmin).toBeUndefined();
  });
});
