import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "@/store/slices/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If access token expired
  if (result?.error?.status === 401) {
    const refreshToken = api.getState().auth.refreshToken;

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    // Try to refresh access token
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const {
        accessToken,
        refreshToken: newRefreshToken,
        user,
      } = refreshResult.data;

      // Update Redux state
      api.dispatch(
        setCredentials({
          accessToken,
          refreshToken: newRefreshToken || refreshToken,
          user: user || api.getState().auth.user,
        })
      );

      // Retry original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export default baseQueryWithAuth;
