import db from '../config/dbconfig';

class Menu {
  static async addFood(req, res) {
    if (!req.user.isadmin) {
      return res.status(403).json({
        status: false,
        message: 'Only admins are allowed to add menu items',
      });
    }
    const { name, image, cost } = req.body;
    const query = `INSERT INTO menu(name, image, cost) 
      VALUES('${name}', '${image}', '${cost}') RETURNING *`;
    let result;

    try {
      const { rows } = await db.query(query);
      [result] = rows;
    } catch (error) {
      return res.status(422).json({
        status: false,
        message: 'Food already exists',
      });
    }
    return res.status(201).json({
      status: true,
      message: 'Food added successfully',
      result,
    });
  }

  static async getMenu(req, res) {
    const search = req.query.search || '';
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;
    let result;

    try {
      const response = await db.query('SELECT * FROM menu');
      const menu = response.rows;
      const temp = menu.filter(food => food.name.toLowerCase()
        .includes(search.toLowerCase()));
      result = temp.slice(offset, offset + limit);
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Server error',
      });
    }
    return res.status(200).json({
      status: true,
      result,
    });
  }

  static async getMenuItem(req, res) {
    const id = req.params.foodId;

    const query = `SELECT name, cost FROM menu WHERE id = '${id}'`;
    const response = await db.query(query);
    const result = response.rows[0];

    if (!result) {
      return res.status(404).json({
        status: false,
        message: 'No food exists with that id',
      });
    }
    return res.status(200).json({
      status: true,
      result,
    });
  }
}

export default Menu;
