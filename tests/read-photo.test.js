const request = require('supertest')
const app = require('../src/app')
const { BASE_URL } = require('./constants/base.constant');

describe(`GET ${BASE_URL}/photos/food/coffee-2608864_1280.jpg`, () => {
  it('success case', async () => {
    const res = await request(app)
      .get('/photos/food/coffee-2608864_1280.jpg')
      .expect('Content-Type', 'image/jpeg')
      .expect(200)
  })
});