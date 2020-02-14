const User = require("../models/User");
const UserDex = require("../models/UserDex");

/* Our User controller
	to be used as a a link between server, and the front end (Our API Calls)
*/

const registerUser = (req, res, next) => {
  // console.log(req.body);
  const user = new User(req.body);
  user.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    const userDex = new UserDex({user_id: result._id, dex: 100})
    userDex.save().then(() => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.status(201).json({
        message: "New user registered successfully!"
      });
    })
  });
};

// res.status(201).json({
//   message: "New user registered successfully!"
// });

const findUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user found with that login ID!"
      });
    }
    req.profile = user;
    next();
  });
};

const findUserProfile = (req, res) => {
  // eliminate password related fields before sending the user object
  req.profile.hashedPassword = undefined;
  req.profile.salt = undefined;
  // console.log(req.profile);
  return res.json({
    loggedIn: true,
    user: {
      ...req.profile._doc
    }
  });
};

module.exports = { findUserById, findUserProfile, registerUser };
