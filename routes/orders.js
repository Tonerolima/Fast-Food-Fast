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
  res.status(200).send(result);
});


// Place order
v1.post('/orders', (req, res) => {
  if (!req.body.foodId) return res.status(400).send('No data was received or unsupported data type');
  const index = menu.findIndex(element => element.id === req.body.foodId);
  if (index < 0) return res.status(404).send('Food does not exist');
  const newOrder = Object.assign({}, menu[index]);
  newOrder.id = uniqId();
  newOrder.orderStatus = 'pending';
  orders.push(newOrder);
  return res.status(201).send(newOrder);
});


// Retrieve orders
v1.get('/orders', (req, res) => {
  res.status(200).send(orders);
});


// Retrieve specific order
v1.get('/orders/:id', (req, res) => {
  const obj = orders.find(element => element.id === req.params.id);
  if (obj) return res.status(200).send(obj);
  return res.status(404).send('No order exists for the specified id');
});


// Update order status
v1.put('/orders/:id', (req, res) => {
  if (!req.body.orderStatus) return res.status(400).send('No data was received or unsupported data type');
  const index = orders.findIndex(order => order.id === req.params.id);
  if (index < 0) return res.status(404).send('Order does not exist');
  orders[index].orderStatus = req.body.orderStatus;
  return res.status(201).send(`Order status has been updated to ${req.body.orderStatus}`);
});


// Delete order
v1.delete('/orders/:id', (req, res) => {
  const index = orders.findIndex(order => order.id === req.params.id);
  if (index < 0) return res.status(404).send('Order does not exist');
  orders.splice(index, 1);
  return res.status(200).send('order deleted');
});


// Default routes
v1.get('/*', (req, res) => {
  res.status(400).send('Invalid request');
});


router.use('/api/v1', v1);
router.use('/', v1);


export default router;
