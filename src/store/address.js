import AuthService from "../services/Auth";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cookie from "react-cookies";
import { triggerToast } from "./toast";
import { ToastTypes } from "../services/utils";

let Address = createSlice({
  name: "address",
  initialState: { data: [], count: 0, loading: false },
  reducers: {
    addressAction(_, action) {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(myAddressHandler.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(myAddressHandler.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(myAddressHandler.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addAddressHandler.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(addAddressHandler.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(addAddressHandler.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeAddressHandler.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(removeAddressHandler.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(removeAddressHandler.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateAddressHandler.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updateAddressHandler.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(updateAddressHandler.pending, (state) => {
      state.loading = true;
    });
  },
});

export const addAddressHandler = createAsyncThunk(
  "address/create",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      let { status, message } = await AuthService.insertAddress(payload);
      if (status === 200) {
        dispatch(triggerToast({ message: message, type: ToastTypes.INFO }));
      } else {
        dispatch(triggerToast({ message: message, type: ToastTypes.DANGER }));
        rejectWithValue(message);
      }
    } catch (error) {
      rejectWithValue(error.message);
      dispatch(
        triggerToast({ message: error.message, type: ToastTypes.DANGER })
      );
    }
  }
);

export const removeAddressHandler = createAsyncThunk(
  "address/delete",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      let { status, message } = await AuthService.removeAddress(payload);
      if (status === 200) {
        dispatch(triggerToast({ message, type: ToastTypes.INFO }));
      } else {
        rejectWithValue(message);
        dispatch(triggerToast({ message, type: ToastTypes.DANGER }));
      }
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

export const updateAddressHandler = createAsyncThunk(
  "address/update",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { status, message } = await AuthService.updateAddress(payload);
      if (status === 200) {
        dispatch(triggerToast({ message, type: ToastTypes.INFO }));
      } else {
        dispatch(triggerToast({ message, type: ToastTypes.DANGER }));
        rejectWithValue(message);
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          triggerToast({ message: error.message, type: ToastTypes.DANGER })
        );
        rejectWithValue(error.message);
      }
    }
  }
);
export const myAddressHandler = createAsyncThunk(
  "address/get",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      let { data, count, status, message } = await AuthService.getAddress(
        payload
      );
      if (status === 200) {
        dispatch(addressAction({ data, count }));
      } else {
        rejectWithValue(message);
        dispatch(
          triggerToast({
            message,
            type: ToastTypes.DANGER,
          })
        );
      }
    } catch (error) {
      rejectWithValue(error.message);
      dispatch(
        triggerToast({
          message: error.message,
          type: ToastTypes.DANGER,
        })
      );
    }
  }
);

export default Address.reducer;
export const { addressAction } = Address.actions;
