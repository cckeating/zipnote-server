/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const request = require('supertest');
const { expect } = require('chai');
const faker = require('faker');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const app = require('../../app');
const createUser = require('../../../__tests__/createUser');
const createNote = require('../../../__tests__/createNote');
const { Note } = require('../../db/models');

describe('Notes Routes', () => {
  let user;
  before(async () => {
    user = await createUser();

    sinon.stub(jwt, 'verify').returns({
      userId: user.id,
    });
  });

  beforeEach(async () => {
    await Note.destroy({ where: {} });
  });

  describe('POST /notes', () => {
    it('Should create a new note', async () => {
      const data = {
        name: faker.lorem.words(),
        data: faker.lorem.sentence(),
      };

      const { body, status } = await request(app)
        .post('/v1/notes')
        .send(data)
        .auth('TOKEN', { type: 'bearer' });

      expect(status).to.eql(201);
      expect(body.id).to.not.be.null;
      expect(body.name).to.eql(data.name);
    });
  });

  describe('GET /notes/:id', () => {
    it('Get a note by ID', async () => {
      const mockNote = await createNote(user.id);

      const { body, status } = await request(app)
        .get(`/v1/notes/${mockNote.id}`)
        .auth('TOKEN', { type: 'bearer' });

      expect(status).to.eql(200);
      expect(body.id).to.eql(mockNote.id);
      expect(body.name).to.eql(mockNote.name);
      expect(body.data).to.eql(mockNote.data);
    });

    it('Should not get a note by ID that is not owned by the current user', async () => {
      const mockNote = await createNote(null);

      const { status } = await request(app)
        .get(`/v1/notes/${mockNote.id}`)
        .auth('TOKEN', { type: 'bearer' });

      expect(status).to.eql(404);
    });
  });

  describe('PUT /notes/:id', () => {
    it('Update a note by ID', async () => {
      const mockNote = await createNote(user.id);

      const updatedNote = {
        name: faker.lorem.word(),
        data: faker.lorem.sentences(),
      };

      const { body, status } = await request(app)
        .put(`/v1/notes/${mockNote.id}`)
        .send(updatedNote)
        .auth('TOKEN', { type: 'bearer' });

      expect(status).to.eql(200);
      expect(body.name).to.eql(updatedNote.name);
    });

    it('Should note get a note by ID that is not owned by the current user', async () => {
      const mockNote = await createNote(null);

      const updatedNote = {
        name: faker.lorem.word(),
        data: faker.lorem.sentences(),
      };

      const { status } = await request(app)
        .put(`/v1/notes/${mockNote.id}`)
        .send(updatedNote)
        .auth('TOKEN', { type: 'bearer' });

      expect(status).to.eql(404);
    });
  });

  describe('DELETE /notes/:id', () => {
    it('Should delete a note by ID', async () => {
      const mockNote = await createNote(user.id);

      const { body, status } = await request(app)
        .delete(`/v1/notes/${mockNote.id}`)
        .auth('TOKEN', { type: 'bearer' });

      expect(status).to.eql(200);
      expect(body.message).to.not.be.null;
    });
    it('Should not delete the note if its not owned by the current user', async () => {
      const mockNote = await createNote(null);

      const { status } = await request(app)
        .delete(`/v1/notes/${mockNote.id}`)
        .auth('TOKEN', { type: 'bearer' });

      expect(status).to.eql(404);
    });
  });

  describe('GET /notes', () => {
    describe('GET /notes', () => {
      it('Should get all notes owned by the current user', async () => {
        await createNote(user.id);
        await createNote(user.id);
        await createNote(user.id);
        await createNote(null);

        const { body, status } = await request(app)
          .get(`/v1/notes`)
          .auth('TOKEN', { type: 'bearer' });

        expect(status).to.eql(200);
        expect(body.total).to.eql(3);
        expect(body.notes).to.have.length(3);
      });
    });

    describe('GET /notes?limit={limit}&offset={offset}', () => {
      it('Should get all notes owned by the current user within the limit and offset', async () => {
        await createNote(user.id);
        await createNote(user.id);
        const expected = await createNote(user.id);

        const { body, status } = await request(app)
          .get(`/v1/notes?limit=1&offset=2`)
          .auth('TOKEN', { type: 'bearer' });

        expect(status).to.eql(200);
        expect(body.total).to.eql(3);
        expect(body.notes).to.have.length(1);
        expect(body.notes[0].id).to.eql(expected.id);
      });
    });

    describe('GET /notes?name={name}', () => {
      it('Should get all notes matching the name query', async () => {
        await createNote(user.id);
        await createNote(user.id);
        const expected = await createNote(user.id);

        const { body, status } = await request(app)
          .get(`/v1/notes?name=${expected.name}`)
          .auth('TOKEN', { type: 'bearer' });

        expect(status).to.eql(200);
        expect(body.total).to.eql(1);
        expect(body.notes).to.have.length(1);
        expect(body.notes[0].id).to.eql(expected.id);
      });
    });
  });
});
