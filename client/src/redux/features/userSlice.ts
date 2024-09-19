import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserProfileData } from "../../types/types";
import api from "../../utils/api";

export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (name, thunkAPI) => {
    try {
      const response = await api.get("/auth/profile");

      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(
        "Something went wrong please try again later."
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: undefined as undefined | UserProfileData,
    loading: "idle",
    error: undefined as any,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.userData = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      });
  },
});

export const { setUserData } = userSlice.actions;

export default userSlice.reducer;
