const request = require('supertest')
const app = require('../src/app')
const { BASE_URL } = require('./constants/base.constant');

describe(`POST ${BASE_URL}/photos/list`, () => {
  it('success case', async () => {
    const res = await request(app)
      .post('/photos/list')
      .send({ skip: 0, limit: 2 })
      .expect('Content-Type', /json/)
      .expect(200)
  })

  it('error case', async () => {
    const res = await request(app)
      .post('/photos/list')
      .send({ skippp: 0, limit: 2 })
      .expect('Content-Type', /json/)
      .expect(400)
  })

  it('error case', async () => {
    const res = await request(app)
      .post('/photos/list')
      .send({ skip: 'a', limit: 2 })
      .expect('Content-Type', /json/)
      .expect(400)
  })

});