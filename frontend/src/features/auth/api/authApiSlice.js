import { apiSlice } from '../../api/apiSlice';

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getAuthUser: build.query({
      query: () => ({
        url: '/users/me',
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useGetAuthUserQuery } = authApiSlice;
