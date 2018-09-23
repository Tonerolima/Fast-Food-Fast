const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../lib/app').default;

const { assert } = chai;
const { expect } = chai;
const foodId = 'eexbt1qvjlm5nj38';
let user1OrderId;
let user2OrderId;
let token1;
let token2;
let token3;

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
      .get('/api/v1/menu')
      .query({ limit: '5', offset: '1' })
      .end((err, res) => {
        assert.lengthOf(res.body.result, 5);
        return done();
      });
  });
});

describe('Authentication', () => {
  describe('signup', () => {
    it('should return 400 for incomplete user data', (done) => {
      chai.request(app)
      .post('/api/v1/signup')
      .send({ username: '' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        return done();
      });
    });
    it('should return 201 and authentication token for successful signup', (done) => {
      chai.request(app)
      .post('/api/v1/signup')
      .send({ username: 'user1', password: 'user1pass', firstname: 'User', lastname: 'One', email: 'user1@example.com' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('token');
        return done();
      });
    });
    it('should return 400 if user already exists', (done) => {
      chai.request(app)
      .post('/api/v1/signup')
      .send({ username: 'user1', password: 'user1pass', name: 'User One' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        return done();
      });
    });
    it('should handle additional user signup', (done) => {
      chai.request(app)
      .post('/api/v1/signup')
      .send({ username: 'user2', password: 'user2pass', firstname: 'User', lastname: 'Two', email: 'user2@example.com' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('token');
        token2 = res.body.token;
      });
      chai.request(app)
      .post('/api/v1/signup')
      .send({ username: 'user3', password: 'user3pass', firstname: 'User', lastname: 'Three', email: 'user3@example.com' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('token');
        token3 = res.body.token;
      });
      return done();
    });
  });
  describe('Login', () => {
    it('should return 400 for incomplete user data', (done) => {
      chai.request(app)
      .post('/api/v1/login')
      .send({ username: '' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        return done();
      });
    });
    it('should return 404 for incorrect username', (done) => {
      chai.request(app)
      .post('/api/v1/login')
      .send({ username: 'user', password: 'user1pass' })
      .end((err, res) => {
        expect(res).to.have.status(404);
        return done();
      });
    });
    it('should return 401 for incorrect password', (done) => {
      chai.request(app)
      .post('/api/v1/login')
      .send({ username: 'user1', password: 'userpass' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        return done();
      });
    });
    it('should return 200 and authentication token for successful login', (done) => {
      chai.request(app)
      .post('/api/v1/login')
      .send({ username: 'user1', password: 'user1pass' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        token1 = res.body.token;
        return done();
      });
    });
  });
});

