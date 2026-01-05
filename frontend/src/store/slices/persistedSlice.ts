/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  token: string | null;
  email: string | null;
  isVerified: boolean;
  role: string | null;
  useId: string | null;
}

const initialState: UserState = {
  token: null,
  email: null,
  isVerified: false,
  role: null,
  useId: null,
};

const persistedSlice = createSlice({
  name: "persistedSlice",
  initialState,
  reducers: {
    setUserLoginData: (state, action: PayloadAction<any>) => {
      const { email, isVerified, role, token, _id } = action.payload || {};
      state.token = token;
      state.email = email;
      state.isVerified = isVerified;
      state.role = role;
      state.useId = _id;
    },
    setLogout: (state) => {
      state.token = null;
      state.email = null;
      state.isVerified = false;
      state.role = null;
      state.useId = null;
    },
  },
});

export const { setUserLoginData, setLogout } = persistedSlice.actions;
export default persistedSlice.reducer;
