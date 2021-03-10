import mongoose from 'mongoose';
import bCrypt from 'bcryptjs';
import gravatar from 'gravatar';
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      default: 'Guest',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate(value) {
        const email = /\S+@\S+\.\S+/;
        return email.test(String(value).toLowerCase());
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 5,
    },
    avatarURL: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: '250' }, true);
      },
    },
    subscription: {
      type: String,
      enum: {
        values: ['free', 'pro', 'premium'],
        message: 'Wrong subscription',
      },
      default: 'free',
    },
    token: { type: String, default: null },
  },
  { versionKey: true, timestamps: true },
);

//add method for pass validation
userSchema.method.validPassword = async function (password) {
  return await bCrypt.compare(password, this.password);
};

const User = mongoose.model('user', userSchema);

export default User;
