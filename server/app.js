import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import methodOverride from 'method-override';
import expressValidator from 'express-validator';
import orders from './routes/ordersRoute';
import menu from './routes/menuRoute';
import users from './routes/usersRoute';
import index from './routes/indexRoute';

const app = express();

const upload = multer();

// bodyParser and multer configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ strict: false }));
app.use(bodyParser.raw());
app.use(upload.fields([]));
app.use(expressValidator());

// http method override
app.use(methodOverride('_method'));

// Enable cross-origin resource sharing
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Max-Age', '1728000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// route handlers
app.use(users);
app.use(orders);
app.use(menu);
app.use(index);


// http seerver
app.listen(process.env.PORT || 8080);

export default app;
