$(function() {
    $('#tagsubmit').on('click', function(event) {
        event.preventDefault()
        $.ajax({
            async: true,
            url: '/tag/add',
            type: 'POST',
            data: {
                'tag': $('#tag').val()
            },
            dataType: 'html'
        })
        $('.tagadd').append("<div class='ui label yellow' style='margin-top: 5px;'>" + $('#tag').val() + "<a id='taglist' onclick='deltag(this)' data-tag=" + $('#tag').val() + "'><i class='icon close'></i></a></div>")
        $('#tag').val('')
    })
})

function deltag(value) {
    event.preventDefault()
    $.ajax({
        async: true,
        url: '/tag/del/' + $(value).attr('data-tag'),
        type: 'GET',
        dataType: 'html'
    })
    $(value).parent().remove()
}
