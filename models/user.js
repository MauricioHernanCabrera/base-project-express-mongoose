const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    isAdmin: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default: false
    },

    resetPasswordToken: { type: String, default: '' },

    resetPasswordExpires: { type: Date, default: Date.now() }
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Users', UserSchema);
