require('./setup');
const request = require('supertest');
const app = require('../src/app');
const Admin = require('../src/models/Admin');

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    const passwordHash = await Admin.hashPassword('secret123');
    await Admin.create({ name: 'Owner', email: 'owner@test.com', passwordHash, role: 'owner' });
  });

  it('logs in with correct credentials and returns a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'owner@test.com', password: 'secret123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('rejects incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'owner@test.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('blocks protected routes without a token', async () => {
    const res = await request(app).get('/api/services/admin');
    expect(res.status).toBe(401);
  });
});