describe('Orders route', () => {
  describe('POST /orders', () => {
    it('should return 201 and created object', (done) => {
      chai.request(app)
      .post('/api/v1/orders')
      .set({ Authorization: `Bearer ${token1}` })
      .send({ foodId })
      .end((err, res) => {
        user1OrderId = res.body.result.id;
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('result');
      });
      chai.request(app)
      .post('/api/v1/orders')
      .set({ Authorization: `Bearer ${token2}` })
      .send({ foodId })
      .end((err, res) => {
        user2OrderId = res.body.result.id;
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('result');
      });
      return done();
    });
    it('should return 403 for no authentication token', (done) => {
      chai.request(app)
      .post('/api/v1/orders')
      .end((err, res) => {
        expect(res).to.have.status(403);
        return done();
      });
    });
    it('should return 403 for incorrect authentication token', (done) => {
      chai.request(app)
      .post('/api/v1/orders')
      .set({ Authorization: `Bearer ${token2}a` })
      .end((err, res) => {
        expect(res).to.have.status(403);
        return done();
      });
    });
    it('should return 400 for no foodId received', (done) => {
      chai.request(app)
      .post('/api/v1/orders')
      .set({ Authorization: `Bearer ${token1}` })
      .end((err, res) => {
        expect(res).to.have.status(400);
        return done();
      });
    });
    it('should return 404 for incorrect foodId', (done) => {
      chai.request(app)
      .post('/api/v1/orders')
      .set({ Authorization: `Bearer ${token1}` })
      .send({ foodId: 'eexbt1qvjlm5nj3' })
      .end((err, res) => {
        expect(res).to.have.status(404);
        return done();
      });
    });
  });
  describe('GET /orders', () => {
    it('should return 403 for no authentication token', (done) => {
      chai.request(app)
      .get('/api/v1/orders')
      .end((err, res) => {
        expect(res).to.have.status(403);
        return done();
      });
    });
    it('should return 403 for incorrect authentication token', (done) => {
      chai.request(app)
      .get('/api/v1/orders')
      .set({ Authorization: `Bearer ${token1}b` })
      .end((err, res) => {
        expect(res).to.have.status(403);
        return done();
      });
    });
    it('should return 200 if orders exist', (done) => {
      chai.request(app)
      .get('/api/v1/orders')
      .set({ Authorization: `Bearer ${token1}` })
      .end((err, res) => {
        expect(res).to.have.status(200);
        return done();
      });
    });
    it('should return 404 if no orders exist for the user', (done) => {
      chai.request(app)
      .get('/api/v1/orders')
      .set({ Authorization: `Bearer ${token3}` })
      .end((err, res) => {
        expect(res).to.have.status(404);
        return done();
      });
    });
    it('should return an array', (done) => {
      chai.request(app)
      .get('/api/v1/orders')
      .set({ Authorization: `Bearer ${token1}` })
      .end((err, res) => {
        assert.isArray(res.body.result);
        return done();
      });
    });
  });
  describe('GET /orders/:id', () => {
    it('should return 403 for no authentication token', (done) => {
      chai.request(app)
      .get('/api/v1/orders/4059aa2ccjlp3foi')
      .end((err, res) => {
        expect(res).to.have.status(403);
        return done();
      });
    });
    it('should return 403 for incorrect authentication token', (done) => {
      chai.request(app)
      .get('/api/v1/orders/4059aa2ccjlp3foi')
      .set({ Authorization: `Bearer ${token1}a` })
      .end((err, res) => {
        expect(res).to.have.status(403);
        return done();
      });
    });
    it('should return 404 for incorrect order id', (done) => {
      chai.request(app)
      .get('/api/v1/orders/4059aa2ccjlp3foi')
      .set({ Authorization: `Bearer ${token1}` })
      .end((err, res) => {
        expect(res).to.have.status(404);
        return done();
      });
    });
    it('should return 200 and object for found order', (done) => {
      chai.request(app)
      .get(`/api/v1/orders/${user1OrderId}`)
      .set({ Authorization: `Bearer ${token1}` })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('result');
        return done();
      });
    });
    it('should return 403 for unauthorized access', (done) => {
      chai.request(app)
      .get(`/api/v1/orders/${user1OrderId}`)
      .set({ Authorization: `Bearer ${token2}` })
      .end((err, res) => {
        expect(res).to.have.status(403);
        return done();
      });
    });
  });
  describe('PUT /orders/:id', () => {
    it('should return 403 for no authentication token', (done) => {
      chai.request(app)
      .put('/api/v1/orders/4059aa2ccjlp3foi')
      .end((err, res) => {
        expect(res).to.have.status(403);
        return done();
      });
    });
    it('should return 403 for incorrect authentication token', (done) => {
      chai.request(app)
      .put('/api/v1/orders/4059aa2ccjlp3foi')
      .set({ Authorization: `Bearer ${token1}a` })
      .end((err, res) => {
        expect(res).to.have.status(403);
        return done();
      });
    });
    it('should return 404 for incorrect order id', (done) => {
      chai.request(app)
      .put('/api/v1/orders/ubeogbasadgweg')
      .set({ Authorization: `Bearer ${token1}` })
      .send({ orderStatus: 'confirmed' })
      .end((err, res) => {
        expect(res).to.have.status(404);
        return done();
      });
    });
    it('should return 400 for no update data received', (done) => {
      chai.request(app)
      .put(`/api/v1/orders/${user1OrderId}`)
      .set({ Authorization: `Bearer ${token1}` })
      .end((err, res) => {
        expect(res).to.have.status(400);
        return done();
      });
    });
    it('should return 403 for unauthorized access', (done) => {
      chai.request(app)
      .put(`/api/v1/orders/${user1OrderId}`)
      .set({ Authorization: `Bearer ${token2}` })
      .send({ orderStatus: 'confirmed' })
      .end((err, res) => {
        expect(res).to.have.status(403);
        return done();
      });
    });
    it('should return 201 and the updated order object', (done) => {
      chai.request(app)
      .put(`/api/v1/orders/${user2OrderId}`)
      .set({ Authorization: `Bearer ${token2}` })
      .send({ orderStatus: 'confirmed' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('result');
        return done();
      });
    });
  });
  describe('DELETE /orders/:id', () => {
    it('should return 403 for no authentication token', (done) => {
      chai.request(app)
      .delete('/api/v1/orders/4059aa2ccjlp3foi')
      .end((err, res) => {
        expect(res).to.have.status(403);
        return done();
      });
    });
    it('should return 403 for incorrect authentication token', (done) => {
      chai.request(app)
      .delete('/api/v1/orders/4059aa2ccjlp3foi')
      .set({ Authorization: `Bearer ${token1}a` })
      .end((err, res) => {
        expect(res).to.have.status(403);
        return done();
      });
    });
    it('should return 404 for incorrect order id', (done) => {
      chai.request(app)
      .delete('/api/v1/orders/ubeogbasadgweg')
      .set({ Authorization: `Bearer ${token2}` })
      .end((err, res) => {
        expect(res).to.have.status(404);
        return done();
      });
    });
    it('should return 403 for unauthorized access', (done) => {
      chai.request(app)
      .delete(`/api/v1/orders/${user1OrderId}`)
      .set({ Authorization: `Bearer ${token2}` })
      .end((err, res) => {
        expect(res).to.have.status(403);
        return done();
      });
    });
    it('should return 200 and the deleted order', (done) => {
      chai.request(app)
      .delete(`/api/v1/orders/${user2OrderId}`)
      .set({ Authorization: `Bearer ${token2}` })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('result');
        return done();
      });
    });
  });
});

