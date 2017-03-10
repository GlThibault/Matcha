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
        max: 30,
        values: [0, 30],
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
        $('.users .user').hide().filter(function() {
            var age = parseInt($(this).find("#age").text())
            var pop = parseInt($(this).find("#pop").text())
            var dist = parseInt($(this).find("#dist").text())
            if ($("#slider-range-dist").slider("values", 0) != 0 || $("#slider-range-dist").slider("values", 1) != 500)
                return age >= $("#slider-range-age").slider("values", 0) &&
                    age <= $("#slider-range-age").slider("values", 1) &&
                    pop >= $("#slider-range-pop").slider("values", 0) &&
                    pop <= $("#slider-range-pop").slider("values", 1) &&
                    dist >= $("#slider-range-dist").slider("values", 0) &&
                    dist <= $("#slider-range-dist").slider("values", 1)
            else
                return age >= $("#slider-range-age").slider("values", 0) &&
                    age <= $("#slider-range-age").slider("values", 1) &&
                    pop >= $("#slider-range-pop").slider("values", 0) &&
                    pop <= $("#slider-range-pop").slider("values", 1)
        }).show()
    })

    $("#ageAscending").click(function() {
        $('.users .user').sort(ageAscending).appendTo('.users')
    })
    $("#popDescending").click(function() {
        $('.users .user').sort(popDescending).appendTo('.users')
    })
    $("#distAscending").click(function() {
        $('.users .user').sort(distAscending).appendTo('.users')
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

function sorttag(tag) {
    $('.users .user').hide().$(':contains("42")').show()
}
