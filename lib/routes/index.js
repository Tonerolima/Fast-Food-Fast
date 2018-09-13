import express from 'express';
import jwt from 'jsonwebtoken';
import middleware from '../middleware';

const router = express();
const v1 = express.Router();

v1.post('/signup', middleware.createUser, (req, res) => {
  jwt.sign(req.newUser, 'secret', (err, token) => res.status(201).send({ status: true, token }));
});

v1.post('/login', middleware.authenticate, (req, res) => {
  jwt.sign(req.user, 'secret', (err, token) => res.status(200).send({ status: true, token }));
});

router.use('/api/v1', v1);

// Other routes
router.all('/*', (req, res) => {
  res.status(400).send({ status: false, message: 'Invalid request' });
});


export default router;
