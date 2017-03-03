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
        .fadeOut(350)
      ;
    })
  ;
})

function openNotif() {
    $(".notifBar").css({'width' : "250px", 'visibility': 'visible'});
    $(".container").css({'marginLeft' : "250px"});
}

function closeNotif() {
    $(".notifBar").css({'width' : "0px", 'visibility': 'hidden'});
    $(".container").css({'marginLeft' : "0px"});
}
