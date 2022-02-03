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
            })
        }
    } catch (error) {

        res.status(401).json({
            status:'error',
            message:'Gagal mengautentikasi data user, '+error,
            request:req.body,
        })
    }
})

module.exports = router;
