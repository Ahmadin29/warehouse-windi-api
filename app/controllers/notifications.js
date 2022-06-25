const axios = require('axios');
const notifications = require('../models/notifications');
const PushToken = require('../models/push_tokens');
const users = require('../models/users');
const express = require('express');
const notificationRoute = express.Router();
const authentication = require('../middleware/authentication');

const sendNotification = async ({user,reciever,title,message}) =>{

    const role = reciever == 'supervisor' ? 1 : 2;

    const recievers = await users.find({
        role_id:role
    }).select('_id').distinct('_id')

    const tokens = await PushToken.find({
        'user_id':{
            $in:recievers
        }
    }).distinct('token')

    tokens.map(v=>{

        const data = {
            to: v,
            title: title,
            body: message,
            // data: { someData: 'goes here' },
        };

        axios.post('https://exp.host/--/api/v2/push/send',data).then(response=>{
            // console.log(response);
        })
        .catch(e=>{
            // console.log(e.response);
        })
    })

    const notification = {
        sender:user,
        reciever:reciever,
        title:title,
        message:message
    }

    const NotificationModel = new notifications(notification);

    await NotificationModel.save();
}

notificationRoute.get('/',authentication,async(req,res)=>{
    try {
        const data = await notifications.find(
            {
                "reciever":{
                    $regex:req.query.reciever ? req.query.reciever : '',$options:"i",
                }
            }
        )   

        res.json({
            status:'success',
            message:'Berhasil mendapatkan data notifikasi',
            data:data,
            req:req.query
        })
    } catch (error) {
        res.json({
            status:'error',
            message:'Gagal mendapatkan data notifikasi, '+error,
            request:req.body,
        })
    }
})

module.exports = {
    sendNotification,
    notificationRoute,
}