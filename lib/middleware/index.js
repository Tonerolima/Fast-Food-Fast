import menu from '../models/menu';
import orders from '../models/order';


const middleware = {};

middleware.createOrder = (req, res, next) => {
  if (!req.body.foodId) {
    return res.status(400).send({ status: false, message: 'No foodId was received' });
  }
  req.order = orders.addOrder(req.body.foodId);
  if (!req.order) {
    return res.status(404).send({ status: false, message: 'Requested meal does not exist' });
  }
  return next();
};


middleware.getOrder = (req, res, next) => {
  req.order = orders.findOrderById(req.params.id);
  return next();
};


middleware.getOrders = (req, res, next) => {
  req.order = orders.getOders();
  return next();
};


middleware.updateOrder = (req, res, next) => {
  if (!req.body.orderStatus) {
    return res.status(400).send({ status: false, message: 'No data was received to update the orderStatus' });
  }
  req.order = orders.updateOrderStatus(req.params.id, req.body.orderStatus);
  if (!req.order) {
    return res.status(404).send({ status: false, message: 'Order does not exist' });
  }
  return next();
};


middleware.deleteOrder = (req, res, next) => {
  const deleted = orders.deleteOrder(req.params.id);
  if (!deleted) {
    return res.status(404).send({ status: false, message: 'Order does not exist' });
  }
  [req.order] = deleted;
  return next();
};


middleware.getMenu = (req, res, next) => {
  req.menu = menu.getMeals(req.query.offset, req.query.limit, req.query.search);
  return next();
};

export default middleware;
