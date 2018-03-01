var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = [];
app.set('port',3000);
app.use('/',express.static(__dirname + '/static'));
server.listen(app.get('port'),function () {
    console.log('Server running at http://127.0.0.1:3000/');
});
io.sockets.on('connection',function (socket) {
    socket.on('login',function (user) {
        if (isHaveName(user)){

        }else{
            user.id = socket.id;
            if(!isHave(user)){
                users.push(user);
            }
            socket.user = user;
            console.log('用户'+user.nickName+'登录服务器');
            io.sockets.emit('loginSuccess',user,users,'login');
        }
    })

    socket.on('disconnect',function () {
        if(socket.user != null){
            users.forEach(function (item,index) {
                if(item.id == socket.id){
                    users.splice(index,1);
                }
            })
            console.log('用户'+socket.user.nickName +"下线");
            io.sockets.emit('system',socket.user,users,'logout');
        }
    })

    socket.on('putMsg',function (msg) {
        console.log('msg:'+msg);
        socket.broadcast.emit('sendMsg',socket.user,users,msg);
    })
    
    socket.on('putPrivateMsg',function (userId,msg) {
        console.log('userName:'+userId+'msg:'+msg);
        userId = findByName(userId);
        console.log('userId:'+userId+'msg:'+msg);
        socket.broadcast.to(userId).emit('sendPrivateMsg',socket.user,users,msg);
    })
    function isHaveName(user) {
        for(var i=0; i < users.length;i++){
            if (users[i].nickName== user.nickName){
                return true;
            }
        }
        return false;
    }
    function isHave(user) {
        for(var i=0; i < users.length;i++){
            if (users[i].id== user.id){
                return true;
            }
        }
        return false;
    }
    function findByName(userName) {
        for (var i = 0; i < users.length; i++){
            if(users[i].nickName == userName){
                return users[i].id;
            }
        }
        return 0;
    }
})