import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 30,
      required: true,
    },
    email: {
      type: String,
      minlength: 5,
      maxlength: 30,
      required: true,
    },
    phone: {
      type: String,
      minlength: 10,
      maxlength: 13,
      require: true,
    },
    subscription: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      minlength: 3,
      maxlength: 50,
      require: true,
    },
    token: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true },
);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
