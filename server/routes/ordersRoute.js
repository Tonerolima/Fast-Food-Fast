import express from 'express';
import middleware from '../middleware';

const router = express();
const v1 = express.Router();


// Place order
v1.post('/', middleware.createOrder, (req, res) => {
  res.status(201).send({ status: true, result: req.order });
});


// Retrieve orders
v1.get('/', middleware.getOrders, (req, res) => res.status(200).send({ status: true, result: req.order }));


// Retrieve specific order
v1.get('/:id', middleware.getOrder, (req, res) => {
  if (!req.order) return res.status(404).send({ status: false, message: 'No order exists for the specified id' });
  return res.status(200).send({ status: true, result: req.order });
});


// Update order status
v1.put('/:id', middleware.updateOrder, (req, res) => {
  res.status(200).send({ status: true, result: req.order, message: `Order status has been updated to ${req.body.orderStatus}` });
});


// Delete order
v1.delete('/:id', middleware.deleteOrder, (req, res) => {
  res.status(200).send({ status: true, result: req.order, message: 'Order deleted' });
});


router.use('/api/v1/orders', v1);

export default router;
