import mongoose from 'mongoose';
import bCrypt from 'bcryptjs';
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      required: [true, 'Email is required'],
      default: 'Guest',
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 5,
    },
    avatarURL: String,
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
  { versionKey: false, timestamps: true },
);

//add method for pass validation
userSchema.method.validPassword = async function (password) {
  return await bCrypt.compare(password, this.password);
};

const User = mongoose.model('user', userSchema);

export default User;
