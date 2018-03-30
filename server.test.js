const mongoose = require('mongoose');
const chai = require('chai');
const { expect } = chai;
const chaihttp = require('chai-http');
const sinon = require('sinon');

const server = require('./server');
chai.use(chaihttp);

const Game = require('./models');

describe('Games', () => {
  before(done => {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/test');
    const db = mongoose.connection;
    db.on('error', () => console.error.bind(console, 'connection error'));
    db.once('open', () => {
      console.log('we are connected');
      done();
    });
  });

  after(done => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
      console.log('we are disconnected');
    });
  });
  // declare some global variables for use of testing
  // hint - these wont be constants because you'll need to override them.
  let testGame = null;
  let gameId =null;
  beforeEach(done => {
    const myGame = new Game({
      title: 'VVS',
      genre: 'Sports',
      releaseDate: 'October 1979'
    });
    myGame
    .save()
    .then(game => {
      testGame = game;
      gameId = game._id;
      done();
    })
    .catch(err => {
      console.error(err);
      done();
    });
    // write a beforeEach hook that will populate your test DB with data
    // each time this hook runs, you should save a document to your db
    // by saving the document you'll be able to use it in each of your `it` blocks
  });
  afterEach(done => {
    // simply remove the collections from your DB.
    Game.remove({}, err =>{
      if(err) console.error(err);
      done();
    });
  });

  // test the POST here
describe('[POST /api/game/create', () => {
  it('should add a new game', done => {
    const myGame = {
      title: 'Mario',
      genre: 'NS-games',
      releaseDate: 'November 2000'
    };
    chai.request(server)
    .post('/api/game/create')
    .send(myGame)
    .end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.title).to.equal('Mario');
      done();
    });
  });
});
  // test the GET here

  // test the PUT here

  // --- Stretch Problem ---
  // Test the DELETE here
});
