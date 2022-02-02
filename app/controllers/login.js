const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/users');
const SHA256 = require("crypto-js/sha256");

const route = express.Router();

route.post('/',async(req,res)=>{
    try {

        const { password,username } = req.body;

        if (!password || !username ){
            res.status('422').json({
                message :"Terjadi kesalahan, Pastikan semua data diisi",
                status  :'error'
            })
            return;
        }

        const data = await Users.findOne({
            username:username,
            password:SHA256(password).toString(),
        }).exec();

        res.json({
            status:'success',
            message:'Berhasil mengautentikasi data user',
            data:data,
            request:req.body,
        })
    } catch (error) {
        console.log(error);
    }
})

module.exports = route;