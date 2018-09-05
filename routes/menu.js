import express from 'express';
import menu from '../data/menu';

const router = express();
const v1 = express.Router();


// retrieve menu
v1.get('/', (req, res) => {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  const result = menu.slice(offset, offset + limit);
  res.send({ status: true, result });
});


router.use('/api/v1/menu', v1);


export default router;
