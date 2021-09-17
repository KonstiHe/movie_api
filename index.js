const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const app = express();

let topMovies = [
  { title: "Kostja", regie: "" },
  { title: "", regie: "" },
  { title: "", regie: "" },
  { title: "", regie: "" },
  { title: "", regie: "" },
  { title: "", regie: "" },
  { title: "", regie: "" },
  { title: "", regie: "" },
  { title: "", regie: "" },
  { title: "", regie: "" }
];

app.use(morgan("common"));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome to my favorite movies!");
});

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

app.get("/movies/:title", (req, res) => {
  res.send("Successful GET request returning data on a title");
});

app.get("/genres/:genre", (req, res) => {
  res.send("Successful GET request returning data on a genre");
});

app.get("/directors/:name", (req, res) => {
  res.send("Successful GET request returning data on a director.");
});

app.post("/register", (req, res) => {
  res.send("Successful POST request returning data of a new user.");
});

app.put("/users/:name", (req, res) => {
  res.send("Successful PUT request returning updated data of a user.");
});

app.put("/users/:name/favorites/:newMovie", (req, res) => {
  res.send(
    "Successful PUT request returning a message to a user about successufully adding a movie."
  );
});

app.delete("/users/:name/favorites/:movieToRemove", (req, res) => {
  res.send(
    "Successful DELETE request returning a message to a user about successufully deleting a movie."
  );
});

app.delete("/users/:name/deregister", (req, res) => {
  res.send(
    "Successful DELETE request returning a message to a user about successufully deregistering."
  );
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
