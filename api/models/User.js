const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const trackerSetSchema = new mongoose.Schema({
  tracked_id: {
    // reference to tracker id
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tracker",
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  goal: String, // water intake goal
  tracked: [trackerSetSchema], // array of tracker ids
});

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (pwd) {
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(pwd, user.password, (err, isMatch) => {
      if (err) {
        return next(err);
      }

      if (!isMatch) {
        return reject(false);
      } else {
        resolve(true);
      }
    });
  });
};

mongoose.model("User", userSchema);
