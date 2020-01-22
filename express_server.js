const generateRandomString = require('./generateRandomString');
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

// redirect to longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// create new shortURL
app.get("/urls/new", (req, res) => {
  res.render("urls_new", { username: req.cookies["username"] });
});


// READ specific url 
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"],
  };
  res.render("urls_show", templateVars);
});


// BROWSE all urls
app.get("/urls", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});


// display urls as JSON
app.get("/urls.json", (req,res) => {
  res.json(urlDatabase);
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
  const newShortURL = generateRandomString();
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





app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
