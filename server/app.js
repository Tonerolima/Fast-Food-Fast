import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import methodOverride from 'method-override';
import expressValidator from 'express-validator';
import orders from './routes/ordersRoute';
import menu from './routes/menuRoute';
import users from './routes/usersRoute';
import index from './routes/indexRoute';
import 'regenerator-runtime/runtime';


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
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// route handlers
app.use(orders);
app.use(menu);
app.use(users);
app.use(index);


// http seerver
app.listen(process.env.PORT || 8080);

export default app;
