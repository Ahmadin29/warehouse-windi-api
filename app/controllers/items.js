const express = require('express');

const itemsModel = require('../models/items');
const variantsModel = require('../models/item_variants');
const { requestStock } = require('./stock');

const route = express.Router();

route.get('/',async(req,res)=>{

    const {_page,_limit,_search} = req.query;

    const skip          = _page      ? (_page - 1) * _limit   : 0;
    const limit         = _limit     ? _limit               : 10;

    try {
        const data = await itemsModel.find({
            name:{
                $regex:_search ? _search : '',$options:"i",
            }
        })
        .select("name status description item_variants")
        .skip(skip)
        .limit(limit)
        .populate({
            path:'item_variants',
            options:{
                select:'name stock'
            }
        })

        res.json({
            status:'success',
            message:'Berhasil mendapatkan data items',
            data:data,
            meta:{
                page:_page      ? _page     : 1,
                limit:_limit    ? _limit    : 10,
                total:data.length,
            },
            request:req.query
        })
    } catch (error) {
        res.json({
            status:'error',
            message:'Gagal mendapatkan data items, '+error,
        })
    }
})


route.delete('/delete-all',async(req,res)=>{
    try {

        await itemsModel.deleteMany({
            status:"available"
        });
        await variantsModel.deleteMany({
            status:"available"
        });

        res.status(400).json({
            status:'succcess',
            message:'Berhasil menghapus semua data item dan variasi item,',
        })

    } catch (error) {
        res.status(400).json({
            status:'error',
            message:'Gagal membuat data variasi items, '+error,
        })
    }
})


route.post('/create',async(req,res)=>{
    try {
        const {_variants,_name,_description} = req.body;

        const dataItem = {
            name:_name,
            description:_description,
        }

        const item = new itemsModel(dataItem);
        const item_variants = []

        _variants && Array.isArray(_variants) && _variants.map(async(v,i)=>{

            const month = new Date().getDate()+""+new Date().getUTCMonth()+""+new Date().getFullYear();
            const sku = "SKU-"+month+item._id.toString().slice(-3)+"-"+i;

            const dataVariant = {
                sku:sku,
                item_id:item._id,
                stock:0,
                name:v.name,
            }

            const variant = new variantsModel(dataVariant);
            item_variants.push(variant);

            requestStock({
                amount:v.stock,
                variant:variant,
                item:item,
                user:req.user,
                type:"inbound"
            });

            await variant.save();
        })

        item_variants.map(async(v)=>{
            item.item_variants.push(v._id)
        })

        await item.save();

        res.json({
            status:'success',
            message:'Berhasil menyimpan data items',
            request:item
        })

    } catch (error) {
        res.status(400).json({
            status:'error',
            message:'Gagal menyimpan data items, '+error,
            request:req.body
        })
    }
})

route.get('/variants/:id_variant',async(req,res)=>{

    const {_page,_limit,_search} = req.query;
    const {id_variant} = req.params;

    const skip          = _page      ? (_page - 1) * _limit   : 0;
    const limit         = _limit     ? _limit               : 10;

    try {
        const data = await variantsModel.findOne({
            _id:id_variant,

        })
        .skip(skip)
        .limit(limit)
        .populate({
            path:'item_id',
            options:{
                select:'name'
            }
        })

        res.json({
            status:'success',
            message:'Berhasil mendapatkan data variasi item',
            data:data,
        })
    } catch (error) {
        res.status(400).json({
            status:'error',
            message:'Gagal mendapatkan data items, '+error,
        })
    }
})

route.patch('/variants/:id_variant',async(req,res)=>{

    const {_name,_status} = req.body;
    const {id_variant} = req.params;

    try {

        const query = {
            "name"        : _name,
            "status"      : _status,
        }

        await variantsModel.updateOne({
            _id:id_variant
        },query)

        const data = await variantsModel.findOne({
            _id:id_variant,

        })

        res.json({
            status:'success',
            message:'Berhasil mengubah data variasi item',
            data:data,
            request:req.body
        })
    } catch (error) {
        res.status(400).json({
            status:'error',
            message:'Gagal mengubah data items, '+error,
        })
    }
})

