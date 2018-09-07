const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../lib/app').default;

const { assert } = chai;
const { expect } = chai;
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
      })
  })
})

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
        .send({ orderStatus: 'confirmed' })
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
    it('should return 201 and the updated order object', (done) => {
      chai.request(app)
        .put(`/api/v1/orders/${orderId}`)
        .send({ orderStatus: 'confirmed' })
        .end((err, res) => {
          expect(res).to.have.status(201);
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

