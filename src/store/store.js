import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";

import { authApi } from "./api/authApiSlice";
import { adminApi } from "./api/adminApiSlice";
import { profileApi } from "./api/profileApiSlice";

import authReducer from "./slices/authSlice";
import { systemAdminApi } from "./api/systemAdminApiSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [systemAdminApi.reducerPath]: systemAdminApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      adminApi.middleware,
      profileApi.middleware,
      systemAdminApi.middleware
    ),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

export default store;
