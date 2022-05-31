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
    category: { type: String, required: true },
    name: { type: String },
    cancelled: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

EventSchema.virtual('attendees', {
  ref: 'Attendee',
  localField: '_id',
  foreignField: 'event',
});

EventSchema.virtual('numAttendees', {
  ref: 'Attendee',
  localField: '_id',
  foreignField: 'event',
  get: (attendees) =>
    attendees ? attendees.reduce((prev, curr) => prev + curr.guests + 1, 0) : 0,
});

export default mongoose.model('Event', EventSchema);
