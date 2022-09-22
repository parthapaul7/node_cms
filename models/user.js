const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpire: Date,
  loginAttempts: {
    type: Number,
    required: true
  },
  lockUntil: {
    type: Number
  },
  isAdmin: {
    type: Boolean, 
  },
},{
  timestamps: true
});

  //authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      if(password === user.password){
        return callback(user);
      }
      return callback({status: "error", message: 'Wrong password'});
    });
}


var User = mongoose.model('User', UserSchema);
module.exports = User;
