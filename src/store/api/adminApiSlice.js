import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "../utils/baseQueryWithAuth";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({
        page = 1,
        limit = 10,
        searchTerm = "",
        sortField = "createdAt",
        sortOrder = "desc",
        gender = "",
        maritalStatus = "",
        occupation = "",
        skills = "",
        localChurchName = "",
        roleInLocalChurch = "",
        roleInYadahMinistry = "",
        educationalBackground = "",
        batchInYadahMinistry = "",
      }) => ({
        url: `/admin/users/get-users`,
        method: "GET",
        params: {
          page,
          limit,
          searchTerm,
          sortField,
          sortOrder,
          gender,
          maritalStatus,
          occupation,
          skills,
          localChurchName,
          roleInLocalChurch,
          roleInYadahMinistry,
          educationalBackground,
          batchInYadahMinistry,
        },
      }),
      providesTags: (result) =>
        result?.users
          ? [
              ...result.users.map(({ _id }) => ({ type: "User", id: _id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    getUser: builder.query({
      query: (id) => ({
        url: `/admin/users/get-user`,
        method: "GET",
        params: { id },
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    addUser: builder.mutation({
      query: (newUser) => ({
        url: `/admin/users/add-user`,
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/users/update-user`,
        method: "PUT",
        params: { id },
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/delete-user`,
        method: "DELETE",
        params: { id },
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    getUniqueFilters: builder.query({
      query: () => ({
        url: `/admin/users/unique-filters`,
        method: "GET",
      }),
      providesTags: ["UserFilters"],
    }),

    getDashboardMetrics: builder.query({
      query: () => ({
        url: `/admin/users/get-dashboard-data`,
        method: "GET",
      }),
      providesTags: ["DashboardMetrics"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUniqueFiltersQuery,
  useGetDashboardMetricsQuery,
} = adminApi;
