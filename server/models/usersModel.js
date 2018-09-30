import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export default () => {
  const queryString = `CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY, 
    firstname VARCHAR(40) NOT NULL, 
    lastname VARCHAR(40) NOT NULL,
    username VARCHAR(40) NOT NULL UNIQUE,
    address VARCHAR(40) NOT NULL,
    phone VARCHAR(11) NOT NULL,
    password VARCHAR(100) NOT NULL,
    cart TEXT[][],
    isadmin BOOLEAN DEFAULT 'false')`;

  pool.query(queryString)
    .then((response) => {
      pool.end();
    })
    .catch((error) => {
      console.log(error);
    });
};
