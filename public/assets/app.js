$(document).ready(function () {
//Scrape articles from Huffington Post//
    $("#scrape").on("click", function () {
        $.ajax({
            url: '/scrape',
            type: 'GET',
            success: function (result) {
                console.log("Articles scraped");
            }
        });
    });
//Reload location when Modal is closed//
    $("#modalClose").on("click", function () {
        location.reload();
    })
//Save articles//
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
//Un-save article//
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


//Save note
    $(".saveNote").on("click", function (event) {
        event.preventDefault();

        var newNote = $("#newNote").val().trim();
        // alert(articleId + ': ' + newNote);

        $.ajax({
            url: '/articles/'+ articleId,
            type: 'POST',
            data: {
                body: newNote,
                article: articleId
              },
            success: function (result) {
                console.log("Note added.");               
            }
        });
       
        $("#newNote").val("");
        var id = "";
        
    })

    var articleId="";

    $(".addNote").on("click",function(event){
        event.preventDefault();
        articleId=$(this).attr("add-id");
        // alert(articleId);
        $.ajax({
            url: '/notes/' + articleId,
            type: 'GET',
            success: function (result) {
            $("#noteContainer").empty();
            var notes=[];
               for (var i=0; i<result.length; i++){
                
                notes.push('<div class="row"><div class="col-sm-10"><p>'+result[i].body+'</p></div><div class="col-sm-2"><button class="btn btn-danger note-delete" data-dismiss="modal" id="'+result[i]._id + '">x</button></div></div>')
               }
               $("#noteContainer").append(notes);
            }
        });

    });

    $('#noteModal').on('click', '.note-delete', function () {
        event.preventDefault();
        noteId=$(this).attr("id");
        $.ajax({
            url: '/clearnote/' + noteId,
            type: 'DELETE',
            success: function (result) {
                          }
        });
    });
    
    $("#delete").on("click", function () {
        $.ajax({
            url: '/clear',
            type: 'DELETE',
            success: function (result) {
                location.reload();

            }
        });
    });

    $("#deleteNotes").on("click", function () {
        $.ajax({
            url: '/notes',
            type: 'DELETE',
            success: function (result) {
                location.reload();

            }
        });
    });

});