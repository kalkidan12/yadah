import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "../utils/baseQueryWithAuth";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    // Fetch the logged-in user's profile
    getProfile: builder.query({
      query: () => ({
        url: "/profile/get-profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/profile/update-profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
