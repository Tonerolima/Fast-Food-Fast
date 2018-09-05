import uniqId from 'uniqid';
import menu from '../data/menu';

const orders = [];
const middleware = {};

middleware.createOrder = (req, res, next) => {
  if (!req.body.foodId) { return res.status(400).send({ status: false, message: 'No data was received or unsupported data type' }); }
  const meal = menu.find(element => element.id === req.body.foodId);
  if (!meal) { return res.status(404).send({ status: false, message: 'Requested meal does not exist' }); }
  req.order = Object.assign({}, meal);
  req.order.id = uniqId();
  req.order.orderStatus = 'pending';
  orders.push(req.order);
  return next();
};


middleware.getOrder = (req, res, next) => {
  if (!req.params.id) {
    req.order = orders;
    return next();
  }
  req.order = orders.find(element => element.id === req.params.id);
  return next();
};


middleware.updateOrder = (req, res, next) => {
  if (!req.body.orderStatus) { return res.status(400).send({ status: false, message: 'No data was received or unsupported data type' }); }
  req.order = orders.find(order => order.id === req.params.id);
  if (!req.order) { return res.status(404).send({ status: false, message: 'Order does not exist' }); }
  req.order.orderStatus = req.body.orderStatus;
  return next();
};


middleware.deleteOrder = (req, res, next) => {
  const index = orders.findIndex(order => order.id === req.params.id);
  if (index < 0) { return res.status(404).send({ status: false, message: 'Order does not exist' }); }
  const deleted = orders.splice(index, 1);
  [req.order] = deleted;
  return next();
};


middleware.getMenu = (req, res, next) => {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  if(req.query.search) {
    const search = req.query.search.toLowerCase();
    const result = menu.filter(food => {
      return food.name.toLowerCase().includes(search);
    });
    req.menu = result.slice(offset, offset + limit);
    return next();
  }
  req.menu = menu.slice(offset, offset + limit);
  next();
};

export default middleware;
