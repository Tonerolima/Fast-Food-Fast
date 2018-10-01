import express from 'express';
import middleware from '../middleware';
import Menu from '../controllers/menuController';

const { verifyToken, validateMenuItem } = middleware;

const router = express();
const v1 = express.Router();

v1.post('/', verifyToken, validateMenuItem, Menu.addFood);
v1.get('/', Menu.getMenu);


router.use('/api/v1/menu', v1);


export default router;
