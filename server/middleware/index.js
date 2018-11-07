import jwt from 'jsonwebtoken';
import db from '../config/dbconfig';

class Middleware {
  static validateParams(req, res, next) {
    const { params } = req;
    for (const [key, param] of Object.entries(params)) {
      if (Number(req.params[key]) !== Number.parseInt(param, 10)) {
        return res.status(422).json({
          status: false,
          message: `${param} must be a number`,
        });
      }
    }
    return next();
  }

  static validateMenuItem(req, res, next) {
    req.check('name')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Name cannot be empty')
      .isLength({ min: 2, max: 25 })
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
        message: 'Invalid food data',
        result,
      });
    }
    req.body.name = req.body.name.toLowerCase();
    return next();
  }

  static async validateFoodIds(req, res, next) {
    if (!req.body.foodIds || !req.body.foodIds[0]) {
      return res.status(422).json({
        status: false,
        message: 'No foodId received',
      });
    }

    const { foodIds } = req.body;
    const queryString = `SELECT COUNT(id) as count, SUM(cost) as sum 
      FROM menu WHERE id IN (${foodIds})`;

    try {
      const response = await db.query(queryString);
      if (Number(response.rows[0].count) !== foodIds.length) {
        return res.status(422).json({
          status: false,
          message: 'Invalid foodId',
        });
      }
      req.amount = response.rows[0].sum;
      return next();
    } catch (error) {
      return res.status(422).json({
        status: false,
        message: 'foodIds should only include numbers',
      });
    }
  }

  static validateOrderStatus(req, res, next) {
    if (!req.body.orderStatus) {
      return res.status(422).json({
        status: false,
        message: 'No orderStatus received',
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
    return next();
  }

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

    req.check('email')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Email must not be empty')
      .isEmail()
      .withMessage('Enter a valid email address');

    req.check('address')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Address must not be empty')
      .isLength({ min: 6, max: 40 })
      .withMessage('Address must have between 6 - 40 characters');

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
        message: 'Invalid user data',
        result,
      });
    }
    return next();
  }

  static validateLogin(req, res, next) {
    req.check('email')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Email must not be empty')
      .isEmail()
      .withMessage('Enter a valid email address');

    req.check('password')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Password must not be empty');

    const errors = req.validationErrors();

    if (errors) {
      const result = [];
      errors.forEach(error => result.push(error.msg));
      return res.status(422).json({
        status: false,
        message: 'Invalid Username/Password',
        result,
      });
    }
    return next();
  }

  static async verifyToken(req, res, next) {
    const { authorization } = req.headers;
    if (typeof authorization === 'undefined') {
      return res.status(401).send({
        status: false,
        message: 'Authorization token not received',
      });
    }
    const token = authorization.split(' ')[1];
    try {
      req.user = jwt.verify(token, process.env.JWTSECRET);
    } catch (error) {
      return res.status(401).send({
        status: false,
        message: 'Invalid token',
      });
    }
    return next();
  }

  static async verifyUser(req, res, next) {
    const query = `SELECT id FROM users WHERE id = '${req.params.id}'`;
    const response = await db.query(query);
    if (response.rowCount === 0) {
      return res.status(404).json({
        status: false,
        message: 'User does not exist',
      });
    }
    return next();
  }
}

export default Middleware;
