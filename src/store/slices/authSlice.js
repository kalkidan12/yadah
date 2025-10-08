import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "@/store/api/authApiSlice";

// ===== Storage Helpers =====
const storeUserToLocalStorage = (user) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

const removeUserFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
};

const storeTokens = (accessToken, refreshToken) => {
  if (typeof window !== "undefined") {
    if (accessToken) sessionStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  }
};

const removeTokens = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};

// ===== Initial State =====
const getInitialState = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    const accessToken = sessionStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    return {
      user: user ? JSON.parse(user) : null,
      accessToken: accessToken || null,
      refreshToken: refreshToken || null,
    };
  }

  return { user: null, accessToken: null, refreshToken: null };
};

const initialState = getInitialState();

// ===== Slice =====
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      removeUserFromLocalStorage();
      removeTokens();
    },
    setCredentials: (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken || state.refreshToken;
      state.user = user;
      storeUserToLocalStorage(user);
      storeTokens(accessToken, refreshToken);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken;
        state.user = payload.user;
        storeUserToLocalStorage(payload.user);
        storeTokens(payload.accessToken, payload.refreshToken);
      }
    );
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
