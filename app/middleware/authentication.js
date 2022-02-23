const express = require('express');
const router = express.Router();
const Users = require('../models/users');

router.use(async (req,res,next)=>{

    try {
        const data = await Users.findOne({
            api_key:req.headers['x-api-key'],
        }).exec();

        if (data) {
            req.user = data;
            next();
        }else{
            res.status(401).json({
                status:'error',
                message:'Gagal mengautentikasi data user, akun tidak ditemukan',
                request:req.headers,
            })
        }
    } catch (error) {

        res.status(401).json({
            status:'error',
            message:'Gagal mengautentikasi data user, '+error,
            request:req.headers['x-api-key'],
        })
    }
})

module.exports = router;
