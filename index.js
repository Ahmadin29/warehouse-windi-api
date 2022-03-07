const express = require('express');
const connection = require('./app/config/database');
const router = require('./app/router');

connection();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));

// Add headers before the routes are defined
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.use('/',router);

app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`)
})