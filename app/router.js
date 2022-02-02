const express = require('express');
const router = express.Router();

const userRoute = require('./controllers/users');
const loginRoute = require('./controllers/login');

router.get('/',async (req,res)=>{
    res.send('API Worked')
})

router.use('/login',loginRoute);

router.use('/user',userRoute);

module.exports = router;