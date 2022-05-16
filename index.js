const express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path'),
  mongoose = require('mongoose'),
  Models = require('./models.js');

const app = express();
//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://127.0.0.1/MyFlixDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.get('/', (req, res) => {
  res.send('Welcome to my favorite movies!');
});

app.get('/movies', (req, res) => {
  Movies.find()
    .then(movies => {
      res.status(201).json(movies);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then(movie => {
      res.json(movie);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/genres/:Genre', (req, res) => {
  Movies.find({ 'Genre.Name': req.params.Genre })
    .then(movies => {
      res.json(movies);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/directors/:directorname', (req, res) => {
  console.log(req.params.directorname, 'directorname');
  Movies.find({ 'Director.Name': req.params.directorname })
    .then(director => {
      res.json(director);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then(users => {
      res.status(201).json(users);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Name', (req, res) => {
  Users.findOne({ Name: req.params.Name })
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Name: String,
  Password: String,
  Email: String,
  Birthday: Date,
  FavoriteMovies: [String]
}*/
app.post('/users', (req, res) => {
  Users.findOne({ Name: req.body.Name })
    .then(user => {
      if (user) {
        return res.status(400).send(req.body.Name + 'already exists');
      } else {
        Users.create({
          Name: req.body.Name,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
          .then(user => {
            res.status(201).json(user);
          })
          .catch(error => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Add a movie to a user's list of favorites
app.post('/users/:Name/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate(
    { Name: req.params.Name },
    {
      $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Name: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Name', (req, res) => {
  Users.findOneAndUpdate(
    { Name: req.params.Name },
    {
      $set: {
        Name: req.body.Name,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// Delete a user by username
app.delete('/users/:Name', (req, res) => {
  Users.findOneAndRemove({ Name: req.params.Name })
    .then(user => {
      if (!user) {
        res.status(400).send(req.params.Name + ' was not found');
      } else {
        res.status(200).send(req.params.Name + ' was deleted.');
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.delete('/users/:Name/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate(
    { Name: req.params.Name },
    {
      $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});
