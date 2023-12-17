import { createSlice } from "@reduxjs/toolkit";
import cookie from "react-cookies";
import Cart from "../services/Cart";
import { triggerToast } from "./toast";
import { ToastTypes } from "../services/utils";

let cookieCard = () => cookie.load("cart") ?? [];
const cart = createSlice({
  name: "cart",
  initialState: cookieCard(),
  reducers: {
    addItem(state, action) {
      action.payload.cookie &&
        cookie.save("cart", [...state, { ...action.payload }]);
      return [...state, { ...action.payload }];
    },
    decrementQuantity(state, action) {
      let newState = state.map((value) => {
        if (value.id === action.payload.id) {
          return { ...value, quantity: value.quantity - 1 };
        }
        return value;
      });
      cookie.save("cart", [...newState]);
      return [...newState];
    },
    incrementQuantity(state, action) {
      let newState = state.map((value) => {
        if (value.id === action.payload.id) {
          return { ...value, quantity: value.quantity + 1 };
        }
        return value;
      });
      action.payload.cookie && cookie.save("cart", [...newState]);
      return [...newState];
    },

    deleteItem(state, action) {
      let newState = state.filter((item) => item.id !== action.payload.id);
      action.payload.cookie && cookie.save("cart", [...newState]);
      return [...newState];
    },
    updateCartItem(state, action) {
      let newState = state.map((value) => {
        if (value.id === action.payload.id) {
          return action.payload;
        }
        return value;
      });
      action.payload.cookie && cookie.save("cart", [...newState]);
      return [...newState];
    },
    addCartItems(state, action) {
      return action.payload;
    },
    resetCartItems(state, action) {
      return action.payload;
    },
  },
});

export const addCartItemHandler = (payload) => async (dispatch, state) => {
  const { login } = state().sign;
  try {
    if (login) {
      let { data, status, message } = await Cart.addCartItem(payload);

      if (status === 200) {
        dispatch(
          addItem({
            ...payload,
            ...data,
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
  try {
    if (login) {
      let { status, message, data } = await Cart.updateCartItem(payload);
      if (status === 200) {
        dispatch(updateCartItem({ ...payload, ...data }));
      } else {
        console.error(message);
      }
    } else {
      dispatch(updateCartItem({ ...payload, cookie: true }));
    }
  } catch (error) {
    dispatch(triggerToast({ message: error.message, type: ToastTypes.DANGER }));
  }
};

export const deleteCartItemHandler = (payload) => async (dispatch, state) => {
  const login = state().sign.login;
  try {
    if (login) {
      let { status, data, message } = await Cart.removeCartItem(payload);
      if (status === 200) {
        dispatch(deleteItem(data));
      } else {
        console.error(message);
      }
    } else {
      dispatch(deleteItem({ ...payload, cookie: true }));
    }
  } catch (error) {
    dispatch(triggerToast({ message: error.message, type: ToastTypes.DANGER }));
  }
};

export const getCartItemsHandler = () => async (dispatch, state) => {
  try {
    let { data, status, message } = await Cart.getCartItems();
    if (status === 200) {
      dispatch(addCartItems(data));
    } else {
      console.error(message);
    }
    const cart =
      cookie.load("cart", { path: "/" }) &&
      JSON.parse(cookie.load("cart", { path: "/" }));
    if (cart && cart?.length !== 0) {
      await cart.map(
        (item) =>
          !state().cart.find((i) => i.product_id === item.id) &&
          dispatch(addCartItemHandler(item))
      );
      cookie.remove("cart", { path: "/" });
    }
  } catch (error) {
    dispatch(triggerToast({ message: error.message, type: ToastTypes.DANGER }));
  }
};

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
