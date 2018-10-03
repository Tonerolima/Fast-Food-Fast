import express from 'express';
import User from '../controllers/usersController';
import middleware from '../middleware';

const { verifyToken, verifyUser, checkFoodId } = middleware;

const v1 = express.Router();
const router = express();

v1.get('/users/:id/orders', verifyToken, verifyUser, User.retrieveOrders);
v1.get('/users/:id/cart', verifyToken, verifyUser, User.retrieveCart);
v1.put('/users/:id/cart', verifyToken, checkFoodId, verifyUser, User.addToCart);
v1.delete('/users/:id/cart/:foodId', verifyToken, verifyUser, User.removeFromCart);

router.use('/api/v1', v1);

export default router;
