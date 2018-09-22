import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import menu from '../models/menu';
import orders from '../models/order';
import User from '../models/user';

const middleware = {};

middleware.createOrder = (req, res, next) => {
  if (!req.body.foodId) {
    return res.status(400).send({ status: false, message: 'No foodId was received' });
  }
  req.order = orders.addOrder(req.body.foodId, req.decoded.id);
  if (!req.order) {
    return res.status(404).send({ status: false, message: 'Requested meal does not exist' });
  }
  return next();
};

middleware.getOrder = (req, res, next) => {
  req.order = orders.findOrderById(req.params.id);
  if (!req.order) return res.status(404).send({ status: false, message: 'No order exists for the specified id' });
  if (req.order.userId !== req.decoded.id) {
    return res.status(403).send({ status: false, message: 'Access denied' });
  }
  return next();
};

middleware.getOrders = (req, res, next) => {
  req.order = orders.getOders(req.decoded.id);
  if (!req.order[0]) return res.status(404).send({ status: false, message: 'No order exists for the user' });
  return next();
};

middleware.updateOrder = (req, res, next) => {
  if (!req.body.orderStatus) {
    return res.status(400).send({ status: false, message: 'No data was received to update the orderStatus' });
  }
  const order = orders.findOrderById(req.params.id);
  if (!order) { return res.status(404).send({ status: false, message: 'Order does not exist' }); }
  if (order.userId !== req.decoded.id) { return res.status(403).send({ status: false, message: 'Access denied' }); }
  req.order = orders.updateOrderStatus(req.params.id, req.body.orderStatus);
  return next();
};

middleware.deleteOrder = (req, res, next) => {
  const order = orders.findOrderById(req.params.id);
  if (!order) { return res.status(404).send({ status: false, message: 'Order does not exist' }); }
  if (order.userId !== req.decoded.id) { return res.status(403).send({ status: false, message: 'Access denied' }); }
  const deleted = orders.deleteOrder(req.params.id);
  [req.order] = deleted;
  return next();
};

middleware.getMenu = (req, res, next) => {
  req.menu = menu.getMeals(req.query.offset, req.query.limit, req.query.search);
  if (req.menu.length === 0) {
    return res.status(404).send({ status: false, message: 'No dish found for the search criteria' });
  }
  return next();
};

middleware.createUser = (req, res, next) => {
  const { username, password, name } = req.body;
  if (!username || !password || !name) {
    return res.status(400).send({ status: false, message: 'Incomplete data' });
  }
  req.newUser = User.create(username, password, name);
  if (!req.newUser) { return res.status(400).send({ status: false, message: 'User already exists' }); }
  return next();
};

middleware.authenticate = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ status: false, message: 'Incomplete data' });
  }
  req.user = User.findByUsername(username);
  if (!req.user) { return res.status(404).send({ status: false, message: 'Incorrect username' }); }
  bcrypt.compare(password, req.user.password, (err, response) => {
    if (!response) {
      return res.status(401).send({ status: false, message: 'Incorrect password' });
    }
    return next();
  });
};

middleware.verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (typeof authorization === 'undefined') {
    return res.status(403).send({ status: false, message: 'Token not received' });
  }
  const token = authorization.split(' ')[1];
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) { return res.status(403).send({ status: false, message: err.name }); }
    req.decoded = decoded;
    return next();
  });
};

export default middleware;
