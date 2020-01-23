// const generateRandomString = require('./generateRandomString');
// const lookupEmail = require('./emailLookup');
// const lookupUsersURL = require('./lookupUsersURLS');
// const cookieParser = require('cookie-parser');

// set PORT
const PORT = 8080;

// dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");

// imports
const { generateRandomString, lookupUserURLs, lookupEmail } = require("./helperFunctions");
const { urlDatabase } = require("./database/url-database");
const { users } = require("./database/user-database");

// set view engine, ejs
app.set("view engine", "ejs");

// middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ["secret"]
}));


// redirect to longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// create new shortURL
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.session["user_id"]]
  };
  if (templateVars.user) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

// READ specific url
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.session["user_id"]],
  };
  res.render("urls_show", templateVars);
});

// BROWSE all urls
app.get("/urls", (req, res) => {
  const user = users[req.session["user_id"]];
  if (!user) {
    res.redirect("/login");
    return;
  }
  const userURLS = lookupUserURLs(user, urlDatabase);
  let templateVars = {
    urls: userURLS,
    user: user
  };
  res.render("urls_index", templateVars);
});

//renders registration page
app.get("/register", (req, res) => {
  let templateVars = {
    user: users[req.session["user_id"]]
  };
  res.render("user_registration", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.session["user_id"]]
  };
  res.render("user_login", templateVars);
});

// redirect / to urls page
app.get('/', (req, res) => {
  res.redirect("/login");
});

// DELETE key:vlue pair in urlDatabase
app.post("/urls/:shortURL/delete", (req, res) => {
  // if shortURL not created by user, or user not logged in, return status code 403
  if (!users[req.session["user_id"]] || users[req.session["user_id"]].id !== urlDatabase[req.params.shortURL].userID) {
    res.sendStatus(403);
  } else {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  }
});

// EDIT longURL
app.post("/urls/:id", (req, res) => {
  const longURL = req.body.longURL;
  // if shortURL not created by user, or user not logged in, return status code 403
  if (!users[req.session["user_id"]] || users[req.session["user_id"]].id !== urlDatabase[req.params.id].userID) {
    res.sendStatus(403);
  } else {
    urlDatabase[req.params.id] = {
      longURL: longURL,
      userID: users[req.session["user_id"]].id
    };
    res.redirect("/urls");
  }
});

//create new URL
app.post("/urls", (req, res) => {
  const newShortURL = generateRandomString(6);
  urlDatabase[newShortURL] = {
    longURL: req.body.longURL,
    userID: users[req.session["user_id"]].id
  };
  res.redirect(`/urls/${newShortURL}`);
});

//login with user_id (cookie)
app.post("/login", (req, res) => {
  if (lookupEmail(users, req.body.email)) {
    let userData = lookupEmail(users, req.body.email);
    if (bcrypt.compareSync(req.body.password, userData.password)) {
      req.session["user_id"] = userData.id;
      res.redirect("/urls");
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
});

//logout, clear cookie
app.post("/logout", (req, res) => {
  req.session = null;
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
    password: bcrypt.hashSync(req.body.password, 10)
  };
  console.log(users);
  // res.cookie("user_id", userID);
  req.session["user_id"] = userID;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});