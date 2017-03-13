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
  console.log($(".notifBar").width())
    if ($(".notifBar").width() < 1) {
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
    } else {
        $(".notifBar").css({
            'width': "0px"
        });
        $(".container").css({
            'marginLeft': "0px"
        });
        $(".openNotif").fadeIn(800)
    }
}

function closeNotif() {}
