import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

class Menu {
  static addFood(req, res) {
    if (!req.user.isadmin) {
      return res.status(403).json({
        status: false,
        message: 'Only admins are allowed to add menu items'
      });
    }
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
  }
  
  static getMenu(req, res) {
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

export default Menu;
