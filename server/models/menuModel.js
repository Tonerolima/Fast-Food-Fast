import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export default () => {
  const queryString = `CREATE TABLE IF NOT EXISTS menu(
    id SERIAL PRIMARY KEY, 
    name VARCHAR(40) UNIQUE, 
    cost VARCHAR(40) NOT NULL,
    image TEXT NOT NULL)`;

  pool.query(queryString, (err, res) => {
    pool.end();
  });
};
