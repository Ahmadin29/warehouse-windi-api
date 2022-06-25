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

        if (!data) {
            res.status("401").json({
                status:'error',
                message:'Gagal mengautentikasi data user, akun tidak ditemukan',
                request:req.body,
            })
        }

        res.json({
            status:'success',
            message:'Berhasil mengautentikasi data user',
            data:data,
            request:req.body,
        })
    } catch (error) {
        res.status("500").json({
            status:'error',
            message:'Gagal mengautentikasi data user, '+error,
            request:req.body,
        })
    }
})

module.exports = route;