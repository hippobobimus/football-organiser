import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

const EventSchema = new Schema(
  {
    time: {
      buildUp: { type: Date, required: true },
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    },
    location: {
      name: { type: String },
      line1: { type: String, required: true },
      line2: { type: String },
      town: { type: String, required: true },
      postcode: { type: String, required: true },
    },
    category: { type: String, required: true },
    name: { type: String },
    // TODO locked state
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

EventSchema.plugin(mongoosePaginate);

export default mongoose.model('Event', EventSchema);
