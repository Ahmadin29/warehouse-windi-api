const express = require('express');
const router = express.Router();
const authentication = require('./middleware/authentication')

const userRoute = require('./controllers/users');
const loginRoute = require('./controllers/login');
const itemsRoutes = require('./controllers/items');
const {stockRoutes} = require('./controllers/stock');
const { notificationRoute } = require('./controllers/notifications');

router.get('/',async (req,res)=>{
    res.send('API worked well')
})

router.use('/login',loginRoute);
router.use('/user',userRoute);
router.use('/items',authentication,itemsRoutes);
router.use('/stock',authentication,stockRoutes);
router.use('/notifications',authentication,notificationRoute);

module.exports = router;