import mongoose from 'mongoose';
const { Schema } = mongoose;

const EventSchema = new Schema(
  {
    start: { type: Date, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.model('Event', EventSchema);
