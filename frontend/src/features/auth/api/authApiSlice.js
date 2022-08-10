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
    register: build.mutation({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useGetAuthUserQuery, useRegisterMutation } =
  authApiSlice;
