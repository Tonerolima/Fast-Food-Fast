import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../config/dbconfig';

class User {
  static signup(req, res) {
    const {
      firstname, lastname, username, address, phone, password, isAdmin,
    } = req.body;
    bcrypt.genSalt(10, async (error, salt) => {
      await bcrypt.hash(password, salt, (err, hash) => {
        const query = {
          text: `INSERT INTO users(firstname, lastname, username, address, phone, password, isAdmin) 
                            VALUES($1, $2, $3, $4, $5, $6, $7) 
                            RETURNING id, firstname, lastname, username, address, phone, isAdmin`,
          values: [firstname, lastname, username, address, phone, hash, isAdmin],
        };
        db.query(query)
          .then((response) => {
            const newUser = response.rows[0];
            jwt.sign(newUser, process.env.JWTSECRET, async (er, token) => {
              res.status(201).json({
                status: true,
                message: 'Account created successfully',
                result: newUser,
                token
              });
            });
          })
          .catch((e) => {
            res.status(409).json({
              status: false,
              message: 'A user with that username already exists',
            });
          });
      });
    });
  }

  static login(req, res) {
    db.query(`SELECT * FROM users WHERE username = '${req.body.username}'`)
      .then((response) => {
        const user = response.rows[0];
        bcrypt.compare(req.body.password, user.password, (error, resp) => {
          if (!resp) {
            return res.status(422).json({ 
              status: false, 
              message: 'Incorrect password' });
          }
          let result;
          jwt.sign(user, process.env.JWTSECRET, (err, token) => {
            
          // copy all user data to a new object excluding password
            result = (({
              id, firstname, lastname, username, phone, isadmin, cart,
            }) => ({
              id, firstname, lastname, username, phone, isadmin, cart,
            }))(user);
            
            return res.status(200).json({ 
              status: true, 
              message: 'Login successful',
              result,
              token
            });
          });
          
        });
      })
      .catch(e => res.status(422).send({ 
        status: false, 
        message: 'Incorrect username' }));
  }
  
  static addToCart(req, res) {
    const foodId = req.body.foodId;
    const userId = req.params.id;
    
    if (req.user.isadmin) {
      return res.status(403).json({
        status: false,
        message: 'Admins cannot add items to cart'
      });
    }
    
    const query = `SELECT cart FROM users WHERE id = '${userId}'`;
    db.query(query)
      .then((response => {
        const cart = response.rows[0].cart || [];
        if (cart.includes(foodId.toString())) {
          return res.status(409).json({
            status: false,
            message: 'Food has already been added to cart'
          });
        }
        cart.push(req.body.foodId);
        db.query(`UPDATE users SET cart = ARRAY[${cart}] WHERE id = '${userId}'`)
          .then((result) => {
            return res.status(200).json({
              status: true,
              message: 'Cart updated successfully'
            });
          })
          .catch(error => {
            return res.status(500).json({
              status: false,
              message: error
            });
          });
      }));
  }

  static removeFromCart(req, res) {
    if (req.user.isadmin) {
      return res.status(403).json({
        status: false,
        message: 'Admins cannot delete users cart entries'
      });
    }
    
    const foodId = req.params.foodId;
    const userId = req.params.id;
    const query = `SELECT cart FROM users WHERE id = '${userId}'`;
    db.query(query)
      .then((response => {
        const cart = response.rows[0].cart || [];
        const index = cart.findIndex(id => id == foodId);
        
        if (index < 0) {
          return res.status(422).json({
            status: false,
            message: 'Food item not found in cart'
          });
        }
        cart.splice(index, 1);
        db.query(`UPDATE users SET cart = ARRAY[${cart}]::integer[] WHERE id = '${userId}'`)
          .then((result) => {
            return res.status(200).json({
              status: true,
              message: 'Food item removed successfully'
            });
          })
          .catch(error => {
            return res.status(500).json({
              status: false,
              message: error
            });
          });
      }));
  }
  
  static retrieveCart(req, res) {
    db.query(`SELECT cart FROM users WHERE id = '${req.params.id}'`)
      .then((response) => {
        const result = response.rows[0].cart || [];
        return res.status(200).json({
          status: true,
          result
        });
      });
  }
  
  static retrieveOrders(req, res) {
    db.query(`SELECT * FROM orders WHERE user_id = ${req.params.id}`)
      .then((orders) => {
        return res.status(200).json({ status: true, result: orders.rows });
      });
  }
};

export default User;
