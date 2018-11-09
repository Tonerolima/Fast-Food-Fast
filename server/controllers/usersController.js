import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../config/dbconfig';

class User {
  static async signup(req, res) {
    const { name, email, address, password, isAdmin } = req.body;

    const hash = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const query = {
      text: `INSERT INTO 
        users(name, email, address, password, isadmin)
        VALUES($1, $2, $3, $4, $5) RETURNING id, name, email, isadmin, address`,
      values: [name, email, address, hash, isAdmin],
    };

    try {
      const { rows: [ newUser ] } = await db.query(query);
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
        message: 'A user already exists with that email address',
      });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    const query = `SELECT id, name, email, isadmin, password, address
      FROM users WHERE email = '${email}'`;

    try {
      const { rows: [ user ] } = await db.query(query);

      await bcrypt.compare(password, user.password, async (error, data) => {
        if (!data) {
          return res.status(422).json({
            status: false,
            message: 'Invalid email/password',
          });
        }
        
        const payload = (({ id, name, email, isadmin, address }) => {
          return { id, name, email, isadmin, address };
        })(user);
        
        const token = await jwt.sign(payload, process.env.JWTSECRET);
          
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
