import express from 'express';
import bodyParser from 'body-parser';
import orders from './routes/orders';


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ strict: false }));
app.use(bodyParser.raw());
app.use(orders);


app.listen(process.env.PORT, process.env.IP);
