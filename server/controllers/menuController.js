import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import MenuModel from '../models/menuModel';

MenuModel();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export default {
  addFood(req, res) {
    const { name, image, cost } = req.body;
    const query = `INSERT INTO menu(name, image, cost) 
      VALUES('${name}', '${image}', '${cost}') RETURNING *`;
    pool.query(query)
      .then((response) => {
        res.status(201).json({ 
          status: true, 
          message: 'Food added successfully',
          result: response.rows[0]
        });
      })
      .catch((error) => {
        res.status(422).json({ status: false, message: 'Food already exists' });
      });
  },
  getMenu(req, res) {
    const search = req.query.search || '';
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;
    
    pool.query(`SELECT * FROM menu`)
      .then((response) => {
        const menu = response.rows;
        const temp = menu.filter(food => food.name.toLowerCase()
          .includes(search.toLowerCase()));
        const result = temp.slice(offset, offset + limit);
        return res.status(200).json({ status: true, result });
      })
      .catch((error) => {
        res.status(500).json({ status: false, message: 'Server error' });
      });
  }
};
