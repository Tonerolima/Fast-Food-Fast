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

// route handlers
app.use(order);
app.use(menu);
app.use(index);

// http seerver
app.listen(8080);

export default app;
