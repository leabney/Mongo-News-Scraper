var express = require("express");
var path = require("path");

var router = express.Router();
var db = require(path.join(__dirname, '../models/index'));

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Routes
// Send to index
router.get('/', (req, res) => {
  res.redirect('/index');
})

//Index - return any articles
router.get('/index', (req, res) => {
  db.Article.find({})
    .then(function (dbArticle) {
      //render index with articles
      console.log(dbArticle);
      res.render("index", { articles: dbArticle });
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

//Route to scrape the Huffington Post site
router.get("/scrape", function (req, res) {
  //Request
  axios.get("https://www.huffingtonpost.com/").then(function (response) {
    // Load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    //Grab Huffington Post card content:
    $("div.card__content").each(function (i, element) {
      // Save empty result object
      var result = {};
      // Add the title, image and link - save in result object
      result.title = $(this)
        .find("div.card__headline__text")
        .text();
      result.image = $(this)
        .find("img.card__image__src")
        .attr("src")
      result.link = $(this)
        .find("a.card__image__wrapper")
        .attr("href")
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });
    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
router.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      // If any Articles are found, send them to the client
      res.json(dbArticle)
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route for getting all Articles from the db
router.get("/notes", function (req, res) {
  db.Note.find({})
    .then(function (dbNote) {
      // If any Articles are found, send them to the client
      res.render("notes",{notes: dbNote})
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route for clearing all Articles from the db (for testing purposes)
router.delete("/clear", function (req, res) {
  db.Article.remove({})
    .then(function (dbArticle) {
      //Send cleared message to client
      res.send("Cleared");
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route for clearing all notes from the db (for testing purposes)
router.delete("/notes", function (req, res) {
  db.Note.remove({})
    .then(function (dbNote) {
      //Send cleared message to client
      res.send("Cleared");
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});


//Route to delete notes//
router.delete("/clearnote/:id", function (req, res) {
  db.Note.remove({_id: req.params.id})
    .then(function (dbArticle) {
      //Send cleared message to client
      res.send("Note removed");
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

//Route to change Saved status
router.put("/articles/:id/:status", function (req, res) {
  // Find the article by id, update status
  db.Article.update({ _id: req.params.id }, { $set: { saved: req.params.status } }, function (err, raw) { })
    .then(function (dbArticle) {
      // If any Articles are found, send them to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

//Route to get all Saved articles
router.get("/saved", function (req, res) {

 db.Article.find({ saved: true })
 .populate("note")
    .then(function (dbArticle) {

      // Render saved page with articles
     res.render("saved", { articles: dbArticle });
      console.log(dbArticle);
    })

    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});




// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//Route to get all notes for article
router.get("/notes/:id", function (req, res) {
  db.Note.find({ article: req.params.id })
    .then(function (dbNote) {
      // If any Notes are found, send them to the client
     res.json(dbNote);
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});



// Export routes for server.js to use.
module.exports = router;
