const { users } = require("./database/user-database");
const { urlDatabase } = require("./database/url-database");

const generateRandomString = function(length) {
  let result = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charsLength = chars.length;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return result;
};

const lookupUserURLs = function(user, urls) {
  let userURLS = {};
  for (let url in urls) {
    if (urls[url].userID === user.id) {
      userURLS[url] = urls[url];
    }
  }
  return userURLS;
};

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

const getUser = function(req) {
  let userData = users[(req).session["user_id"]];
  return userData;
};

const isAuthorized = function(req, param) {
  if (!getUser(req)) {
    return false;
  } else if (getUser(req).id !== urlDatabase[req.params[param]].userID) {
    return false;
  } else {
    return true;
  }
};


module.exports =  { generateRandomString, lookupUserURLs, lookupEmail, getUser, isAuthorized };
