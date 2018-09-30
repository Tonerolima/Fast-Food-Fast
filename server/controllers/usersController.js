import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export default {
  signup(req, res) {
    const {
      firstname, lastname, username, address, phone, password, isAdmin,
    } = req.body;
    bcrypt.genSalt(10, async (error, salt) => {
      await bcrypt.hash(password, salt, (err, hash) => {
        const query = {
          text: `INSERT INTO users(firstname, lastname, username, address, phone, password, isAdmin) 
                            VALUES($1, $2, $3, $4, $5, $6, $7) 
                            RETURNING id, firstname, lastname, username, address, phone, isAdmin, cart`,
          values: [firstname, lastname, username, address, phone, hash, isAdmin],
        };
        pool.query(query)
          .then((response) => {
            const newUser = response.rows[0];
            jwt.sign(newUser, process.env.JWTSECRET, (er, token) => {
              newUser.token = token;
              res.status(201).json({
                status: true,
                result: newUser,
                message: 'Account created successfully',
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
  },

  login(req, res) {
    pool.query(`SELECT * FROM users WHERE username = '${req.body.username}'`)
      .then((response) => {
        const user = response.rows[0];
        bcrypt.compare(req.body.password, user.password, (error, bcryptResponse) => {
          if (!bcryptResponse) {
            return res.status(422).json({ status: false, message: 'Incorrect password' });
          }
          let result;
          jwt.sign(user, process.env.JWTSECRET, (err, token) => {
          // copy all user data to a new object excluding password
            result = (({
              id, firstname, lastname, username, phone, isadmin, cart,
            }) => ({
              id, firstname, lastname, username, phone, isadmin, cart,
            }))(user);
            result.token = token;
          });
          return res.status(200).json({ status: true, result, message: 'Login successful' });
        });
      })
      .catch(e => res.status(422).send({ status: false, message: 'Incorrect username' }));
  },
};
