import { apiSlice } from '../../api/apiSlice';

const authApiSlice = apiSlice.injectEndpoints({
  tagTypes: ['AuthUser'],
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: build.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    register: build.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    getAuthUser: build.query({
      query: () => ({
        url: '/auth/user',
        method: 'GET',
      }),
      providesTags: ['AuthUser'],
    }),
    updateAuthUser: build.mutation({
      query: (updates) => ({
        url: '/auth/user',
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['AuthUser'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetAuthUserQuery,
  useUpdateAuthUserMutation,
} = authApiSlice;
