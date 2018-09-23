import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import methodOverride from 'method-override';
import order from './routes/order';
import menu from './routes/menu';
import index from './routes/index';

const app = express();
const upload = multer();

// bodyParser configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ strict: false }));
app.use(bodyParser.raw());
app.use(upload.fields([]));

// http method override
app.use(methodOverride('_method'));

// Enable cross-origin resource sharing
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// route handlers
app.use(order);
app.use(menu);
app.use(index);

// http seerver
app.listen(process.env.PORT || 8080);

export default app;
