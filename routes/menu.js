import express from 'express';
import middleware from '../middleware';

const router = express();
const v1 = express.Router();


// retrieve menu
v1.get('/', middleware.getMenu, (req, res) => {
  if(req.menu.length === 0)
    return res.status(404).send({ status: false, message: 'No dish found for the search criteria' });
  res.status(200).send({ status: true, result: req.menu });
});


router.use('/api/v1/menu', v1);


export default router;
