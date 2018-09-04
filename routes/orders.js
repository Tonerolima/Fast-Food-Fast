import express from 'express';
import uniqId from 'uniqid';
// import bodyParser from 'body-parser';

const router = express();
const v1 = express.Router();
const orders = [];
const dishes = [
    {
        "name": "Jollof Rice",
        "cost": 1500,
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnUqzH59_6q1KUqc7-w6arwNbw9MMrrswfFYVh3vE9aSpvw6q1",
        "_id": "eexbt1qvjlm5nj37"
    },
    {
        "name": "Ofada Rice",
        "cost": 2000,
        "image": "https://i0.wp.com/myactivekitchen.com/wp-content/uploads/2016/12/ofada-stew-10.jpg?resize=750%2C500",
        "_id": "eexbt1qvjlm5nj38"
    },
    {
        "name": "Spaghetti",
        "cost": 1200,
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx8gtSyqFNAYH-Xpkea3W33g4lov95EDg103oXgQOMRdB8Okyo_Q",
        "_id": "eexbt1qvjlm5nj39"
    },
    {
        "name": "Ewa Agoyin",
        "cost": 500,
        "image": "http://4.bp.blogspot.com/--7ui7whGVfU/TWR0S1XZlhI/AAAAAAAAAnI/0qtGjCyMr0s/s1600/DSC04065.JPG",
        "_id": "eexbt1qvjlm5nj3a"
    },
    {
        "name": "Yam Porridge",
        "cost": 1500,
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDdKUntB-h6FyEKBuKw9gNTZzhT7L2ftaFCH3LJPxL7Wdmsb65dA",
        "_id": "eexbt1qvjlm5nj3b"
    },
    {
        "name": "Pounded Yam & Egusi",
        "cost": 3000,
        "image": "http://www.foodstantly.com/product_image/big/142366775497271.jpg",
        "_id": "eexbt1qvjlm5q6ul",
        "status": "pending"
    },
    {
        "name": "Asun",
        "cost": 700,
        "image": "https://i.ytimg.com/vi/ez_N5ArYkA0/maxresdefault.jpg",
        "_id": "eexbt1qvjlm5nj3d"
    },
    {
        "name": "Nkwobi",
        "cost": 700,
        "image": "https://i2.wp.com/www.1qfoodplatter.com/wp-content/uploads/2015/11/nkwobi-recipe.jpg?fit=400%2C266&ssl=1",
        "_id": "eexbt1qvjlm5nj3e"
    }
];


//Retrieve menu
v1.get('/dishes', (req, res) => {
    let limit = req.query.limit || 10;
    let offset = req.query.offset || 0;
    let result = dishes.slice(offset, offset + limit);
    res.status(200).send(result);
});


//Place order
v1.post('/orders', (req, res) => {
    if(!req.body.foodId) return res.status(400).send('No data was received or unsupported data type');
    let index = dishes.findIndex(element =>  element._id === req.body.foodId);
    if(index < 0) return res.status(404).send('Food does not exist');
    let newOrder = Object.assign({}, dishes[index]);
    newOrder._id = uniqId();
    newOrder.orderStatus = 'pending';
    orders.push(newOrder);
    res.status(201).send(newOrder);
});


//Retrieve orders
v1.get('/orders', (req, res) => {
    res.status(200).send(orders);
});


//Retrieve specific order
v1.get('/orders/:id', (req, res) => {
    let obj = orders.find((element) =>  element._id === req.params.id);
    if(obj) return res.status(200).send(obj);
    res.status(404).send('No order exists for the specified id');
});


//Update order status
v1.put('/orders/:id', (req, res) => {
    if(!req.body.orderStatus) return res.status(400).send('No data was received or unsupported data type');
    let index = orders.findIndex(order => order._id === req.params.id);
    if(index < 0) return res.status(404).send('Order does not exist');
    orders[index].orderStatus = req.body.orderStatus;
    return res.status(201).send(`Order status has been updated to ${req.body.orderStatus}`);
});


//Delete order
v1.delete('/orders/:id', (req, res) => {
    let index = orders.findIndex(order => order._id === req.params.id);
    if(index < 0) return res.status(404).send('Order does not exist');
    orders.splice(index, 1);
    res.status(200).send('order deleted');
});


//Default routes
v1.get('/*', (req, res) => {
    res.status(400).send('Invalid request');
});


router.use('/api/v1', v1);
router.use('/', v1);


export default router;