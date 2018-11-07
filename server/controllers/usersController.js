import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../config/dbconfig';

class User {
  static async signup(req, res) {
    const { email, address, password, isAdmin } = req.body;

    const hash = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const query = {
      text: `INSERT INTO 
        users(email, address, password, isadmin)
        VALUES($1, $2, $3, $4) RETURNING id, email, isadmin, address`,
      values: [email, address, hash, isAdmin],
    };

    try {
      const response = await db.query(query);
      const newUser = response.rows[0];
      const token = await jwt.sign(newUser, process.env.JWTSECRET);

      res.status(201).json({
        status: true,
        message: 'Account created successfully',
        result: newUser,
        token,
      });
    } catch (error) {
      res.status(409).json({
        status: false,
        message: error,
      });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    const query = `SELECT id, isadmin, password, address
                  FROM users WHERE email = '${email}'`;

    try {
      const response = await db.query(query);
      const user = response.rows[0];

      await bcrypt.compare(password, user.password, async (error, data) => {
        if (!data) {
          return res.status(422).json({
            status: false,
            message: 'Invalid email/password',
          });
        }

        const token = await jwt.sign(user, process.env.JWTSECRET);
        const result = (({ id, isadmin }) => ({ id, isadmin }))(user);
        return res.status(200).json({
          status: true,
          message: 'Login successful',
          result,
          token,
        });
      });
    } catch (error) {
      res.status(422).send({
        status: false,
        message: 'Invalid email/password',
      });
    }
  }
}

export default User;
