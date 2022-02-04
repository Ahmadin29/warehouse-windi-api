const express = require('express');
const router = express.Router();

const userRoute = require('./controllers/users');
const loginRoute = require('./controllers/login');
const itemsRoutes = require('./controllers/items');

router.get('/',async (req,res)=>{
    res.send('API worked well')
})

router.use('/login',loginRoute);
router.use('/user',userRoute);
router.use('/items',itemsRoutes);

module.exports = router;