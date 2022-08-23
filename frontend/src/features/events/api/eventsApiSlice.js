import { apiSlice } from '../../api/apiSlice';

const eventsApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getEvents: build.query({
      query: () => ({
        url: '/events',
        method: 'GET',
      }),
    }),
    getEvent: build.query({
      query: (eventId) => ({
        url: `/events/${eventId}`,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetEventsQuery, useGetEventQuery } = eventsApiSlice;
