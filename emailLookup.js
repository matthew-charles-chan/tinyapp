const emailLookup = function(data, email) {
  let userData = undefined;
  for (const user in data) {
    if (email === data[user].email) {
      userData = data[user];
      return userData;
    }
  }
  return userData;
};

module.exports = emailLookup;


// const users = {
//   "userRandomID": {
//     id: "userRandomID",
//     email: "user@example.com",
//     password: "purple-monkey-dinosaur"
//   },
//   "user2RandomID": {
//     id: "user2RandomID",
//     email: "user2@example.com",
//     password: "dishwasher-funk"
//   }
// };

// console.log(emailLookup(users, "user@example.com"));


// const compare = (obj1, obj2) => {
//   let isSame = true;
//   let keys = Object.keys(obj1);
//   keys.forEach(key => {
//     if (obj1[key] !== obj2[key]) {
//       isSame = false;
//     }
//   });
//   return isSame;
// };

// console.log(compare(users, users2));