require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/app').default;

const { assert } = chai;
const { expect } = chai;
chai.should();

let foodId1;
let foodId2;
let foodId3;

let user1Id;
let user2Id;

let user1token;
let user2token;
let admintoken;

let orderId1;
let orderId2;

chai.use(chaiHttp);

describe('Root route', () => {
  it('should return 404 for any endpoint not defined', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(404);
        return done();
      });
  });
});

describe('Authentication', () => {
  describe('signup', () => {
    it('should return 422 for incomplete user data and include an error message', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          "firstname": "tony",
          "lastname": "pass",
          "username": "tonypass",
          "address": "awoniyi"
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          res.body.should.have.own.property('message');
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 422 for incorrect admin_secret and include an error message', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          "firstname": "admin",
          "lastname": "two",
          "username": "adminone",
          "address": "awoniyi",
          "phone": "08012345678",
          "password": "adminonepass",
          "admin_secret": "secret"
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          res.body.should.have.own.property('message');
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 201 and user object for successful user signup', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          "firstname": "user",
          "lastname": "one",
          "username": "userone",
          "address": "example",
          "phone": "08012345678",
          "password": "useronepass"
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          res.body.should.have.own.property('result');
          res.body.should.have.own.property('token');
          expect(res.body['status']).to.equal(true);
          user1Id = res.body.result.id;
          return done();
        });
    });
    it('should return 201 and user object for successful admin signup', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          "firstname": "admin",
          "lastname": "one",
          "username": "adminone",
          "address": "awoniyi",
          "phone": "08012345678",
          "password": "adminonepass",
          "admin_secret": process.env.ADMINSECRET
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          res.body.should.have.own.property('result');
          res.body.should.have.own.property('token');
          expect(res.body['status']).to.equal(true);
          admintoken = res.body.token;
          return done();
        });
    });
    it('should return 409 and error message if user already exists', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          "firstname": "user",
          "lastname": "one",
          "username": "userone",
          "address": "example",
          "phone": "08012345678",
          "password": "useronepass"
        })
        .end((err, res) => {
          expect(res).to.have.status(409);
          res.body.should.have.own.property('message');
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should handle additional user signup', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          "firstname": "user",
          "lastname": "two",
          "username": "usertwo",
          "address": "example",
          "phone": "08012345678",
          "password": "usertwopass"
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.own.property('result');
          res.body.should.have.own.property('token');
          expect(res.body['status']).to.equal(true);
          user2Id = res.body.result.id;
          user2token = res.body.token;
          return done();
        });
    });
    it('should return 422 and error messages for invalid data', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          "firstname": "user",
          "lastname": "two",
          "username": "usertwo",
          "address": "example",
          "phone": "0801245678",
          "password": "usertwopass"
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.own.property('message');
          expect(res.body['status']).to.equal(false);
          return done();
        });
    })
  });
  
  describe('login', () => {
    it('should return 422 for no username received', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          password: 'useronepass'
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 422 for no password received', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          username: 'userone'
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    })
    it('should return 422 for incorrect username', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          username: 'userthree',
          password: 'useronepass'
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 422 for incorrect password', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          username: 'userone',
          password: 'useronepa'
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    })
    it('should return 200 for a successful login', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          username: 'userone',
          password: 'useronepass'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          res.body.should.have.own.property('token');
          expect(res.body['status']).to.equal(true);
          user1token = res.body.token;
          return done();
        });
    })
  })
});

describe('Menu route', () => {
  describe('GET /menu', () => {
    it('should return 200 and an array for a successful request', (done) => {
      chai.request(app)
        .get('/api/v1/menu')
        .end((err, res) => {
          expect(res).to.have.status(200);
          assert.isArray(res.body.result);
          expect(res.body['status']).to.equal(true);
          return done();
        });
    });
  });
  
  describe('POST /menu', () => {
    it('should return 401 if no auth token was received', (done) => {
      chai.request(app)
        .post('/api/v1/menu')
        .send({name: 'Dodo', cost:'2000', image:'http://example.com/image.jpg'})
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 403 if user is not an admin', (done) => {
      chai.request(app)
        .post('/api/v1/menu')
        .set({ Authorization: `Bearer ${user1token}` })
        .send({name: 'Eba', cost: '800', image: 'http://example.com/image.jpg'})
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 422 for invalid or incomplete food data', (done) => {
      chai.request(app)
        .post('/api/v1/menu')
        .set({ Authorization: `Bearer ${admintoken}` })
        .send({name: '1', cost: '2000', image: 'http://example.com/image.jpg'})
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 201 and food object for successful creation', (done) => {
      chai.request(app)
        .post('/api/v1/menu')
        .set({ Authorization: `Bearer ${admintoken}` })
        .send({name:'Egusi', cost:'1500', image:'http://example.com/image.jpg'})
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body['status']).to.equal(true);
          res.body.should.have.own.property('result');
          foodId1 = res.body.result.id;
          return done();
        });
    });
    it('should return 422 and error if food already exists', (done) => {
      chai.request(app)
        .post('/api/v1/menu')
        .set({ Authorization: `Bearer ${admintoken}` })
        .send({name: 'Egusi', cost: '700', image:'http://example.com/image.jpg'})
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body['status']).to.equal(false);
          res.body.should.have.own.property('message');
          return done();
        });
    });
  });
});

