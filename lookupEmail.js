const lookupEmail = function(data, email) {
  let emailUsed = false;
  for (const user in data) {
    if (email === data[user].email) {
      emailUsed = true;
    }
  }
  return emailUsed;
};

module.exports = lookupEmail;
