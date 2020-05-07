const { users } = require("./database/user-database");
const { urlDatabase } = require("./database/url-database");

// generates random string with string length as a paramater
const generateRandomString = function(length) {
  let result = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charsLength = chars.length;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return result;
};

// given a user object, returns all urls created by user. takes user name
// and url database as parameters
const lookupUserURLs = function(user, urls) {
  let userURLS = {};
  for (let url in urls) {
    if (urls[url].userID === user.id) {
      userURLS[url] = urls[url];
    }
  }
  return userURLS;
};

// given an email (string), return the user object
const lookupEmail = function(data, email) {
  let userData = undefined;
  for (const user in data) {
    if (email === data[user].email) {
      userData = data[user];
      return userData;
    }
  }
  return userData;
};

// given http request return, user object
const getUser = function(req) {
  let userData = users[(req).session["user_id"]];
  return userData;
};

// given http request and request pararamater, return true/false authorized
const isAuthorized = function(req, param) {
  if (!getUser(req)) {
    return false;
  } else if (getUser(req).id !== urlDatabase[req.params[param]].userID) {
    return false;
  } else {
    return true;
  }
};

// given a url, if url doesn't include http, prefix with http://
const formatURL = function(longURL) {
  let formattedURL = "";
  if (longURL.includes('http')) {
    formattedURL = longURL;
  } else {
    formattedURL = "http://" + longURL;
  }
  return formattedURL;
};

const addCount = function(dataBase, shortUrl) {
  dataBase[shortUrl].viewCount ++;
  return;
};


module.exports =  { formatURL, generateRandomString, lookupUserURLs, lookupEmail, getUser, isAuthorized, addCount };
