import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import expressValidator from 'express-validator';
import orders from './routes/ordersRoute';
import menu from './routes/menuRoute';
import users from './routes/usersRoute';
import auth from './routes/authRoute';

const app = express();
app.use(cors());

// bodyParser and multer configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ strict: false }));
app.use(bodyParser.raw());
app.use(expressValidator());

const upload = multer();
app.use(upload.fields([]));

// route handlers
app.options('*', cors());
app.use(express.static('ui'));
app.use(users);
app.use(orders);
app.use(menu);
app.use(auth);

// Other routes
app.all('/*', (req, res) => {
  res.status(404).send({ status: false, message: 'Invalid request' });
});


// http seerver
app.listen(process.env.PORT || 8080);

export default app;
