import express from 'express';
import orders from './routes/orders';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ strict: false }));
app.use(bodyParser.raw());
app.use(orders);


app.listen(process.env.PORT, process.env.IP, () => console.log('Fast-food-fast app running'));