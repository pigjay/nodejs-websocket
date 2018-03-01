var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = [
        {username:'zhujie',password:'123456'},
        {username:'zhujie1',password:'123456'}
        ];

app.use('/',express.static(__dirname + '/test'));
app.set('port',process.env.PORT || 3000);
server.listen(app.get('port'),function () {
    console.log('Server running at http://127.0.0.1:3000/');
})

io.sockets.on('connection',function (socket) {
    socket.on("mousedown",function (data) {
        console.log(data);
        io.sockets.emit("mousedown1",data);
    });
    socket.on("mousemove",function (data) {
        console.log(data);
        io.sockets.emit("mousemove1",data);
    });
    socket.on("mouseup",function () {
        io.sockets.emit("mouseup1");
    });


})