// set PORT
const PORT = 8080;

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");

const { generateRandomString, lookupUserURLs, lookupEmail, getUser, isAuthorized } = require("./helperFunctions");
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
  // if shorlURL does not exist, display message "not found"
  if (!urlDatabase[req.params.shortURL]) {
    res.sendStatus(404);
  // if shortURL is valid, redirect to long URL
  } else {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  }
});

// render new URL page
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: getUser(req)
  };
  // if user is logged in, render urls_new page
  if (templateVars.user) {
    res.render("urls_new", templateVars);
  // if user is not logged in, redirect to login
  } else {
    res.redirect("/login");
  }
});

// READ specific url
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    urlUserID: urlDatabase[req.params.shortURL].userID,
    user: getUser(req),
  };
  res.render("urls_show", templateVars);
});

// BROWSE all urls
app.get("/urls", (req, res) => {
  const user = getUser(req);
  // if user is not logged in, redirect to login page
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
    user: getUser(req)
  };
  res.render("user_registration", templateVars);
});

// render login page
app.get("/login", (req, res) => {
  let templateVars = {
    user: getUser(req)
  };
  res.render("user_login", templateVars);
});

// redirect / to login page
app.get('/', (req, res) => {
  // if user is not logged in, redirect to login
  if (!getUser(req)) {
    res.redirect("/login");
  // if user is logged in, redirect to /urls
  } else {
    res.redirect("/urls");
  }
});

// DELETE key:vlue pair in urlDatabase
app.post("/urls/:shortURL/delete", (req, res) => {
  // if not authorized, send status code: 403
  if (!isAuthorized(req, 'shortURL')) {
    res.sendStatus(403);
  } else {
    // delete shortURL and redirect to /urls
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  }
});

// EDIT longURL
app.post("/urls/:id", (req, res) => {
  const longURL = req.body.longURL;
  console.log(getUser(req));
  // if not authorized, send status code: 403
  if (!isAuthorized(req, "id")) {
    res.sendStatus(403);
  } else {
    // update shortURL with new longURL
    urlDatabase[req.params.id] = {
      longURL: longURL,
      userID: getUser(req).id
    };
    res.redirect("/urls");
  }
});

//create new URL
app.post("/urls", (req, res) => {
  // if user logged in
  if (getUser(req)) {
    const newShortURL = generateRandomString(6);
    urlDatabase[newShortURL] = {
      longURL: req.body.longURL,
      userID: getUser(req).id
    };
    res.redirect(`/urls/${newShortURL}`);
    // if user not logged in, send status code 403
  } else {
    res.sendStatus(403);
  }
});

//login with user_id (cookie)
app.post("/login", (req, res) => {
  // if email e
  if (lookupEmail(users, req.body.email)) {
    let userObj = lookupEmail(users, req.body.email);
    if (bcrypt.compareSync(req.body.password, userObj.password)) {
      req.session["user_id"] = userObj.id;
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