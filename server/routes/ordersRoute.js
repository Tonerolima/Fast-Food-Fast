import express from 'express';
import middleware from '../middleware';
import Order from '../controllers/ordersController';

const router = express();
const v1 = express.Router();

v1.post('/', middleware.validateFoodIds, Order.createOrder);
v1.get('/', Order.getOrders);
v1.get('/:id', Order.getOrder);
v1.put('/:id', middleware.validateOrderStatus, Order.updateOrderStatus);
v1.delete('/:id', Order.deleteOrder);

router.use('/api/v1/orders', v1);

export default router;
