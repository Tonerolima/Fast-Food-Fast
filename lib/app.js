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

// route handlers
app.use(orders);
app.use(menu);
app.use(index);


// http seerver
app.listen(process.env.PORT);

export default app;
