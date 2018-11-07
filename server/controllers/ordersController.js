import db from '../config/dbconfig';

class Order {
  static async getOrders(req, res) {
    if (!req.user.isadmin) {
      return res.status(403).json({
        status: false,
        message: 'Only admins can view all orders',
      });
    }

    const query = `select orders.id, email, orders.address, 
      amount, food_ids, order_status, created_on, updated_on
      FROM orders 
      JOIN users ON orders.user_id = users.id`;
    const orders = await db.query(query);
    return res.status(200).json({
      status: true,
      result: orders.rows,
    });
  }

  static async getUserOrders(req, res) {
    if (req.user.id !== Number(req.params.id) && !req.user.isadmin) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to view other users' orders",
      });
    }

    const query = `select orders.id, email, orders.address, 
      amount, food_ids, order_status, created_on,updated_on, user_id
      FROM orders 
      JOIN users ON orders.user_id = users.id
      WHERE user_id = '${req.params.id}'`;
      
    const orders = await db.query(query);
    return res.status(200).json({
      status: true,
      result: orders.rows,
    });
  }

  static async getOrder(req, res) {
    const query = `select orders.id, email, orders.address,
      amount, food_ids, order_status, created_on,updated_on, user_id
      FROM orders
      JOIN users ON orders.user_id = users.id
      WHERE orders.id = '${req.params.id}'`;
      
    const response = await db.query(query);
    if (response.rowCount === 0) {
      return res.status(404).json({
        status: false,
        message: 'No order exists for the specified id',
      });
    }
    const result = response.rows[0];
    if (req.user.id !== result.user_id && !req.user.isadmin) {
      return res.status(403).json({
        status: false,
        message: 'Only admins can view an order of another user',
      });
    }
    return res.status(200).json({
      status: true,
      result,
    });
  }

  static async createOrder(req, res) {
    if (req.user.isadmin) {
      return res.status(403).json({
        status: false,
        message: 'Admins cannot place orders',
      });
    }
    const { foodIds } = req.body;
    const address = req.body.address || req.user.address;
    const queryString = `INSERT INTO 
      orders(user_id, amount, address, food_ids, order_status)
      VALUES('${req.user.id}', '${req.amount}', '${address}', 
        ARRAY[${foodIds}], 'new')
      RETURNING *`;

    const response = await db.query(queryString);
    return res.status(201).json({
      status: true,
      message: 'Order created successfully',
      result: response.rows[0],
    });
  }

  static async updateOrderStatus(req, res) {
    if (!req.user.isadmin) {
      return res.status(403).json({
        status: false,
        message: 'Only admins can change the status of an order',
      });
    }
    const queryString = `UPDATE orders
      SET order_status = '${req.orderStatus}',
      updated_on = '${new Date().toISOString()}'
      WHERE id = '${req.params.id}' RETURNING *`;

    try {
      const response = await db.query(queryString);
      return res.status(200).json({
        status: true,
        message: `Status has been updated to ${response.rows[0].order_status}`,
      });
    } catch (error) {
      return res.status(404).json({
        status: false,
        message: 'No order exists for the specified id',
      });
    }
  }
}

export default Order;
