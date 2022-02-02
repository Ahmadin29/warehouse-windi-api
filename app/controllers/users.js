const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/users');
const SHA256 = require("crypto-js/sha256");

const route = express.Router();

route.get('/',async(req,res)=>{
    try {
        const data = await Users.find();

        res.json({
            status:'success',
            message:'Berhasil mendapatkan data user',
            data:data,
        })
    } catch (error) {
        console.log(error);
    }
})

route.post('/create',async(req,res)=>{
    try {
        const { name,password,username,role_id } = req.body;

        if (!name || !password || !username ){
            res.status('422').json({
                message :"Terjadi kesalahan, Pastikan semua data diisi",
                status  :'error'
            })
            return;
        }

        const user = {
            name,
            password:SHA256(password),
            username,
            role_id:role_id ? role_id : 1,
            api_key:SHA256(username+'*'+password),
        }

        const userModel = new Users(user);

        await userModel.save();
        res.json(userModel);
    } catch (error) {
        console.warn(error);
    }
})

module.exports = route;