import { apiSlice } from '../../api/apiSlice';

const eventsApiSlice = apiSlice.injectEndpoints({
  providesTags: ['Event'],
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
      providesTags: ['Event'],
    }),
    createEvent: build.mutation({
      query: (eventData) => ({
        url: '/events',
        method: 'POST',
        body: eventData,
      }),
    }),
    addAuthUserToEvent: build.mutation({
      query: (eventId) => ({
        url: `/events/${eventId}/attendees/me`,
        method: 'POST',
      }),
      invalidatesTags: ['Event'],
    }),
    removeAuthUserFromEvent: build.mutation({
      query: (eventId) => ({
        url: `/events/${eventId}/attendees/me`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Event'],
    }),
    updateAuthUserEventAttendee: build.mutation({
      query: ({ eventId, update }) => ({
        url: `/events/${eventId}/attendees/me`,
        method: 'PATCH',
        body: update,
      }),
      invalidatesTags: ['Event'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useAddAuthUserToEventMutation,
  useRemoveAuthUserFromEventMutation,
  useUpdateAuthUserEventAttendeeMutation,
} = eventsApiSlice;
