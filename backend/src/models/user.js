import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: { type: String, maxlength: 100, required: true },
    lastName: { type: String, maxlength: 100, required: true },
    email: { type: String, maxlength: 100, required: true, unique: true },
    password: {
      hash: { type: String, required: true },
      salt: { type: String, required: true },
    },
    role: { type: String, required: true, default: 'user' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual('name').get((value, virtual, doc) => {
  let fullName = '';

  if (doc.firstName && doc.lastName) {
    fullName = doc.firstName + ' ' + doc.lastName;
  }

  return fullName;
});

export default mongoose.model('User', UserSchema);
