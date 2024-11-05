import Discount from "../services/Discount";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { triggerToast } from "./toast";
import { PopupType } from "react-custom-popup";

const initialState = {
  message: "",
  discount: {},
  invalid: undefined,
  valid: undefined,
  feedback: "",
  isLoading: false,
};
const discount = createSlice({
  name: "discount",
  initialState,
  reducers: {
    checkCode(state, action) {
      return { ...state, ...action.payload };
    },
    clearDiscount() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkCodeHandler.fulfilled, (state, { payload }) => {
      state.valid = true;
      state.invalid = undefined;
      state.message = payload.message;
      state.discount = payload.result;
      state.isLoading = false;
    });
    builder.addCase(checkCodeHandler.rejected, (state, { payload }) => {
      state.invalid = true;
      state.valid = undefined;
      state.message = payload;
      state.isLoading = false;
    });
    builder.addCase(checkCodeHandler.pending, (state) => {
      state.isLoading = true;
    });
  },
});

export const checkCodeHandler = createAsyncThunk(
  "promoCode/apply",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      let { status, message, result } = await Discount.checkCode(payload);
      if (status === 200) {
        return { message, result };
      } else {
        // dispatch(checkCode({ message: message, status: status }));
        return rejectWithValue(message);
      }
    } catch (error) {
      dispatch(
        triggerToast({ message: error.message, type: PopupType.DANGER })
      );
      return rejectWithValue(error.message);
    }
  }
);

export default discount.reducer;

export const { checkCode, clearDiscount } = discount.actions;
