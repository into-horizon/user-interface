import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cookie from "react-cookies";
import Cart from "../services/Cart";
import { triggerToast } from "./toast";
import { ToastTypes } from "../services/utils";

let cookieCard = () => cookie.load("cart") ?? [];
const initialState = { loading: false, data: cookieCard() };
const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      state.data = state.data.concat(action.payload);
      if (action.payload.cookie) {
        cookie.save("cart", state.data);
      }
    },
    decrementQuantity(state, action) {
      state.data = state.data.map((value) => {
        if (value.id === action.payload.id) {
          return { ...value, quantity: value.quantity - 1 };
        }
        return value;
      });
      if (action.payload.cookie) cookie.save("cart", state.data);
    },
    incrementQuantity(state, action) {
      state.data = state.data.map((value) => {
        if (value.id === action.payload.id) {
          return { ...value, quantity: value.quantity + 1 };
        }
        return value;
      });
      if (action.payload.cookie) cookie.save("cart", state.data);
    },

    deleteItem(state, action) {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
      if (action.payload.cookie) {
        cookie.save("cart", state.data);
      }
    },
    updateCartItem(state, action) {
      state.data = state.data.map((value) => {
        if (value.id === action.payload.id) {
          return action.payload;
        }
        return value;
      });
      if (action.payload.cookie) {
        cookie.save("cart", state.data);
      }
    },
    addCartItems(state, action) {
      state.data = action.payload;
    },
    resetCartItems() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCartItemsHandler.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(getCartItemsHandler.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCartItemsHandler.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const addCartItemHandler = (payload) => async (dispatch, state) => {
  const { login } = state().sign;
  try {
    if (login) {
      let { data, status, message } = await Cart.addCartItem([payload]);

      if (status === 200) {
        dispatch(
          addItem({
            ...payload,
            ...data[0],
          })
        );
      } else {
        dispatch(triggerToast({ message, type: ToastTypes.DANGER }));
      }
    } else {
      dispatch(addItem({ ...payload, cookie: true }));
    }
    // dispatch(
    //   triggerToast({ message: "added to your card", type: ToastTypes.SUCCESS })
    // );
  } catch (error) {
    dispatch(triggerToast({ message: error.message, type: ToastTypes.DANGER }));
  }
};

export const updateCartItemHandler = (payload) => async (dispatch, state) => {
  const { login } = state().sign;
  dispatch(updateCartItem({ ...payload, cookie: !login }));
  try {
    if (login) {
      let { status, message, _data } = await Cart.updateCartItem(payload);
      if (status === 200) {
        return;
      } else {
        dispatch(triggerToast({ message, type: ToastTypes.DANGER }));
      }
    }
  } catch (error) {
    dispatch(triggerToast({ message: error.message, type: ToastTypes.DANGER }));
  }
};

export const deleteCartItemHandler = (payload) => async (dispatch, state) => {
  const { login } = state().sign;
  dispatch(deleteItem({ ...payload, cookie: !login }));
  try {
    if (login) {
      let { status, _data, message } = await Cart.removeCartItem(payload);
      if (status === 200) {
        return;
      } else {
        dispatch(triggerToast({ message, type: ToastTypes.DANGER }));
      }
    }
  } catch (error) {
    dispatch(triggerToast({ message: error.message, type: ToastTypes.DANGER }));
  }
};

export const getCartItemsHandler = createAsyncThunk(
  "cart/getItems",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const cart = cookie.load("cart");
      cookie.save("cart", [], { path: "/" });
      let { data, status, message } = await Cart.getCartItems();
      if (status === 200) {
        if (cart.length > 0) {
          const newCart = cart.filter(
            ({ size, color, product_id }) =>
              data.findIndex(
                (item) =>
                  item.product_id === product_id &&
                  item.size === size &&
                  item.color === color
              ) === -1
          );
          if (!!newCart.length) {
            await Cart.addCartItem(newCart);
            const {
              data: _data,
              status: _status,
              message: _message,
            } = await Cart.getCartItems();
            if (_status === 200) {
              dispatch(addCartItems(_data));
            } else {
              dispatch(triggerToast({ _message, type: ToastTypes.DANGER }));
              return rejectWithValue(_message);
            }
          } else {
            dispatch(addCartItems(data));
          }
        } else {
          dispatch(addCartItems(data));
        }
      } else {
        dispatch(triggerToast({ message, type: ToastTypes.DANGER }));
        return rejectWithValue(message);
      }
    } catch (error) {
      dispatch(
        triggerToast({ message: error.message, type: ToastTypes.DANGER })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartHandler = (payload) => async (dispatch, state) => {
  try {
    let { status } = await Cart.updateCart(payload);
    return status;
  } catch (error) {
    return error.message;
  }
};

export default cart.reducer;

export const {
  addItem,
  decrementQuantity,
  incrementQuantity,
  deleteItem,
  updateCartItem,
  addCartItems,
  resetCartItems,
} = cart.actions;
