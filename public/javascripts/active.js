$(function() {
    var url = location.pathname.slice(1)
    if (url)
        var item = document.getElementById(url);
    else
        var item = document.getElementById('index');
    if (item)
        item.className += " active";

    $('.message .close')
        .on('click', function() {
            $(this)
                .closest('.message')
                .fadeOut(350);
        });
})

function openNotif() {
    if (screen.width <= 480)
        $(".notifBar").css({
            'width': "100%"
        });
    else {
        $(".notifBar").css({
            'width': "250px"
        });
        $(".container").css({
            'marginLeft': "250px"
        });
    }
    $(".openNotif").fadeOut(0)
}

function closeNotif() {
    $(".notifBar").css({
        'width': "0px"
    });
    $(".container").css({
        'marginLeft': "0px"
    });
    $(".openNotif").fadeIn(800)
}
