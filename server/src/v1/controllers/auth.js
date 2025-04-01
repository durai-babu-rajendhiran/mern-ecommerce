const User = require("../models/user");
const responseHandlier = require('../utils/status');

exports.createOrUpdateUser = async (req, res) => {
  const { name, picture, email } = req.user;

  const user = await User.findOneAndUpdate(
    { email },
    { name: email.split("@")[0], picture },
    { new: true }
  );
  if (user) {
    console.log("USER UPDATED", user);
         return responseHandlier.successResponse(user, res);
    
  } else {
    const newUser = await new User({
      email,
      name: email.split("@")[0],
      picture,
    }).save();
    return responseHandlier.successResponse(newUser, res);

  }
};

exports.currentUser = async (req, res) => {
  try{
    const UserData = await User.findOne({ email: req.user.email }).exec();
     return responseHandlier.successResponse(UserData, res);
}catch(err){
  res.json(err);
}
};
