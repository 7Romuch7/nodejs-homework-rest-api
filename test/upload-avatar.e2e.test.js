const request = require('supertest')
const app = require('../app')

describe('should handle patch request /api/users/avatars', () => {
  test('should return 401 if token invalid', async done => {
    const res = await request(app)
      .patch('/api/users/avatars')
      .send('avatar')
      .set('Authorization', `Bearer`)
      .set('Accept', 'multipart/form-data')
      .expect('Content-Type', /json/);

    expect(res.status).toEqual(401);
    expect(res.body).toBeDefined();
    done();
  });
});