const lookupUserURLS = function(user, urls) {
  let userURLS = {};
  for (let url in urls) {
    if (urls[url].userID === user.id) {
      userURLS[url] = urls[url];
    }
  }
  return userURLS;
};

module.exports = lookupUserURLS;