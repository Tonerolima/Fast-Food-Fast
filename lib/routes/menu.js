import express from 'express';
import middleware from '../middleware';

const router = express();
const v1 = express.Router();


// retrieve menu
v1.get('/', middleware.getMenu, (req, res) => {
  return res.status(200).send({ status: true, result: req.menu });
});


router.use('/api/v1/menu', v1);


export default router;
