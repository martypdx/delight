var express = require('express')
 ,  fs = require('fs')
 ,  path = require('path')
 
var app = express.createServer(
    express.static(path.join(__dirname, 'public'))
 ,  express.bodyParser()
)

app.set('view engine', 'jade')
var port = 8000

var sharejs = require('share').server;
var options = { db: {type: 'memory'}}; // See docs for options. {type: 'redis'} to enable persistance.
// Attach the sharejs REST and Socket.io interfaces to the server
sharejs.attach(app, options);

/*
var io = require('socket.io').listen(app);
//io.set('log level', 2); 
io.sockets.on('connection', function(client) {
    client.on('disconnect', function() {
        console.log('Client has connected');
    });
    client.on('message', function(event) {
        //client.json.send(jade.render(event.template, options));
        //client.send(err);
    });
    client.on('disconnect', function() {
        console.log('Client has disconnected');
    });
});
*/


app.listen(port)
console.log('Delight started on port ' + port)