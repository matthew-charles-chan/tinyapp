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


module.exports =  { generateRandomString, lookupUserURLs, lookupEmail };
