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


// const users = {
//   id: "userRandomID",
//   email: "user@example.com",
//   password: "purple-monkey-dinosaur"
// };

// const users2 = {
//   id: "userRandomID",
//   email: "user3@example.com",
//   password: "purple-monkey-dinosaur"
// };




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
