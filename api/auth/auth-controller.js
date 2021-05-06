const User = require("../../model/user-model");
const StringUtil = require("../../utilities/string-util");
const authServices = require("../../services/auth-service");


/**
 * 
 * @param {the request comming from the client} req 
 * @param {send the data to the client} res 
 * return the user if exist or if the password matches
 */
exports.index = (req, res) => {
  const validation = validateIndex(req.body);
  if (!validation.isValid) {
    console.log(validation.message);
    return res.status(400).json({ message: validation.message });
   
  }
  User.findOne({ username: req.body.username.toLowerCase() }, (error, user) => {
    if (error) {
      return res.status(500).json();
    }
    if (!user) {
      return res.status(401).json({message: 'User does not match'});
    }

    const passwordmatch = User.passwordMatches(
      req.body.password,
      user.password
    );
    if (!passwordmatch) {
      return res.status(401).json({message: 'Password does not match'});
    }
    const token = authServices.generateJWT(user);
    return res.status(200).json({ token: token });
  });
};

/**
 * 
 * @param {the request body} body 
 * validate the body of the request
 */

function validateIndex(body) {
  let errors = "";
  if (StringUtil.isEmpty(body.username)) {
    errors += "Username is require.";
  }
  if (StringUtil.isEmpty(body.password)) {
    errors += "Password is require.";
  }
  return {
    isValid: StringUtil.isEmpty(errors),
    message: errors,
  };
}
