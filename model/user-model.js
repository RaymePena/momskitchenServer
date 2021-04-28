const mongoose = require("mongoose");
const { StringUtil } = require("../utilities/string-util");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  first: String,
  last: String,
  username: String,
  password: String,
  email: String,
  favorite: Array,
});

userSchema.set("timestamps", true);
userSchema.virtual("fullName").get(function () {
  const first = StringUtil.capitalize(this.first.toLowerCase());
  const last = StringUtil.capitalize(this.last.toLowerCase());
  return `${first} ${last}`;
});

userSchema.statics.passwordMatches = function (password, hash) {
  return bcrypt.compareSync(password, hash);
};

userSchema.pre("save", function (next) {
  this.first = this.first.toLowerCase();
  this.last = this.last.toLowerCase();
  this.username = this.username.toLowerCase();
  const unsafePassword = this.password;
  this.password = bcrypt.hashSync(unsafePassword);
  this.email = this.email.toLowerCase();
  next();
});

module.exports = mongoose.model("user", userSchema);
