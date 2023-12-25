import Order from "../services/Order";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { triggerToast } from "./toast";
import { ToastTypes } from "../services/utils";
import { DialogType } from "react-custom-popup";

const order = createSlice({
  name: "order",
  initialState: {
    message: "",
    placedOrder: {},
    orders: { count: 0, data: [] },
    logs: [],
    loading: false,
  },
  reducers: {
    addPlacedOrder(state, action) {
      return { ...state, ...action.payload };
    },

    addMessage(state, action) {
      return { ...state, message: action.payload };
    },
    clearPlacedOrder(state, action) {
      return { ...state, placedOrder: action.payload };
    },
    addOrders(state, action) {
      return { ...state, orders: action.payload };
    },
    addOrderLogs(state, action) {
      return { ...state, logs: action.payload };
    },

    updateOrders(state, action) {
      return { ...state, orders: { ...state.orders, data: action.payload } };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOrderHandler.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(getOrderHandler.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(getOrderHandler.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(placedOrderHandler.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(placedOrderHandler.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(placedOrderHandler.pending, (state) => {
      state.loading = true;
    });
  },
});

export const placedOrderHandler = createAsyncThunk(
  "order/placeOrder",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      let { data, status, message } = await Order.placeOrder(payload);
      if (status === 200) {
        dispatch(addPlacedOrder({ placedOrder: data }));
      } else {
        dispatch(triggerToast({ message, type: DialogType.DANGER }));
        return rejectWithValue(message);
      }
    } catch (error) {
      dispatch(
        triggerToast({ message: error.message, type: DialogType.DANGER })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const getOrderHandler = createAsyncThunk(
  "order/get",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      let result = await Order.getOrders(payload);
      dispatch(addOrders(result));
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

export const getOrderLogs = (payload) => async (dispatch, state) => {
  try {
    let { result, status } = await Order.orderLogs(payload);
    status === 200 && dispatch(addOrderLogs(result));
  } catch (error) {
    dispatch(addMessage(error));
  }
};

export default order.reducer;

export const {
  addPlacedOrder,
  addMessage,
  clearPlacedOrder,
  addOrders,
  addOrderLogs,
  updateOrders,
} = order.actions;
