const request = require('supertest')
const app = require('../src/app')
const { BASE_URL } = require('./constants/base.constant');

describe(`PUT ${BASE_URL}/photos`, () => {
  it('Success case upload', async () => {
    const res = await request(app)
      .put('/photos')
      .field('album', 'awesome')
      .attach('documents', 'tests/test-album/test1.jpg')
      .attach('documents', 'tests/test-album/test2.jpg')
      .attach('documents', 'tests/test-album/test3.jpg')
      .expect(200)
    expect(JSON.parse(res.text).data.length).toEqual(3);
  })

  it('Success case delete mutiple files', async () => {
    const del = await request(app)
      .delete('/photos')
      .send([{
        album: "Awesome",
        documents: "test1.jpg, test2.jpg, test3.jpg"
      }])
      .expect(200)
    expect(JSON.parse(del.text).documentDeleted).toEqual(3);
  })

  it('Error case upload', async () => {
    const res = await request(app)
      .put('/photos')
      .field('albums', 'awesome')
      .attach('documents', 'tests/test-album/test1.jpg')
      .attach('documents', 'tests/test-album/test2.jpg')
      .attach('documents', 'tests/test-album/test3.jpg')
      .expect(400)
  })

  it('Error case upload', async () => {
    const res = await request(app)
      .put('/photos')
      .field('album', 'awe some')
      .attach('documents', 'tests/test-album/test1.jpg')
      .attach('documents', 'tests/test-album/test2.jpg')
      .attach('documents', 'tests/test-album/test3.jpg')
      .expect(400)
  })

  it('Success case upload (one part)', async () => {
    const res = await request(app)
      .put('/photos')
      .field('album', 'awesome')
      .attach('documents', 'tests/test-album/test1.xjpg') // Unsupported-file
      .attach('documents', 'tests/test-album/test2.jpg')
      .expect(200)
    expect(JSON.parse(res.text).data.length).toEqual(1);
  })

  it('Success case delete one files', async () => {
    const del = await request(app)
      .delete('/photos/awesome/test2.jpg')
      .expect(200)
  })
});