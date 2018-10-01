import express from 'express';
import Order from '../controllers/ordersController';
import middleware from '../middleware';

const { verifyToken, verifyUser } = middleware;

const v1 = express.Router();
const router = express();

v1.get('/users/:id/orders', verifyToken, verifyUser, Order.getUserOrders);

router.use('/api/v1', v1);

export default router;
