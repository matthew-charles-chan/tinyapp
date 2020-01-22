const generateRandomString = require('./generateRandomString');
const lookupEmail = require('./lookupEmail');
const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
// user database
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// redirect to longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// create new shortURL
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_new", templateVars);
});

// READ specific url
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_show", templateVars);
});

// BROWSE all urls
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_index", templateVars);
});

// display urls as JSON
app.get("/urls.json", (req,res) => {
  res.json(urlDatabase);
});


//renders registration page
app.get("/register", (req, res) => {
  res.render("user_registration");
});

// redirect / to urls page
app.get('/', (req, res) => {
  res.redirect("/urls");
});

// DELETE key:vlue pair in urlDatabase
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  
  res.redirect("/urls");
});

// EDIT longURL
app.post("/urls/:id", (req, res) => {
  console.log(req.body);
  const longURL = req.body.longURL;
  urlDatabase[req.params.id] = longURL;

  res.redirect("/urls");
});

//create new URL
app.post("/urls", (req, res) => {
  console.log(req.body);
  const newShortURL = generateRandomString(6);
  urlDatabase[newShortURL] = req.body.longURL;
  res.redirect(`/urls/${newShortURL}`);
});

//login with username (cookie)
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

//logout, clear cookie
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

// ADD user through register form
app.post("/register", (req, res) =>{
  const userID = generateRandomString(8);
  if (req.body.email === "" || req.body.password === "") {
    res.sendStatus(400);
    return;
  }
  // checks if email already exists in database
  if (lookupEmail(users, req.body.email)) {
    res.sendStatus(400);
    return;
  }
  // if req.body.email not in users, register new user
  users[userID] = {
    id: userID,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie("user_id", userID);
  res.redirect("/urls");
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
