import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import LandingPage from "../services/LandingPage";
import { triggerToast } from "./toast";
import { ToastTypes } from "../services/utils";

const initialState = {
  isLoading: false,
  topStores: [],
};

const landingPage = createSlice({
  name: "Landing",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTopStores.fulfilled, (state, action) => {
      state.topStores = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getTopStores.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getTopStores.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const getTopStores = createAsyncThunk(
  "stores/get",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { ratedStores } = await LandingPage.getTopStores();
      return ratedStores;
    } catch (error) {
      if (error instanceof Error) {
        rejectWithValue(error.message);
        dispatch(
          triggerToast({ message: error.message, type: ToastTypes.DANGER })
        );
      }
    }
  }
);
export const selectStores = (state) => state.landingPage.topStores;
export default landingPage.reducer;
