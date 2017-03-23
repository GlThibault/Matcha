function addChatMessage(data, options) {
    var $usernameDiv = $('<span class="username" id="columntitle"/>')
        .text(data.username)
    var $messageBodyDiv = $('<span class="messageBody">')
        .text(" : " + data.message);
    var $messageDiv = $('<li class="message"/>')
        .data('username', data.username)
        .append($usernameDiv, $messageBodyDiv);
    $('.messages').append($messageDiv);
}

function cleanInput(input) {
    return $('<div/>').text(input).text();
}
$(window).keydown(function(event) {
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
        $('.inputMessage').focus();
    }
    if (event.which === 13) {
        sendMessage();
    }
});

function openChat() {
    if (screen.width <= 480)
        $(".chatBar").css({
            'width': "100%"
        });
    else {
        $(".chatBar").css({
            'width': "250px"
        });
        $(".container").css({
            'marginRight': "250px"
        });
    }
    $(".openChat").fadeOut(0)
}

function closeChat() {
    $(".chatBar").css({
        'width': "0px"
    });
    $(".container").css({
        'marginRight': "0px"
    });
    $(".openChat").fadeIn(800)
}
