var express = require("express");

var router = express.Router();
var db = require("../models/index");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Routes
router.get('/',(req,res) => {
  res.redirect('/index');
})

router.get('/index', (req, res) => {
  db.Article.find({})
        .then(function(dbArticle) {
          // If any Books are found, send them to the client
          console.log(dbArticle);
          res.render("index", { articles: dbArticle });
        })
        .catch(function(err) {
          // If an error occurs, send it back to the client
          res.json(err);
        });
 });

// A GET route for scraping the echoJS website
router.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("https://www.huffingtonpost.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("div.card__content").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
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
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      });
  
      // If we were able to successfully scrape and save an Article, send a message to the client
      res.send("Scrape Complete");
    });
  });
  
  // Route for getting all Articles from the db
  router.get("/articles", function(req, res) {
      // TODO: Finish the route so it grabs all of the articles
      
      db.Article.find({})
        .then(function(dbArticle) {
          // If any Books are found, send them to the client
          res.json(dbArticle)
        })
        .catch(function(err) {
          // If an error occurs, send it back to the client
          res.json(err);
        });
    });
  
    router.get("/remove/:id", function(req, res) {
      // TODO: Finish the route so it grabs all of the articles
      db.Article.remove({_id: req.params.id})
        .then(function(dbArticle) {
          // If any Books are found, send them to the client
          res.send("Article deleted");
        })
        .catch(function(err) {
          // If an error occurs, send it back to the client
          res.json(err);
        });
    }); 
  
    // Route for clearing all Articles from the db
  router.delete("/clear", function(req, res) {
      // TODO: Finish the route so it grabs all of the articles
      db.Article.remove({})
        .then(function(dbArticle) {
          // If any Books are found, send them to the client
          res.send("Cleared");
        })
        .catch(function(err) {
          // If an error occurs, send it back to the client
          res.json(err);
        });
    });
  
    router.put("/articles/:id/:status", function(req, res) {
      // TODO
      // ====
      // Finish the route so it finds one article using the req.params.id,
      // and run the populate method with "note",
      // then responds with the article with the note included
      db.Article.update({_id: req.params.id}, {$set: {saved: req.params.status}}, function (err, raw) {})
  
        .then(function(dbArticle) {
          // If any Books are found, send them to the client
          res.json(dbArticle);
        })
        .catch(function(err) {
          // If an error occurs, send it back to the client
          res.json(err);
        });
    });
  
    router.get("/saved", function(req, res) {
      // TODO: Finish the route so it grabs all of the articles
      db.Article.find({saved: true})
        .then(function(dbArticle) {
          // If any Books are found, send them to the client
          res.render("saved", { articles: dbArticle });
        })
        .catch(function(err) {
          // If an error occurs, send it back to the client
          res.json(err);
        });
    });

   
    
  // Export routes for server.js to use.
module.exports = router;
