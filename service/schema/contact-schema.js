import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import mongoosePaginate from 'mongoose-paginate-v2';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 30,
      required: [true, 'name required'],
    },
    email: {
      type: String,
      minlength: 5,
      maxlength: 30,
      required: [true, 'email required'],
    },
    phone: {
      type: String,
      minlength: 10,
      maxlength: 13,
      required: [true, 'phone required'],
    },
    subscription: {
      type: String,
      default: 'free',
    },
    password: {
      type: String,
      minlength: 5,
      maxlength: 50,
      default: 'password',
    },

    owner: { type: mongoose.SchemaTypes.ObjectId, ref: 'user' },
  },
  { versionKey: false, timestamps: true },
);
contactSchema.plugin(mongoosePaginate);

const Contact = mongoose.model('contact', contactSchema);

export default Contact;
