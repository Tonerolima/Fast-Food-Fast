const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/app').default;

const { assert } = chai;
const { expect } = chai;
chai.should();

const foodId = 'eexbt1qvjlm5nj38';

// test user objects
const userTemplate = {
  firstname: "User",
  lastname: "One",
  address: "user one address",
  phone: "08012345678",
  password: "password",
  admin_secret: "secret"
};

const user1 = {...userTemplate, username: "userone" };
const user2 = {...userTemplate, username: "usertwo" };
const admin1 = {...userTemplate, username: "adminone", admin_secret: "secret" };
const admin2 = {...userTemplate, username: "admintwo", admin_secret: "wrong" };

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

describe('Authentication', () => {
  describe('signup', () => {
    it('should return 400 for incomplete user data and include an error message', (done) => {
      chai.request(app)
      .post('/api/v1/auth/signup')
      .send(userTemplate)
      .end((err, res) => {
        expect(res).to.have.status(400);
        res.body.should.have.own.property('error');
        return done();
      });
    });
    it('should return 401 for incorrect admin_secret and include an error message', (done) => {
      chai.request(app)
      .post('/api/v1/auth/signup')
      .send(admin2)
      .end((err, res) => {
        expect(res).to.have.status(401);
        res.body.should.have.own.property('error');
        return done();
      });
    });
    it('should return 201 and user object with authentication token for successful user signup', (done) => {
      chai.request(app)
      .post('/api/v1/auth/signup')
      .send(user1)
      .end((err, res) => {
        expect(res).to.have.status(201);
        res.body.should.have.own.property('result');
        res.body.result.should.have.own.property('token');
        return done();
      });
    });
    it('should return 201 and user object with authentication token for successful admin signup', (done) => {
      chai.request(app)
      .post('/api/v1/auth/signup')
      .send(admin1)
      .end((err, res) => {
        expect(res).to.have.status(201);
        res.body.should.have.own.property('result');
        res.body.result.should.have.own.property('token');
        return done();
      });
    });
    it('should return 400 and error message if user already exists', (done) => {
      chai.request(app)
      .post('/api/v1/auth/signup')
      .send(user1)
      .end((err, res) => {
        expect(res).to.have.status(400);
        res.body.should.have.own.property('error');
        return done();
      });
    });
    it('should handle additional user signup', (done) => {
      chai.request(app)
      .post('/api/v1/auth/signup')
      .send(user2)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.own.property('result');
        expect(res.body.result).to.have.own.property('token');
        return done();
      });
    });
  });
});
