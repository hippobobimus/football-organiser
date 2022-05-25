import mongoose from 'mongoose';
const { Schema } = mongoose;

const EventSchema = new Schema(
  {
    time: {
      buildUp: { type: Date, required: true },
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    },
    // TODO location: { type: Schema.Types.ObjectId, ref: 'Location' },
    // TODO locked state
    // TODO category - match, social, etc.
    cancelled: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.model('Event', EventSchema);
