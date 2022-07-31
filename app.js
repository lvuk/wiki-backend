const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static('public'));

//TODO
mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true });

const articleSchema = mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model('Article', articleSchema);

app
  .route('/articles')
  .get((req, res) => {
    Article.find({}, (err, articles) => {
      if (err) res.send(err);
      else {
        res.send(articles);
      }
    });
  })
  .post((req, res) => {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    console.log(article.title, article.content);
    article.save((err) => {
      if (!err) {
        res.send('Successfully added a new article');
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send('Successfully deleted all articles');
      } else {
        res.send(err);
      }
    });
  });

app
  .route('/articles/:title')
  .get((req, res) => {
    Article.findOne({ title: req.params.title }, (err, article) => {
      if (!err) {
        res.send(article);
      } else {
        res.send(err);
      }
    });
  })
  .put((req, res) => {
    Article.updateOne(
      { title: req.params.title },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (!err) res.send('Successfully updated');
      }
    );
  })
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.title },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send('Successfully updated article.');
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.title }, (err) => {
      if (!err) res.send('Successfully deleted');
      else res.send(err);
    });
  });

app.listen(3000, function () {
  console.log('Server started on port 3000');
});
