$(function() {
    $('#submit').on('click', function(event) {
        event.preventDefault()
        $.ajax({
            async: true,
            url: '/result',
            type: 'POST',
            dataType: 'html',
            data: {
                'age0': $("#slider-range-age").slider("values", 0),
                'age1': $("#slider-range-age").slider("values", 1),
                'pop0': $("#slider-range-pop").slider("values", 0),
                'pop1': $("#slider-range-pop").slider("values", 1),
                'dist0': $("#slider-range-dist").slider("values", 0),
                'dist1': $("#slider-range-dist").slider("values", 1),
                'tags': $(".filtertag").attr("class").split(" ")
            },
            success: function(data) {
               $(".container2").html(data);
            }
        })
    })
})
