import { Pool } from 'pg';
import OrdersModel from '../models/ordersModel';

OrdersModel();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export default {
  getOrders(req, res) {
    pool.query(`SELECT * FROM orders`)
      .then((orders) => {
        return res.status(200).json({ status: true, result: orders.rows });
      });
  },
  getOrder(req, res) {
    pool.query(`SELECT * FROM orders WHERE id = '${req.params.id}'`)
      .then((orders) => {
        if (orders.rowCount === 0) {
          return res.status(404).json({
            status: false,
            message: 'No order exists for the specified id'});
        }
        return res.status(200).json({ status: true, result: orders.rows[0] });
      });
  },
  createOrder(req, res) {
    const foodIds = req.body.foodIds;
    const address = req.body.address;
    const queryString = `INSERT INTO 
      orders(user_id, amount, address, food_ids, order_status)
      VALUES('1', '${req.amount}', '${address}', ARRAY[${foodIds}], 'new')
      RETURNING *`;
      
    pool.query(queryString)
      .then((order) => {
        return res.status(201).json({
          status: true,
          message: 'Order created successfully',
          result: order.rows[0]
        });
      })
      .catch((error) => {
        return res.status(500).send({
          status: false, 
          message: error });
      });
  },
  updateOrderStatus(req, res) {
    const queryString = `UPDATE orders
      SET order_status = '${req.body.orderStatus}' 
      WHERE id = '${req.params.id}' RETURNING *`;
      
    pool.query(queryString)
      .then((order) => {
        return res.status(200).json({
          status: true,
          message: `Status has been updated to ${order.rows[0].order_status}`,
          result: order.rows[0]
        });
      })
      .catch((error) => {
        return res.status(404).json({
          status: false,
          message: 'No order exists for the specified id'
        });
      });
  },
  deleteOrder(req, res) {
    const queryString = `DELETE FROM orders
      WHERE id = '${req.params.id}' RETURNING *`;
      
    pool.query(queryString)
      .then((order) => {
        return res.status(200).json({
          status: true,
          message: `Order has been deleted successfully`
        });
      })
      .catch((error) => {
        return res.status(404).json({
          status: false,
          message: 'No order exists for the specified id'
        });
      });
  }
};
