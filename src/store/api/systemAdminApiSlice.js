import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "../utils/baseQueryWithAuth";

export const systemAdminApi = createApi({
  reducerPath: "systemAdminApi",
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
        role = "",
      }) => ({
        url: `/admin/system/get-users`,
        method: "GET",
        params: { page, limit, searchTerm, sortField, sortOrder, role },
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
        url: `/admin/system/get-user`,
        method: "GET",
        params: { id },
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    addUser: builder.mutation({
      query: (newUser) => ({
        url: `/admin/system/add-user`,
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/system/update-user`,
        method: "PUT",
        params: { id },
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/system/delete-user`,
        method: "DELETE",
        params: { id },
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = systemAdminApi;
