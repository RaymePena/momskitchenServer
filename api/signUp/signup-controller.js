const StringUtil = require("../../utilities/string-util");
const User = require("../../model/user-model");

exports.index = (req, res) => {
  const validation = validateIndex(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ message: validation.message });
  }

  const user = new User({
    first: req.body.first,
    last: req.body.last,
    username: req.body.username.toLowerCase(),
    password: req.body.password,
    email: req.body.email,
  });
  console.log(user, 147);
  user.save((error) => {
    console.log(error);
    if (error) {
      if (error.code === 11000) {
        return res.status(403).json({ message: "Username is already taken" });
      }
      return res.status(500).json({ message: "This is a network problem" });
    }
    return res.status(200).json();
  });
};

function validateIndex(body) {
  let errors = "";
  if (StringUtil.isEmpty(body.username)) {
    errors += "Username is required.";
  }
  if (StringUtil.isEmpty(body.password)) {
    errors += "Password is required.";
  }
  if (StringUtil.isEmpty(body.first)) {
    errors += "First name is required.";
  }
  if (StringUtil.isEmpty(body.last)) {
    errors += "Last name is required.";
  }
  if (StringUtil.isEmpty(body.email)) {
    errors += "Email is required.";
  }
  return {
    isValid: StringUtil.isEmpty(errors),
    message: errors,
  };
}
