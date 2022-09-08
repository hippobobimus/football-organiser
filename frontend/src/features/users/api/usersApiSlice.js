import { apiSlice } from '../../api/apiSlice';

const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery } = usersApiSlice;
