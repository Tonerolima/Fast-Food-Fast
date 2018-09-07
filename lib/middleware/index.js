import uniqId from 'uniqid';
import menu from '../models/menu';

const orders = [];
const middleware = {};

middleware.createOrder = (req, res, next) => {
  if (!req.body.foodId) {
    return res.status(400).send({ status: false, message: 'No foodId was received' });
  }
  const meal = menu.findMealById(req.body.foodId);
  if (!meal) {
    return res.status(404).send({ status: false, message: 'Requested meal does not exist' });
  }
  req.order = {...meal, id: uniqId(), status: 'pending'};
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
  if (!req.body.orderStatus) {
    return res.status(400).send({ status: false, message: 'No data was received to update the orderStatus' });
  }
  req.order = orders.find(order => order.id === req.params.id);
  if (!req.order) {
    return res.status(404).send({ status: false, message: 'Order does not exist' });
  }
  req.order.orderStatus = req.body.orderStatus;
  return next();
};


middleware.deleteOrder = (req, res, next) => {
  const index = orders.findIndex(order => order.id === req.params.id);
  if (index < 0) {
    return res.status(404).send({ status: false, message: 'Order does not exist' });
  }
  const deleted = orders.splice(index, 1);
  [req.order] = deleted;
  return next();
};


middleware.getMenu = (req, res, next) => {
  req.menu = menu.getMeals(req.query.offset, req.query.limit, req.query.search);
  return next();
};

export default middleware;
