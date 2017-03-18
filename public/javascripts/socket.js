$(function() {
    var socket = io.connect();
    socket.on('error', function(reason) {
        console.error('Unable to connect Socket.IO', reason)
    });
    socket.on('notif', function(data) {
        alert(data)
        addNotif(data)
    });
    socket.on('message', function(data) {
        if (location.pathname == "/u/" + data.username) {
            addChatMessage(data)
            openChat()
        } else {
            alert("Vous avez recu un message de " + data.username)
            addNotif(data.username + " vous a envoyé un message.")
        }
    });
})
