var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var Mock = require('mockjs');

app.use(express.static('src'));

app.get('/', function(req, res) {
    res.sendFile( __dirname + "/src/" + "index.html" );
})
app.get('/add', function(req, res) {
    res.sendFile( __dirname + "/src/" + "index.html" );
})
app.get('/orders', function(req, res) {
    res.sendFile( __dirname + "/src/" + "index.html" );
})
app.get('/about', function(req, res) {
    res.sendFile( __dirname + "/src/" + "index.html" );
})
app.get('/test', function (req, res) {
    res.sendFile(__dirname + "/src/" + "index.html");
})

var listData = Mock.mock({
    'list|20': [{
        'id|+1': 100000,
        title: '@name',
        time: '@datetime',
        'content|3-10': ["@string('lower', 3, 10)"]
    }]
});

var newDara = [];

app.get('/list', function(req, res) {
    res.json(listData);
})

app.post('/editOrder', function(req, res) {
    var order = {};
    req.on("data", function(data) {
        order = JSON.parse(data);
    });
    req.on("end", function() {
        for (var i = 0; i < listData.list.length; i++) {
            if (listData.list[i].id == order.id) {
                listData.list[i] = order;
                break;
            }
        }
    })
    res.send('success');
})

app.post('/makeOrder', function(req, res) {
    req.on("data", function(data) {
        listData.list.unshift(JSON.parse(data));
    });
    res.send('success');
})

app.post('/reconcile', function(req, res) {
    req.on("data", function(data) {
        listData.list = JSON.parse(data).concat(listData.list);
    });
    res.send('success');
})

app.post('/deleteOrder', function(req, res) {
    req.on("data", function(data) {
        var deleteId = JSON.parse(data).id;
        for (var i = 0; i < listData.list.length; i++) {
            if (listData.list[i].id == deleteId) {
                listData.list.splice(i,1) 
                break;
            }
        }
    });
    res.send('success');
})

var server = app.listen(8888, function() {
    console.log("port: " + server.address().port)
})