route.delete('/variants/:id_variant',async(req,res)=>{

    const {id_variant} = req.params;

    try {

        await variantsModel.deleteOne({
            _id:id_variant
        })

        res.json({
            status:'success',
            message:'Berhasil menghapus data variasi item',
            request:req.params
        })
    } catch (error) {
        res.status(400).json({
            status:'error',
            message:'Gagal menghapus data items, '+error,
        })
    }
})

route.get('/:id',async(req,res)=>{

    const {_page,_limit,_search} = req.query;
    const {id} = req.params;

    const skip          = _page      ? (_page - 1) * _limit   : 0;
    const limit         = _limit     ? _limit               : 10;

    try {
        const data = await itemsModel.findOne({
            _id:id
        })
        .select("name status description item_variants")
        .skip(skip)
        .limit(limit)
        .populate({
            path:'item_variants',
        })

        res.json({
            status:'success',
            message:'Berhasil mendapatkan data items',
            data:data,
        })
    } catch (error) {
        res.status(400).json({
            status:'error',
            message:'Gagal mendapatkan data items, '+error,
        })
    }
})

route.patch('/:id',async(req,res)=>{

    const {id} = req.params;
    const {_name,_status,_description} = req.body;

    try {

        const query = {
            "name"        : _name,
            "status"      : _status,
            "description" : _description,
        }

        await itemsModel.updateOne({
            _id:id
        },query)

        const data = await itemsModel.findOne({
            _id:id
        })

        res.json({
            status:'success',
            message:'Berhasil mengubah data items',
            data:data,
            request:req.body
        })
    } catch (error) {
        res.status(400).json({
            status:'error',
            message:'Gagal mengubah data items, '+error,
        })
    }
})

route.delete('/:id',async(req,res)=>{

    const {id} = req.params;

    try {

        await itemsModel.deleteOne({
            _id:id
        })

        res.json({
            status:'success',
            message:'Berhasil menghapus data item',
            request:req.params
        })
    } catch (error) {
        res.status(400).json({
            status:'error',
            message:'Gagal mengubah data items, '+error,
        })
    }
})

route.get('/:id/variants',async(req,res)=>{

    const {_page,_limit,_search} = req.query;
    const {id} = req.params;

    const skip          = _page      ? (_page - 1) * _limit   : 0;
    const limit         = _limit     ? _limit               : 10;

    try {
        const data = await variantsModel.find({
            item_id:id
        })
        .skip(skip)
        .limit(limit)
        .populate({
            path:'item_id',
            options:{
                select:'name'
            }
        })

        res.json({
            status:'success',
            message:'Berhasil mendapatkan data variasi item',
            data:data,
            meta:{
                page:_page      ? _page     : 1,
                limit:_limit    ? _limit    : 10,
                total:data.length,
            },
            request:req.query
        })
    } catch (error) {
        res.status(400).json({
            status:'error',
            message:'Gagal mendapatkan data items, '+error,
        })
    }
})

route.post('/:id/create-variant',async(req,res)=>{

    const {id} = req.params;
    const {_name,_stock} = req.body

    try {

        const dataItem = await itemsModel.findOne({
            _id:id
        }).populate('item_variants')

        const skuDate   =   new Date().getDate()+""+new Date().getUTCMonth()+""+new Date().getFullYear()
        const item_id   =   id.toString().slice(-3);

        const last      =   dataItem.item_variants.length > 0 ? 
                            parseInt(dataItem.item_variants[dataItem.item_variants.length - 1].sku.slice(-1)) + 1 :
                            1

        const sku = "SKU-"+skuDate+item_id+"-"+last;

        const dataVariant = {
            sku:sku,
            item_id:id,
            name:_name,
        }

        const variant = new variantsModel(dataVariant);
        await variant.save();

        dataItem.item_variants.push(variant);
        await dataItem.save()

        res.json({
            status:'success',
            message:'Berhasil membuat data variasi item',
            data:dataItem,
            request:req.body
        })
    } catch (error) {
        res.status(400).json({
            status:'error',
            message:'Gagal membuat data variasi items, '+error,
        })
    }
})

module.exports = route;