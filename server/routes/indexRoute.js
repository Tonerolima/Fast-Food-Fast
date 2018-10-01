import express from 'express';
import middleware from '../middleware';
import User from '../controllers/usersController';

const { validateSignup, validateLogin } = middleware;

const v1 = express.Router();
const router = express();

v1.post('/auth/signup', validateSignup, User.signup);
v1.post('/auth/login', validateLogin, User.login);

router.use('/api/v1', v1);

// Other routes
router.all('/*', (req, res) => {
  res.status(404).send({ status: false, message: 'Invalid request' });
});


export default router;
