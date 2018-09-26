import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import orders from './routes/orders';
import menu from './routes/menu';
import index from './routes/index';

const app = express();

// bodyParser configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ strict: false }));
app.use(bodyParser.raw());

// http method override
app.use(methodOverride('_method'));

// Enable cross-origin resource sharing
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// route handlers
app.use(orders);
app.use(menu);
app.use(index);


// http seerver
app.listen(process.env.PORT || 8080);

export default app;
