const express = require('express');
const router = express.Router();

const userRoute = require('./controllers/users')

router.get('/',async (req,res)=>{
    res.send('API Worked')
})

router.get('/',async (req,res)=>{
    res.send('API Worked')
})

router.use('/user',userRoute);

module.exports = router;