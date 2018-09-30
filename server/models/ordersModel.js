import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export default () => {
  const queryString = `CREATE TABLE IF NOT EXISTS orders(
    id SERIAL PRIMARY KEY, 
    user_id INTEGER,
    amount INTEGER NOT NULL,
    address VARCHAR(40) NOT NULL,
    food_ids TEXT[] NOT NULL,
    order_status VARCHAR(10) NOT NULL)`;

  pool.query(queryString)
    .then((response) => {
      pool.end();
    })
    .catch((error) => {
      console.log(error);
    });
};
