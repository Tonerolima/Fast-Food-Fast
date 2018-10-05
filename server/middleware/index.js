import jwt from 'jsonwebtoken';
import db from '../config/dbconfig';

class Middleware {
  
  static validateParams(req, res, next) {
    const params = req.params;
    for (const param in params) {
      if (req.params[param] != Number.parseInt(params[param], 10)) {
        return res.status(422).json({
          status: false,
          message: `${param} must be a number`
        });
      }
    }
    next();
  }

  static validateMenuItem(req, res, next) {
    req.check('name')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Name cannot be empty')
      .isLength({ min: 2, max: 25})
      .withMessage('Name must be between 2 to 25 characters');
      
    req.check('cost')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Cost cannot be empty')
      .isNumeric({ no_symbols: true })
      .withMessage('Cost can only contain positive whole numbers')
      .isLength({ min: 3, max: 5 })
      .withMessage('Cost must be between 3 to 5 digits');
      
    req.check('image')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Image cannot be empty')
      .isURL()
      .withMessage('Image must be a valid URL');
    
    const errors = req.validationErrors();
  
    if (errors) {
      const result = [];
      errors.forEach(error => result.push(error.msg));
      return res.status(422).json({ 
        status: false, 
        message: 'Invalid food data', result });
    }
    
    req.body.name = req.body.name.toLowerCase();
  
    next();
  };
  
  static validateFoodIds(req, res, next) {
    if (!req.body.foodIds || !req.body.foodIds[0]) {
      return res.status(422).json({
        status: false,
        message: 'No foodId received'
      });
    }
    
    // Check if foodIds exist in the database
    const foodIds = req.body.foodIds;
    
    const queryString = `SELECT COUNT(id) as count, SUM(cost) as sum 
      FROM menu WHERE id IN (${foodIds})`;
      
    db.query(queryString)
      .then((response) => {
        if (!(response.rows[0].count == foodIds.length)) {
          return res.status(422).json({
            status: false,
            message: 'Invalid foodId'
          });
        }
        req.amount = response.rows[0].sum;
        return next();
      })
      .catch((error) => {
        return res.status(422).json({
          status: false,
          message: 'foodIds should only include numbers' });
      });
  };
  
  static validateOrderStatus(req, res, next) {
    if (!req.body.orderStatus) {
      return res.status(422).json({
        status: false,
        message: 'No orderStatus received'
      });
    }
  
    req.orderStatus = req.body.orderStatus.toLowerCase();
    const validOrderStatus = ['new', 'processing', 'cancelled', 'complete'];
    
    if (!validOrderStatus.includes(req.orderStatus)) {
      return res.status(422).send({
        status: false,
        message: `orderStatus must be one of ${[...validOrderStatus]}`,
      });
    }
    next();
  };
  
  static validateSignup(req, res, next) {
    if (req.body.admin_secret) {
      if (req.body.admin_secret !== process.env.ADMINSECRET) {
        const response = { status: false, message: 'Invalid admin secret' };
        return res.status(422).json(response);
      }
      req.body.isAdmin = true;
    } else {
      req.body.isAdmin = false;
    }
  
    // Run validations against all form fields
  
    req.check('firstname')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('First name must not be empty')
      .isAlpha()
      .withMessage('First name can only contain alphabets')
      .isLength({ min: 2, max: 25 })
      .withMessage('First name must have between 2 - 25 characters');
  
    req.check('lastname')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Last name must not be empty')
      .isAlpha()
      .withMessage('Last name can only contain alphabets')
      .isLength({ min: 2, max: 25 })
      .withMessage('Last name must have between 2 - 25 characters');
  
    req.check('username')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Username must not be empty')
      .isLength({ min: 4, max: 25 })
      .withMessage('Username must have between 2 - 25 characters');
  
    req.check('address')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Address must not be empty')
      .isLength({ min: 6, max: 40 })
      .withMessage('Address must have between 6 - 40 characters');
  
    req.check('phone')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Phone number must not be empty')
      .isNumeric({ min: 11, max: 11, no_symbols: true })
      .withMessage('Phone number can only contain numbers')
      .isLength({ min: 11, max: 11 })
      .withMessage('Phone number must be exactly 11 digts');
  
    req.check('password')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Password must not be empty')
      .isLength({ min: 6, max: 25 })
      .withMessage('Password must have between 6 - 25 characters');
  
    const errors = req.validationErrors();
  
    if (errors) {
      const result = [];
      errors.forEach(error => result.push(error.msg));
      return res.status(422).json({ 
        status: false, 
        message: 'Invalid user data', result });
    }
  
    next();
  };
  
  static validateLogin(req, res, next) {
    req.check('username')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Username must not be empty');
  
    req.check('password')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Password must not be empty');
  
    const errors = req.validationErrors();
  
    if (errors) {
      const result = [];
      errors.forEach(error => result.push(error.msg));
      return res.status(422).json({ 
        status: false, 
        message: 'Invalid Username/Password', result });
    }
  
    next();
  };
  
  static verifyToken(req, res, next) {
    const { authorization } = req.headers;
    if (typeof authorization === 'undefined') {
      return res.status(401).send({ 
        status: false,
        message: 'Authorization token not received'
      });
    }
    const token = authorization.split(' ')[1];
    jwt.verify(token, process.env.JWTSECRET, (err, user) => {
      if (err) { return res.status(401).send({ 
        status: false, 
        message: 'Invalid token'}
      )}
      req.user = user;
      return next();
    });
  };
  
  static verifyUser (req, res, next) {
    db.query(`SELECT id FROM users WHERE id = '${req.params.id}'`)
      .then((response) => {
        if (response.rowCount === 0) {
          return res.status(404).json({
            status: false,
            message: 'User does not exist'
          });
        }
        return next();
      });
  };
}

export default Middleware;
