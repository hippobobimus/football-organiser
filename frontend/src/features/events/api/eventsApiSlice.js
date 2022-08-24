import { apiSlice } from '../../api/apiSlice';

const eventsApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    listEvents: build.query({
      query: ({ page = 1, finished = false }) => ({
        url: `/events?page=${page}&finished=${finished}`,
        method: 'GET',
      }),
    }),
    getEvent: build.query({
      query: (eventId) => ({
        url: `/events/${eventId}`,
        method: 'GET',
      }),
    }),
    createEvent: build.mutation({
      query: (eventData) => ({
        url: '/events',
        method: 'POST',
        body: eventData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useListEventsQuery, useGetEventQuery, useCreateEventMutation } =
  eventsApiSlice;
