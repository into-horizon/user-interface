import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import categoryService from "../services/CategoryService";
import { triggerToast } from "./toast";
import { DialogType } from "react-custom-popup";

const category = createSlice({
  name: "category",
  initialState: { data: [], isLoading: false },
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(getAllCategories.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getAllCategories.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllCategories.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const getAllCategories = createAsyncThunk(
  "category/getAll",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { data, status, message } =
        await categoryService.getAllCategories();
      if (status === 200) {
        return data;
      }
      dispatch(triggerToast({ message, type: DialogType.DANGER }));
      return rejectWithValue(message);
    } catch (error) {
      dispatch(
        triggerToast({ message: error.message, type: DialogType.DANGER })
      );
      return rejectWithValue(error.message);
    }
  }
);
export default category.reducer;