describe('Orders route', () => {
  describe('POST /orders', () => {
    it('should return 401 if no auth token was received', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .send({ 
          foodIds: [foodId1],
          address: 'some place'
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 403 if an admin tries to place an order', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .set({ Authorization: `Bearer ${admintoken}` })
        .send({ 
          foodIds: [foodId1],
          address: 'some place'
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 201 and created object', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .set({ Authorization: `Bearer ${user1token}` })
        .send({ 
          foodIds: [foodId1],
          address: 'some place'
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body['status']).to.equal(true);
          assert.isObject(res.body.result);
          orderId1 = res.body.result.id;
          return done();
        });
    });
    it('should return 201 and created object for another user', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .set({ Authorization: `Bearer ${user2token}` })
        .send({ 
          foodIds: [foodId1],
          address: 'some place'
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body['status']).to.equal(true);
          assert.isObject(res.body.result);
          orderId2 = res.body.result.id;
          return done();
        });
    });
    it('should return 422 for no data received', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .set({ Authorization: `Bearer ${user1token}` })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 422 for incorrect foodId', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .set({ Authorization: `Bearer ${user1token}` })
        .send({ 
          foodIds: [foodId1, 'wrong id'],
          address: 'some address'
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
  });
  describe('GET /orders', () => {
    it('should return 401 if no auth token was received', (done) => {
      chai.request(app)
        .get('/api/v1/orders')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 403 if user is not an admin', (done) => {
      chai.request(app)
        .get('/api/v1/orders')
        .set({ Authorization: `Bearer ${user1token}` })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 200 and an array', (done) => {
      chai.request(app)
        .get('/api/v1/orders')
        .set({ Authorization: `Bearer ${admintoken}` })
        .end((err, res) => {
          expect(res).to.have.status(200);
          assert.isArray(res.body.result);
          expect(res.body['status']).to.equal(true);
          return done();
        });
    });
  });
  describe('GET /orders/:id', () => {
    it('should return 404 for incorrect order id', (done) => {
      chai.request(app)
        .get('/api/v1/orders/777777')
        .set({ Authorization: `Bearer ${admintoken}` })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 403 if the user does not own the order', (done) => {
      chai.request(app)
        .get(`/api/v1/orders/${orderId1}`)
        .set({ Authorization: `Bearer ${user2token}` })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 200 and order if the user owns the order', (done) => {
      chai.request(app)
        .get(`/api/v1/orders/${orderId1}`)
        .set({ Authorization: `Bearer ${user1token}` })
        .end((err, res) => {
          expect(res).to.have.status(200);
          assert.isObject(res.body.result);
          expect(res.body['status']).to.equal(true);
          return done();
        });
    });
    it('should return 200 and order object if user is an admin', (done) => {
      chai.request(app)
        .get(`/api/v1/orders/${orderId2}`)
        .set({ Authorization: `Bearer ${admintoken}` })
        .end((err, res) => {
          expect(res).to.have.status(200);
          assert.isObject(res.body.result);
          expect(res.body['status']).to.equal(true);
          return done();
        });
    });
  });
  describe('PUT /orders/:id', () => {
    it('should return 404 for incorrect order id', (done) => {
      chai.request(app)
        .put('/api/v1/orders/777777')
        .set({ Authorization: `Bearer ${admintoken}` })
        .send({ orderStatus: 'processing' })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 401 for auth token received', (done) => {
      chai.request(app)
        .put('/api/v1/orders/777777')
        .send({ orderStatus: 'processing' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 403 if user is not an admin', (done) => {
      chai.request(app)
        .put(`/api/v1/orders/${orderId1}`)
        .set({ Authorization: `Bearer ${user1token}` })
        .send({ orderStatus: 'processing' })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 422 for no update data received', (done) => {
      chai.request(app)
        .put(`/api/v1/orders/${orderId1}`)
        .set({ Authorization: `Bearer ${admintoken}` })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 422 for invalid orderStatus', (done) => {
      chai.request(app)
        .put(`/api/v1/orders/${orderId1}`)
        .set({ Authorization: `Bearer ${admintoken}` })
        .send({ orderStatus: 'wrong string' })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 200 and the updated order object', (done) => {
      chai.request(app)
        .put(`/api/v1/orders/${orderId1}`)
        .set({ Authorization: `Bearer ${admintoken}` })
        .send({ orderStatus: 'processing' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body['status']).to.equal(true);
          assert.isObject(res.body.result);
          return done();
        });
    });
  });
});

describe('Users Route', () => {
  describe('GET /users/userId/orders', () => {
    it('should return 401 if no auth token was received', (done) => {
      chai.request(app)
        .get(`/api/v1/users/${user1Id}/orders`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 404 if user does not exist', (done) => {
      chai.request(app)
        .get(`/api/v1/users/0/orders`)
        .set({ Authorization: `Bearer ${admintoken}` })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 403 if user does not own the orders', (done) => {
      chai.request(app)
        .get(`/api/v1/users/${user1Id}/orders`)
        .set({ Authorization: `Bearer ${user2token}` })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body['status']).to.equal(false);
          return done();
        });
    });
    it('should return 200 and array for a successful request', (done) => {
      chai.request(app)
        .get(`/api/v1/users/${user1Id}/orders`)
        .set({ Authorization: `Bearer ${user1token}` })
        .end((err, res) => {
          expect(res).to.have.status(200);
          assert.isArray(res.body.result);
          expect(res.body['status']).to.equal(true);
          return done();
        });
    });
    it('should return 200 and array if user is an admin', (done) => {
      chai.request(app)
        .get(`/api/v1/users/${user1Id}/orders`)
        .set({ Authorization: `Bearer ${admintoken}` })
        .end((err, res) => {
          expect(res).to.have.status(200);
          assert.isArray(res.body.result);
          expect(res.body['status']).to.equal(true);
          return done();
        });
    });
  });
});