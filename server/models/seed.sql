CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY, 
  firstname VARCHAR(40) NOT NULL,
  lastname VARCHAR(40) NOT NULL,
  username VARCHAR(40) NOT NULL UNIQUE,
  address VARCHAR(40) NOT NULL,
  phone VARCHAR(11) NOT NULL,
  password VARCHAR(100) NOT NULL,
  cart TEXT[][],
  isadmin BOOLEAN DEFAULT 'false');
  
CREATE TABLE IF NOT EXISTS menu(
  id SERIAL PRIMARY KEY,
  name VARCHAR(40) UNIQUE, 
  cost INTEGER NOT NULL, 
  image TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS orders(
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount INTEGER NOT NULL, 
  address VARCHAR(40) NOT NULL, 
  food_ids TEXT[] NOT NULL, 
  order_status VARCHAR(10) NOT NULL);
