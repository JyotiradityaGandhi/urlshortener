const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username must be unique"],
    },
    email: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please use the proper email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    passwordConfirm: {
      type: String,
      validate: {
        valiidator: function (el) {
          return el === this.password;
        },
        message: "Passwords do not match",
      },
    },
    urls: [mongoose.Schema.Types.ObjectId],
  },
  {
    timestamps: true,
    strict: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
