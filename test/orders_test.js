const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);


describe('Menu Route', () => {
  it('should should have the correct status', (done) => {
    chai.request('https://portfolio-tonerolima.c9users.io')
      .get('/menu')
      .end((err, res) => {
         expect(res).to.have.status(200);
         done()
      })
  });
  it('should should return an array', (done) => {
    chai.request('https://portfolio-tonerolima.c9users.io')
      .get('/menu')
      .end((err, res) => {
         assert.isArray(res.body.result, 'what kind of tea do we want?');
         done()
      })
  });
  it('should should return the correct number of elements', (done) => {
    chai.request('https://portfolio-tonerolima.c9users.io')
      .get('/menu?limit=5')
      .end((err, res) => {
         assert.lengthOf(res.body.result, 5);
         done()
      })
  });
});
