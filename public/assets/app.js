
$(document).ready(function () {

    $("#scrape").on("click", function () {
        $.ajax({
            url: '/scrape',
            type: 'GET',
            success: function (result) {
                console.log("Articles scraped");
            }
        });
    });

    $("#modalClose").on("click", function () {
        location.reload();
    })

    $('#articles').on('click', '.save', function () {
        var id = $(this).attr("id");
        var status = 'true'
        $.ajax({
            url: '/articles/' + id + '/' + status,
            type: 'PUT',
            data: 'saved=true',
            success: function (result) {
                console.log(result);
            }
        })
    })

    $(".remove").on("click", function () {
        var id = $(this).attr("id");
        var status = 'false'
        $.ajax({
            url: '/articles/' + id + '/' + status,
            type: 'PUT',
            data: 'saved=false',
            success: function (result) {
                console.log(result);
                location.reload();
            }
        })
    })

    $(".saveNote").on("click", function () {
        var id = $(this).attr("id");
        var newNote = $("#newNote").val().trim();
        alert(id+": "+ newNote);

        $.ajax({
            url: '/articles/'+ id,
            type: 'POST',
            success: function (result) {
                console.log("Note added.");
            }
        });
    })

    
    $("#delete").on("click", function () {
        $.ajax({
            url: '/clear',
            type: 'DELETE',
            success: function (result) {
                location.reload();

            }
        });
    });

});