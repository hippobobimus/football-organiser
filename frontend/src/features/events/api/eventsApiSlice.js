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
      providesTags: ['Event'],
    }),
    createEvent: build.mutation({
      query: (eventData) => ({
        url: '/events',
        method: 'POST',
        body: eventData,
      }),
    }),
    updateEvent: build.mutation({
      query: ({ eventId, update }) => ({
        url: `/events/${eventId}`,
        method: 'PATCH',
        body: update,
      }),
      invalidatesTags: ['Event'],
    }),
    deleteEvent: build.mutation({
      query: (eventId) => ({
        url: `/events/${eventId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Event'],
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
    addUserToEvent: build.mutation({
      query: ({ eventId, userId }) => ({
        url: `/events/${eventId}/attendees/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Event'],
    }),
    removeUserFromEvent: build.mutation({
      query: ({ eventId, userId }) => ({
        url: `/events/${eventId}/attendees/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Event'],
    }),
    updateUserEventAttendee: build.mutation({
      query: ({ eventId, userId, update }) => ({
        url: `/events/${eventId}/attendees/${userId}`,
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
  useUpdateEventMutation,
  useDeleteEventMutation,
  useAddAuthUserToEventMutation,
  useRemoveAuthUserFromEventMutation,
  useUpdateAuthUserEventAttendeeMutation,
  useAddUserToEventMutation,
  useRemoveUserFromEventMutation,
  useUpdateUserEventAttendeeMutation,
} = eventsApiSlice;
