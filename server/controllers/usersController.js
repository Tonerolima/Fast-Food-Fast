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
                            RETURNING id, username, isAdmin`,
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
        bcrypt.compare(req.body.password, user.password, (error, bcryptResponse) => {
          if (!bcryptResponse) {
            return res.status(422).json({ status: false, message: 'Incorrect username/password' });
          }
          let result;
          jwt.sign(user, process.env.JWTSECRET, (err, token) => {
            
          // copy all user data to a new object excluding password
            result = (({
              id, firstname, lastname, username, phone, isadmin
            }) => ({
              id, firstname, lastname, username, phone, isadmin
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
      .catch(e => res.status(422).send({ status: false, message: 'Incorrect username/password' }));
  }
};

export default User;
