require('./setup');
const request = require('supertest');
const app = require('../src/app');
const Admin = require('../src/models/Admin');

async function getToken() {
  const passwordHash = await Admin.hashPassword('secret123');
  await Admin.create({ name: 'Owner', email: 'owner@test.com', passwordHash, role: 'owner' });
  const res = await request(app).post('/api/auth/login').send({ email: 'owner@test.com', password: 'secret123' });
  return res.body.token;
}

describe('GET /api/site-content', () => {
  it('self-creates the default slots and returns them keyed by slot name', async () => {
    const res = await request(app).get('/api/site-content');
    expect(res.status).toBe(200);
    expect(res.body.home_hero_image).toEqual({ label: expect.any(String), type: 'image', value: '' });
    expect(res.body.hair_promo_video.type).toBe('video');
  });
});

describe('PUT /api/site-content/:key', () => {
  it('rejects unauthenticated updates', async () => {
    const res = await request(app).put('/api/site-content/home_hero_image').send({ value: 'https://example.com/x.jpg' });
    expect(res.status).toBe(401);
  });

  it('updates a known slot when authenticated', async () => {
    const token = await getToken();
    const res = await request(app)
      .put('/api/site-content/home_hero_image')
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 'https://example.com/hero.jpg' });
    expect(res.status).toBe(200);
    expect(res.body.value).toBe('https://example.com/hero.jpg');

    const after = await request(app).get('/api/site-content');
    expect(after.body.home_hero_image.value).toBe('https://example.com/hero.jpg');
  });

  it('404s for an unknown slot key', async () => {
    const token = await getToken();
    const res = await request(app)
      .put('/api/site-content/not_a_real_slot')
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 'x' });
    expect(res.status).toBe(404);
  });
});
