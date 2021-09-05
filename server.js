const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "mebrahim",
    password: "",
    database: "face-recognition",
  },
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  // res.send(database.users);
  knex
    .select("*")
    .from("users")
    .then((users) => res.json(users))
    .catch((error) => res.status(400).json("Unable to get users"));
});

app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, knex, bcrypt);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, knex, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, knex);
});

app.put("/image", (req, res) => {
  image.handleImagePut(req, res, knex);
});

app.post("/imageAPI", (req, res) => {
  image.handleImageApiCall(req, res);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
