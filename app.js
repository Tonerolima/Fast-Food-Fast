import express from "express";
const app = express();

const v1 = express.Router();


v1.get('/', (req, res) => {
    res.send('Version 1 setup complete');
});
 

v1.get('/orders', (req, res) => {
    res.send('I will soon be returning a list of orders');
});


app.use('/api/v1', v1);


app.listen(process.env.PORT, process.env.IP, ()=> {
    console.log("Fast-food-fast app running");
})