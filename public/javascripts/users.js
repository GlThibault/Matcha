$(function() {
    $("#slider-range-age").slider({
        range: true,
        min: 18,
        max: 99,
        values: [18, 99],
        slide: function(event, ui) {
            $("#amount-age").val(ui.values[0] + " - " + ui.values[1])
        }
    })
    $("#amount-age").val($("#slider-range-age").slider("values", 0) + " - " + $("#slider-range-age").slider("values", 1))

    $("#slider-range-pop").slider({
        range: true,
        min: 0,
        max: 1000,
        values: [0, 1000],
        slide: function(event, ui) {
            $("#amount-pop").val(ui.values[0] + " - " + ui.values[1])
        }
    })
    $("#amount-pop").val($("#slider-range-pop").slider("values", 0) + " - " + $("#slider-range-pop").slider("values", 1))

    $("#slider-range-dist").slider({
        range: true,
        min: 0,
        max: 500,
        values: [0, 500],
        slide: function(event, ui) {
            if (ui.values[0] != 0 || ui.values[1] != 500)
                $("#amount-dist").val(ui.values[0] + " - " + ui.values[1])
            else
                $("#amount-dist").val("")
        }
    })

    $("#validate").click(function() {
        $('.cards.users .user').hide().filter(function() {
            var age = parseInt($(this).find("#age").text())
            var pop = parseInt($(this).find("#pop").text())
            var dist = parseInt($(this).find("#dist").text())
            var arrayclasses = $(".filtertag").attr("class").split(" ")
            var tag = this.querySelectorAll(".tags")
            var ret = 1
            $.each(arrayclasses, function(index, val) {
                if (index > 0) {
                    var i = 0;
                    while (tag[i] && tag[i].getAttribute("data-tag") != val)
                        i++;
                    if (!tag[i] || tag[i].getAttribute("data-tag") != val) {
                        ret = 0;
                    }
                }
            })
            if ($("#slider-range-dist").slider("values", 0) != 0 || $("#slider-range-dist").slider("values", 1) != 500)
                return age >= $("#slider-range-age").slider("values", 0) &&
                    age <= $("#slider-range-age").slider("values", 1) &&
                    pop >= $("#slider-range-pop").slider("values", 0) &&
                    pop <= $("#slider-range-pop").slider("values", 1) &&
                    dist >= $("#slider-range-dist").slider("values", 0) &&
                    dist <= $("#slider-range-dist").slider("values", 1) &&
                    ret != 0
            else
                return age >= $("#slider-range-age").slider("values", 0) &&
                    age <= $("#slider-range-age").slider("values", 1) &&
                    pop >= $("#slider-range-pop").slider("values", 0) &&
                    pop <= $("#slider-range-pop").slider("values", 1) &&
                    ret != 0
        }).show()
    })

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
