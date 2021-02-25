import mongoose from 'mongoose';
import bCrypt from 'bcryptjs';
const SALT_FACTOR = 6;
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
      // validate() {
      //   const re = /\S+@\S+\.\S+/;
      //   return re.test(String(value).toLowerCase());
      // },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 5,
    },
    avatarURL: String,
    subscription: {
      type: String,
      enum: ['free', 'pro', 'premium'],
      default: 'free',
    },
    token: { type: String, default: '' },
    owner: { type: mongoose.SchemaTypes.ObjectId, ref: 'user' },
  },
  { versionKey: false, timestamps: true },
);

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();

//   this.password = await bCrypt.hash(
//     this.password,
//     bCrypt.genSaltSync(SALT_FACTOR),
//   );
//   next();
// });

const User = mongoose.model('user', userSchema);

export default User;
