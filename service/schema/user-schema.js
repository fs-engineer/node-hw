import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: String,
    avatarURL: String,
    subscription: {
      type: String,
      enum: ['free', 'pro', 'premium'],
      default: 'free',
    },
    token: { type: String, default: '' },
  },
  { versionKey: false, timestamps: true },
);

const User = mongoose.model('user', userSchema);

export default User;
