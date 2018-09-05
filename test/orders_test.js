const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server =  'https://portfolio-tonerolima.c9users.io/api/v1';

chai.use(chaiHttp);


describe('Menu route', () => {
  it('should should have the correct status', (done) => {
    chai.request(server)
      .get('/menu')
      .end((err, res) => {
        expect(res).to.have.status(200);
        return done();
      });
  });
  
  it('should should return an array', (done) => {
    chai.request(server)
      .get('/menu')
      .end((err, res) => {
        assert.isArray(res.body.result, 'what kind of tea do we want?');
        return done();
      });
  });
  
  it('should should return the correct number of elements', (done) => {
    chai.request(server)
      .get('/menu?limit=5')
      .end((err, res) => {
        assert.lengthOf(res.body.result, 5);
        return done();
      });
  });
  
  return;
});

describe('Orders route', () => {
  describe('GET /orders', () => {
    it('should return correct status code', (done) => {
      chai.request(server)
        .get('/orders')
        .end((err, res) => {
          expect(res).to.have.status(200);
          return done();
        });
    });
    
    it('should return an array', (done) => {
      chai.request(server)
        .get('/orders')
        .end((err, res) => {
          assert.isArray(res.body.result);
          return done();
        });
    });
  });
  
  describe('GET /orders/:id', () => {
    it('should return correct status code for incorrect order id', (done) => {
      chai.request(server)
        .get('/orders/4059aa2ccjlp3foi')
        .end((err, res) => {
          expect(res).to.have.status(404);
          return done();
        });
    });
    
    it('should return correct status code for found order and return object', (done) => {
      chai.request(server)
        .get('/orders/4059aa2ccjlp3foin')
        .end((err, res) => {
          expect(res).to.have.status(200);
          assert.isObject(res.body.result);
          return done();
        });
    });
    
  });
  
  describe('POST /orders', () => {
    it('should return correct status code and created object', (done) => {
      chai.request(server)
        .post('/orders')
        .send({foodId: 'eexbt1qvjlm5nj38'})
        .end((err, res) => {
          expect(res).to.have.status(201);
          assert.isObject(res.body.result);
          return done();
        });
    });
    
    it('should return correct status code for no data received', (done) => {
      chai.request(server)
        .post('/orders')
        .end((err, res) => {
          expect(res).to.have.status(400);
          return done();
        });
    });
    
    it('should return correct status code for incorrect foodId', (done) => {
      chai.request(server)
        .post('/orders')
        .send({foodId: 'eexbt1qvjlm5nj3'})
        .end((err, res) => {
          expect(res).to.have.status(404);
          return done();
        });
    });
  });
  
  describe('PUT /orders/:id', () => {
    it('should return correct status code for incorrect order id', (done) => {
      chai.request(server)
        .put('/orders/ubeogbasadgweg')
        .send({ orderStatus: 'confirmed' })
        .end((err, res) => {
          expect(res).to.have.status(404);
          return done();
        });
    });
    
    it('should return correct status code for no data received', (done) => {
      chai.request(server)
        .put('/orders/ubeogbasadgweg')
        .end((err, res) => {
          expect(res).to.have.status(400);
          return done();
        });
    });
    
    it('should return correct status code and return the updated order object', (done) => {
      chai.request(server)
        .put('/orders/4059aa2ccjlp6kneh')
        .send({ 'orderStatus': 'confirmed' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          assert.isObject(res.body.result);
          return done();
        });
    });
  });
  
  describe('DELETE /orders/:id', () => {
    it('should return correct status code for incorrect order id', (done) => {
      chai.request(server)
        .delete('/orders/ubeogbasadgweg')
        .end((err, res) => {
          expect(res).to.have.status(404);
          return done();
        });
    });
    
    it('should return correct status code and return the deleted order object', (done) => {
      chai.request(server)
        .delete('/orders/4059aa2ccjlp3foin')
        .end((err, res) => {
          expect(res).to.have.status(200);
          assert.isObject(res.body.result);
          return done();
        });
    });
  });
})