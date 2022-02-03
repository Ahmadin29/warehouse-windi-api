const express = require('express');
const Users = require('../models/users');
const PushToken = require('../models/push_tokens');
const SHA256 = require("crypto-js/sha256");
const authentication = require('../middleware/authentication')

const route = express.Router();

route.get('/',authentication,async(req,res)=>{
    try {
        const data = await Users.findOne({_id:req.user._id}).populate({
            path:"user_push_tokens",
        })

        res.json({
            status:'success',
            message:'Berhasil mendapatkan data user',
            data:data,
        })
    } catch (error) {
        res.json({
            status:'error',
            message:'Gagal mendapatkan data user, '+error,
            request:req.body,
        })
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
        res.json({
            status  : 'success',
            message : 'Berhasil menyimpan data user',
            data    : userModel,
        });
    } catch (error) {
        console.warn(error);
    }
})

route.post('/store-push-token',authentication,async(req,res)=>{
    try {
        const { push_token } = req.body;

        if (!push_token){
            res.status('422').json({
                message :"Terjadi kesalahan, push_token tidak boleh kosong",
                status  :'error'
            })
            return;
        }

        const data = {
            token:push_token,
            user_id:req.user._id,
        }

        const pushTokenModel = new PushToken(data);

        const user = await Users.findOne({_id:req.user._id});

        user.user_push_tokens.push(pushTokenModel._id);

        await user.save();
        await pushTokenModel.save();

        res.json({
            status:'success',
            message:'Berhasil menyimpan data push token',
            data:pushTokenModel,
        });
    } catch (error) {
        console.warn(error);
        res.json({
            status:'success',
            message:'Gagal menyimpan data push token, '+error,
            request:req.body,
        });
    }
})

module.exports = route;