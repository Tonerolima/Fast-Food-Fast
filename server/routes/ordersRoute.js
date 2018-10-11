import express from 'express';
import middleware from '../middleware';
import Order from '../controllers/ordersController';

const {
  verifyToken, validateFoodIds, validateOrderStatus, validateParams,
} = middleware;

const router = express();
const v1 = express.Router();

v1.post('/', verifyToken, validateFoodIds, Order.createOrder);
v1.get('/', verifyToken, Order.getOrders);
v1.get('/:id', verifyToken, validateParams, Order.getOrder);
v1.put('/:id', verifyToken, validateParams, validateOrderStatus,
  Order.updateOrderStatus);

router.use('/api/v1/orders', v1);

export default router;
