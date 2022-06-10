const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB');

const blogSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Article = mongoose.model("articles", blogSchema);
//////////////////// targetting All Articles ////////////////////////
app.route("/articles")
  .get(function (req, res) {
    Article.find({}, function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    })
  })
  .post(function (req, res) {
    const article = new Article({
      title: _.upperCase(req.body.title),
      content: req.body.content
    })
    article.save(function () {
      res.send("article posted successfully")
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("All Articles Deleted Successfully");
      } else {
        res.send(err);
      }
    })
  });
//////////////////// targetting specific Article ////////////////////////
app.route("/articles/:title")
  .get(function (req, res) {
    const title = _.upperCase(req.params.title);
    Article.find({ title: title }, function (err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("Sorry, Article not found!");
      }
    })
  })
  .put(function (req, res) {
    const title = _.upperCase(req.params.title);
    Article.replaceOne({ title: title },
      {
        title: _.upperCase(req.body.title),
        content: req.body.content
      },
      function (err) {
        if (!err) {
          res.send("Article Rewritten Successfully!");
        }
      })
  })
  .patch(function (req, res) {
    const title = _.upperCase(req.params.title);
    Article.updateOne({ title: title },
      {
        title: _.upperCase(req.body.title),
        content: req.body.content
      },
      function (err) {
        if (!err) {
          res.send("Article Updated Successfully!");
        }
      })
  })
  .delete(function(req,res){
    const title = _.upperCase(req.params.title);
    Article.deleteOne({title: title},function(err){
      if(!err){
        res.send("Article Deleted Successfully")
      }else{
        res.send(err);
      }
    })
  });


app.listen('3000', function () {
  console.log("port up on 3000");
})
