import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: String,
    password: String,
    subscription: {
      type: String,
      enum: ['free', 'pro', 'premium'],
      default: 'free',
    },
    token: String,
  },
  { versionKey: false, timestamps: true },
);

const Contact = mongoose.model('Contact', userSchema);

export default Contact;
