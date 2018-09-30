import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export default () => {
  const queryString = `CREATE TABLE IF NOT EXISTS menu(
    id SERIAL PRIMARY KEY, 
    name VARCHAR(40) UNIQUE, 
    cost INTEGER NOT NULL,
    image TEXT NOT NULL)`;

  pool.query(queryString)
    .then((response) => {
      pool.end();
    })
    .catch((error) => {
      console.log(error);
    });
};
