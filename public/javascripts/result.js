$(function() {
    $("#ageAscending").click(function() {
        $('.cards.users .user').sort(ageAscending).appendTo('.cards.users')
    })
    $("#popDescending").click(function() {
        $('.cards.users .user').sort(popDescending).appendTo('.cards.users')
    })
    $("#distAscending").click(function() {
        $('.cards.users .user').sort(distAscending).appendTo('.cards.users')
    })
    $("#tagsDescending").click(function() {
        $('.cards.users .user').sort(tagsDescending).appendTo('.cards.users')
    })
})

function ageAscending(a, b) {
    return parseInt($(a).find("#age").text()) > parseInt($(b).find("#age").text())
}

function popDescending(a, b) {
    return parseInt($(a).find("#pop").text()) < parseInt($(b).find("#pop").text())
}

function distAscending(a, b) {
    return parseInt($(a).find("#dist").text()) > parseInt($(b).find("#dist").text())
}

function tagsDescending(a, b) {
    var nb_a = 0;
    var nb_b = 0;
    var arrayclasses = document.querySelectorAll(".mytags")
    var tag = a.querySelectorAll(".tags")
    $.each(arrayclasses, function(index, val) {
        val = val.getAttribute("data-tag")
        if (index > 0) {
            var i = 0;
            while (tag[i] && tag[i].getAttribute("data-tag") != val)
                i++;
            if (tag[i] && tag[i].getAttribute("data-tag") == val)
                nb_a++;
        }
    })
    var tag = b.querySelectorAll(".tags")
    $.each(arrayclasses, function(index, val) {
        val = val.getAttribute("data-tag")
        if (index > 0) {
            var i = 0;
            while (tag[i] && tag[i].getAttribute("data-tag") != val)
                i++;
            if (tag[i] && tag[i].getAttribute("data-tag") == val)
                nb_b++;
        }
    })
    return nb_a < nb_b
}

function sorttag(value) {
    var tag = $(value).attr('data-tag')
    if ($(value).hasClass('lightgrey')) {
        $(value).addClass('yellow').removeClass('lightgrey')
        $('.filtertag').addClass(tag)
    } else {
        $(value).addClass('lightgrey').removeClass('yellow')
        $('.filtertag').removeClass(tag)
    }
}
