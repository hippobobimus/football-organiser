import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { isPast } from 'date-fns';

const { Schema } = mongoose;

const EventSchema = new Schema(
  {
    name: { type: String },
    category: { type: String, required: true },
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
    capacity: { type: Number, default: -1 },
    isCancelled: { type: Boolean, default: false },
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

EventSchema.virtual('isFinished').get((value, virtual, doc) => {
  return isPast(doc.time.end);
});

EventSchema.virtual('isFull').get((value, virtual, doc) => {
  return doc.capacity >= 0 && doc.numAttendees >= doc.capacity;
});

EventSchema.plugin(mongoosePaginate);

export default mongoose.model('Event', EventSchema);
