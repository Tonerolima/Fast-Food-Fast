import express from 'express';
import uniqId from 'uniqid';
import menu from '../data/menu';

const router = express();
const v1 = express.Router();
const orders = [];


// Retrieve menu
v1.get('/menu', (req, res) => {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  const result = menu.slice(offset, offset + limit);
  res.status(200).send( { status: true, result } );
});


// Place order
v1.post('/orders', (req, res) => {
  if (!req.body.foodId) return res.status(400).send( { status: false, message: 'No data was received or unsupported data type' } );
  const index = menu.findIndex(element => element.id === req.body.foodId);
  if (index < 0) return res.status(404).send( { status: false, message: 'Food does not exist' } );
  const order = Object.assign({}, menu[index]);
  order.id = uniqId();
  order.orderStatus = 'pending';
  orders.push(order);
  return res.status(201).send( { status: true, order } );
});


// Retrieve orders
v1.get('/orders', (req, res) => {
  res.status(200).send( { status: true, orders } );
});


// Retrieve specific order
v1.get('/orders/:id', (req, res) => {
  const order = orders.find(element => element.id === req.params.id);
  if (order) return res.status(200).send( { status: true, order } );
  return res.status(404).send( { status: false, message: 'No order exists for the specified id' } );
});


// Update order status
v1.put('/orders/:id', (req, res) => {
  if (!req.body.orderStatus) return res.status(400).send( { status: false, message: 'No data was received or unsupported data type' } );
  const order = orders.find(order => order.id === req.params.id);
  if (!order) return res.status(404).send( { status: false, message: 'Order does not exist' } );
  order.orderStatus = req.body.orderStatus;
  return res.status(201).send( { status: true, order, message: `Order status has been updated to ${req.body.orderStatus}` } );
});


// Delete order
v1.delete('/orders/:id', (req, res) => {
  const index = orders.findIndex(order => order.id === req.params.id);
  if (index < 0) return res.status(404).send( { status: false, message: 'Order does not exist' } );
  orders.splice(index, 1);
  return res.status(200).send( { status: true, message: 'order deleted' } );
});


// Default routes
v1.get('/*', (req, res) => {
  res.status(400).send( { status: false, message: 'Invalid request' } );
});


router.use('/api/v1', v1);
router.use('/', v1);


export default router;
