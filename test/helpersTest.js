const { assert } = require("chai");

const { lookupUserURLs, lookupEmail } = require("../helperFunctions");

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "user3RandomID": {
    id: "user3RandomID",
    email: "user3@example.com",
    password: "hellomotto"
  },
};

const testURLs = {
  'jPIlTn': { longURL: 'http://www.amazon.ca', userID: 'userRandomID' },
  'RnVVTK': { longURL: 'http://www.reddit.com', userID: 'userRandomID' },
  'sAkE6X': { longURL: 'http://www.lighthouselabs.ca', userID: 'userRandomID' },
  '8wZhhF': { longURL: 'http://www.facebook.com', userID: 'user2RandomID' },
  'eqpKRs': { longURL: 'http://www.gizmodo.com', userID: 'user2RandomID' }
};

describe('lookupEmail', function() {
  it('should return a user with valid email', function() {
    const user = lookupEmail(testUsers,"user@example.com").id;
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });
});

describe('lookupEmail', function() {
  it('should return undefined for a invalid email', function() {
    const user = lookupEmail(testUsers,"user4@example.com");
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});

describe('lookupUsersURLs', function() {
  it('should return a users urls, from their userID', function() {
    const userURLS = lookupUserURLs(testUsers["user2RandomID"], testURLs);
    const expectedOutput = {
      '8wZhhF': { longURL: 'http://www.facebook.com', userID: 'user2RandomID' },
      'eqpKRs': { longURL: 'http://www.gizmodo.com', userID: 'user2RandomID' }
    };
    assert.deepEqual(userURLS, expectedOutput);
  });
});

describe('lookupUsersURLs', function() {
  it('should return an empty object if user has no URLS', function() {
    const userURLS = lookupUserURLs(testUsers["user3RandomID"], testURLs);
    const expectedOutput = {};
    assert.deepEqual(userURLS, expectedOutput);
  });
});




