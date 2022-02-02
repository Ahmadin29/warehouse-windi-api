// mongodb+srv://Havana29:<password>@cluster0.iibrd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const mangoose  = require('mongoose');
const uri       = "mongodb+srv://Havana29:havana29@cluster0.iibrd.mongodb.net/warehouse?retryWrites=true&w=majority";

const connection = async ()=>{
    try {
        await mangoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database Connected');
    } catch (error) {
        console.log("Can't Connect To Database, "+error);
    }
}

module.exports = connection;