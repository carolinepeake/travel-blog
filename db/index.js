// require db connection and all models and export an instance of each model class (shouldn't need to require db connection anywhere else then)

const models = require(./models);

const Test = models.Test;
const Post = models.Post;
const Location = models.Location;
const Tag = require('./tag');



// would prolly go in controllers
// switch ('locations')
//   case 'READ' {
//     case 'FIND ALL' {
//       return
//     };
//     case 'FIND ONE' {
//       return
//     };
//   }


  // const createAccount() {
  //   // save new User
  //   // return User._id
  // }

  // const login() {

  // }

  // const addPostAsNewUser() {
  //   // create & save user
  //   // get user._id
  //   // create & save post
  //   // get all posts
  // }


// module.exports.Controllers = require('./Controllers');
// module.exports.Models = require('./Models');



