const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;


app.use(express.static('public'))


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const history = []
const users = {}

io.on('connection', (socket) => {

    socket.emit('history-loaded', history);
   
    var total = io.engine.clientsCount;
    socket.emit('getCount', total)

    socket.on('user-joined', username => {  
        users[socket.id] = username;
        io.emit('user-joined', username);
    });
    socket.on('token-sfl', token => {
        io.emit('token-sfl', token);
    });
    socket.on('chat-msg-event', message => {
        history.push(`${users[socket.id]} - ${message} \n`);
        io.emit('chat-msg-event', {message: message, sent: users[socket.id]});
    });
    socket.on('disconnect', () => {
        io.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
});

http.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});