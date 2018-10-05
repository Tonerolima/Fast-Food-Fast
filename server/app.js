import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import orders from './routes/ordersRoute';
import menu from './routes/menuRoute';
import users from './routes/usersRoute';
import index from './routes/indexRoute';

const app = express();
app.use(cors());

// bodyParser and multer configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ strict: false }));
app.use(bodyParser.raw());
app.use(expressValidator());

// route handlers
app.options('*', cors());
app.use(users);
app.use(orders);
app.use(menu);
app.use(index);


// http seerver
app.listen(process.env.PORT || 8080);

export default app;
