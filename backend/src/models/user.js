import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true, maxlength: 100 },
    lastName: { type: String, required: true, maxlength: 100 },
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
