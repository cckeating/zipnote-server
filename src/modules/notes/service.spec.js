/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

const sinon = require('sinon');
const faker = require('faker');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const { expect } = chai;
chai.use(chaiAsPromised);

const NotesService = require('./service');

describe('Notes Service', () => {
  const NoteMock = {
    findOne: () => {},
    create: () => {},
    update: () => {},
    destroy: () => {},
  };

  const FileServiceMock = {
    readFile: () => {},
    writeFile: () => {},
    deleteFile: () => {},
  };

  beforeEach(() => {
    sinon.restore();
  });

  describe('Get By Id', () => {
    it('Should get a note by ID', async () => {
      const expectedNote = {
        id: faker.random.number(),
        name: faker.lorem.words(),
        data: faker.lorem.sentences(),
        userId: faker.random.number(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { data, ...dbNote } = expectedNote;

      sinon.stub(NoteMock, 'findOne').resolves({
        toJSON: () => dbNote,
      });
      sinon.stub(FileServiceMock, 'readFile').resolves(data);

      const service = NotesService({ Note: NoteMock, FileService: FileServiceMock });

      const result = await service.getById({
        userId: faker.random.number(),
        noteId: faker.random.number(),
      });

      expect(result).to.eql(expectedNote);
    });
  });

  describe('Create', () => {
    it('Should create a new note', async () => {
      const note = {
        id: faker.random.number(),
        name: faker.lorem.words(),
        data: faker.lorem.sentences(),
        userId: faker.random.number(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { data, ...dbNote } = note;

      sinon.stub(NoteMock, 'create').resolves(dbNote);
      const writeFileSpy = sinon.spy(FileServiceMock, 'writeFile');

      const service = NotesService({ Note: NoteMock, FileService: FileServiceMock });

      const result = await service.create({
        userId: note.userId,
        note: {
          name: note.name,
          data: note.data,
        },
      });

      expect(result).to.eql({
        id: note.id,
        name: note.name,
      });
      expect(writeFileSpy.calledOnce).to.be.true;
    });
  });

  describe('Update By ID', () => {
    it('Should update a note by id', async () => {
      const expectedNote = {
        id: faker.random.number(),
        name: faker.lorem.words(),
        data: faker.lorem.sentences(),
        userId: faker.random.number(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { data, ...dbNote } = expectedNote;

      sinon.stub(NoteMock, 'findOne').resolves({
        ...dbNote,
        update: () => dbNote,
        changed: () => {}, // Needed for updating updatedAt field
      });

      const writeFileSpy = sinon.spy(FileServiceMock, 'writeFile');

      const service = NotesService({ Note: NoteMock, FileService: FileServiceMock });

      const result = await service.updateById({
        userId: expectedNote.userId,
        noteId: expectedNote.id,
        noteDTO: {
          name: expectedNote.name,
          data: expectedNote.data,
        },
      });

      expect(result).to.eql({
        id: expectedNote.id,
        name: expectedNote.name,
      });
      expect(writeFileSpy.calledOnce).to.be.true;
    });

    it('Should throw an error if note does not exist', async () => {
      sinon.stub(NoteMock, 'findOne').resolves(null);

      const service = NotesService({ Note: NoteMock, FileService: FileServiceMock });

      return expect(
        service.updateById({
          userId: faker.random.number(),
          noteId: faker.random.number(),
          noteDTO: {
            name: faker.lorem.words(),
            data: faker.lorem.sentences(),
          },
        })
      ).to.eventually.rejectedWith('Failed to update note');
    });
  });

  describe('Delete By Id', () => {
    it('Should delete a note ', async () => {
      sinon.stub(NoteMock, 'destroy').resolves(1);
      const deleteFileStub = sinon.stub(FileServiceMock, 'deleteFile').resolves(true);

      const service = NotesService({ Note: NoteMock, FileService: FileServiceMock });

      const result = await service.deleteById({
        userId: faker.random.number(),
        noteId: faker.random.number(),
      });

      expect(result).to.be.true;
      expect(deleteFileStub.calledOnce).to.be.true;
    });
    it('Should throw an error if note could not be deleted ', async () => {
      sinon.stub(NoteMock, 'destroy').resolves(0);

      const service = NotesService({ Note: NoteMock, FileService: FileServiceMock });

      return expect(
        service.deleteById({
          userId: faker.random.number(),
          noteId: faker.random.number(),
        })
      )
        .to.eventually.rejectedWith('Failed to remove note')
        .with.property('statusCode', 404);
    });
  });
});
