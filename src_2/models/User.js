const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = mongoose.Schema({
    id: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 4
    },
    name: {
      type: String,
      trim: true
    },
    classof: {
      type: String,
    },
    dep: {
      type: String,
      trim: true
    },
    token: { type: String,
 },
    tokenTime: {
  type: Number,
 },
})

userSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
          if (err) return next(err);
            user.password = hash
            next()
          })
      })
    } else {
        next()
  }
});

const User = mongoose.model('User', userSchema);
module.exports = { User }
