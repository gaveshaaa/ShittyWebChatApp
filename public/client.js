var socket = io();

var messages = document.querySelector(".list");
var form = document.getElementById('sendButton');
var input = document.getElementById('message-input');

var currentUsername = prompt("Username?");


setInterval(function(){
    var inputPanel = document.querySelector(".messages");
}, 1000)

if (currentUsername != null) {
    socket.emit("user-joined", currentUsername)
}

form.addEventListener('click', function (e) {
    e.preventDefault();
    if (input.value) {
        if (currentUsername != null) {
            socket.emit('chat-msg-event', input.value);
            input.value = '';
        }
    }
});

input.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        if (currentUsername != null) {
            socket.emit('chat-msg-event', `${currentUsername} - ${input.value}`);
            input.value = '';
        }
    }
});

socket.on('user-joined', function (username) {
    var item = document.createElement('li');
    item.textContent = `${username} has joined the crib`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('history-loaded', function (msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('user-disconnected', function (name) {
    var item = document.createElement('li');
    item.textContent = `${name} has left the chat`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('chat-msg-event', function (date) {
    var item = document.createElement('li');
    item.textContent = `${date.sent} : ${date.message}`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

