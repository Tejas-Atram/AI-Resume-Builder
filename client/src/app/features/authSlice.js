import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    user: null,
    loading: true,
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.loading = false;

      // Store in localStorage as JSON
      const authData = {
        user: action.payload.user,
        token: action.payload.token,
      };
      localStorage.setItem("auth", JSON.stringify(authData));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.loading = false;

      // Clear from localStorage
      localStorage.removeItem("auth");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { login, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
