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
