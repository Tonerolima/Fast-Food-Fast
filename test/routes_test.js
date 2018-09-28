require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/app').default;

const { assert } = chai;
const { expect } = chai;
chai.should();

const foodId = 'eexbt1qvjlm5nj38';

let orderId;

chai.use(chaiHttp);

describe('Root route', () => {
  it('should return 400 for any endpoint not defined', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(400);
        return done();
      });
  });
});

describe('Menu route', () => {
  it('should return 200 for a successful request', (done) => {
    chai.request(app)
      .get('/api/v1/menu')
      .end((err, res) => {
        expect(res).to.have.status(200);
        return done();
      });
  });
  it('should return an array', (done) => {
    chai.request(app)
      .get('/api/v1/menu')
      .end((err, res) => {
        assert.isArray(res.body.result);
        return done();
      });
  });
  it('should return menu items that match a seacrh string', (done) => {
    chai.request(app)
      .get('/api/v1/menu?search=rice')
      .end((err, res) => {
        assert.isAtLeast(res.body.result.length, 1);
        return done();
      });
  });
  it('should return 404 if no food match a seacrh string', (done) => {
    chai.request(app)
      .get('/api/v1/menu?search=zzz')
      .end((err, res) => {
        expect(res).to.have.status(404);
        return done();
      });
  });
  it('should limit the number of returned menu items', (done) => {
    chai.request(app)
      .get('/api/v1/menu?limit=5')
      .end((err, res) => {
        assert.lengthOf(res.body.result, 5);
        return done();
      });
  });
});

describe('Authentication', () => {
  describe('signup', () => {
    it('should return 400 for incomplete user data and include an error message', (done) => {
      chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        "firstname": "tony",
        "lastname": "pass",
        "username": "tonypass",
        "address": "awoniyi"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        res.body.should.have.own.property('message');
        return done();
      });
    });
    it('should return 401 for incorrect admin_secret and include an error message', (done) => {
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
        expect(res).to.have.status(401);
        res.body.should.have.own.property('message');
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
        return done();
      });
    });
    it('should return 400 and error messages for invalid data', (done) => {
      chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        "firstname": "",
        "lastname": "two",
        "username": "usertwo",
        "address": "example",
        "phone": "08012345678",
        "password": "usertwopass"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.own.property('message');
        expect(res.body['status']).to.equal(false);
      });
      chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        "firstname": "2",
        "lastname": "233",
        "username": "usertwo",
        "address": "example",
        "phone": "08012345678",
        "password": "usertwopass"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.own.property('message');
        expect(res.body['status']).to.equal(false);
      });
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
        expect(res).to.have.status(400);
        expect(res.body).to.have.own.property('message');
        expect(res.body['status']).to.equal(false);
      });
      return done();
    })
  });
  
  describe('login', () => {
    it('should return 400 for no username received', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        password: 'useronepass'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        return done();
      });
    })
    it('should return 400 for no password received', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'userone'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        return done();
      });
    })
    it('should return 404 for incorrect username', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'userthree',
        password: 'useronepass'
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        return done();
      });
    })
    it('should return 401 for incorrect password', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'userone',
        password: 'useronepa'
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        return done();
      });
    })
    it('should return 200 for successful login', (done) => {
      chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'userone',
        password: 'useronepass'
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        return done();
      });
    })
  })
});


describe('Orders route', () => {
  describe('POST /orders', () => {
    it('should return 201 and created object', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .send({ foodId })
        .end((err, res) => {
          orderId = res.body.result.id;
          expect(res).to.have.status(201);
          assert.isObject(res.body.result);
          return done();
        });
    });
    it('should return 400 for no data received', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .end((err, res) => {
          expect(res).to.have.status(400);
          return done();
        });
    });
    it('should return 404 for incorrect foodId', (done) => {
      chai.request(app)
        .post('/api/v1/orders')
        .send({ foodId: 'eexbt1qvjlm5nj3' })
        .end((err, res) => {
          expect(res).to.have.status(404);
          return done();
        });
    });
  });
  describe('GET /orders', () => {
    it('should return 200', (done) => {
      chai.request(app)
        .get('/api/v1/orders')
        .end((err, res) => {
          expect(res).to.have.status(200);
          return done();
        });
    });
    it('should return an array', (done) => {
      chai.request(app)
        .get('/api/v1/orders')
        .end((err, res) => {
          assert.isArray(res.body.result);
          return done();
        });
    });
  });
  describe('GET /orders/:id', () => {
    it('should return 404 for incorrect order id', (done) => {
      chai.request(app)
        .get('/api/v1/orders/4059aa2ccjlp3foi')
        .end((err, res) => {
          expect(res).to.have.status(404);
          return done();
        });
    });
    it('should return 200 for found order and return object', (done) => {
      chai.request(app)
        .get(`/api/v1/orders/${orderId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          assert.isObject(res.body.result);
          return done();
        });
    });
  });
  describe('PUT /orders/:id', () => {
    it('should return 404 for incorrect order id', (done) => {
      chai.request(app)
        .put('/api/v1/orders/ubeogbasadgweg')
        .send({ orderStatus: 'processing' })
        .end((err, res) => {
          expect(res).to.have.status(404);
          return done();
        });
    });
    it('should return 400 for no update data received', (done) => {
      chai.request(app)
        .put(`/api/v1/orders/${orderId}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          return done();
        });
    });
    it('should return 422 for invalid orderStatus', (done) => {
      chai.request(app)
        .put('/api/v1/orders/ubeogbasadgweg')
        .send({ orderStatus: 'wrong string' })
        .end((err, res) => {
          expect(res).to.have.status(422);
          return done();
        });
    });
    it('should return 200 and the updated order object', (done) => {
      chai.request(app)
        .put(`/api/v1/orders/${orderId}`)
        .send({ orderStatus: 'processing' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          assert.isObject(res.body.result);
          return done();
        });
    });
  });
  describe('DELETE /orders/:id', () => {
    it('should return 404 for incorrect order id', (done) => {
      chai.request(app)
        .delete('/api/v1/orders/ubeogbasadgweg')
        .end((err, res) => {
          expect(res).to.have.status(404);
          return done();
        });
    });
    it('should return 200 and the deleted order object', (done) => {
      chai.request(app)
        .delete(`/api/v1/orders/${orderId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          assert.isObject(res.body.result);
          return done();
        });
    });
  });
});
