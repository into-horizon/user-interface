import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cookie from "react-cookies";
import NewWishlist from "../services/Wishlist";
import { triggerToast } from "./toast";
import { DialogType } from "react-custom-popup";
import { WishlistItemModel } from "../services/Models";

let cookieWishlist = cookie.load("wishlist") || [];

const initialState = {
  message: "",
  items: [...cookieWishlist],
  ids: cookieWishlist.map((product) => product.id) ?? [],
  loading: false,
  params: { limit: 5, offset: 0 },
};
const wishlist = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addProduct(state, action) {
      state.items = state.items.concat(action.payload);
      state.ids = state.ids.concat(action.payload.product_id);
    },
    deleteProduct(state, action) {
      let arr = state.items;
      let newState = arr.filter((item) => item.id !== action.payload.id);
      action.payload.cookie &&
        cookie.save("wishlist", [...newState], { path: "/" });

      return { ...state, items: [...newState] };
    },
    addItems(state, action) {
      return { ...state, items: action.payload };
    },
    addMessage(state, action) {
      return { ...state, message: action.payload };
    },
    resetWishlist(state, action) {
      return { ...state, items: action.payload };
    },
    updateWishlistParams(state, { payload }) {
      state.params = payload;
    },
    resetWishlistParams(state) {
      state.params = initialState.params;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getWishlistItemsIds.fulfilled, (state, { payload }) => {
      state.ids = payload;
    });
    builder.addCase(getItemsHandler.fulfilled, (state, { payload }) => {
      state.loading = false;
    });
    builder.addCase(getItemsHandler.rejected, (state, { payload }) => {
      state.loading = false;
    });
    builder.addCase(getItemsHandler.pending, (state, { payload }) => {
      state.loading = true;
    });
  },
});

export const addItemHandler = (payload) => async (dispatch, state) => {
  const login = state().sign.login;
  try {
    if (login) {
      let { status, message, result } = await NewWishlist.addItem(payload);
      if (status === 200) {
        dispatch(triggerToast({ message, type: DialogType.INFO }));
        dispatch(getWishlistItemsIds());
      } else {
        dispatch(triggerToast({ message, type: DialogType.DANGER }));
      }
    } else {
      cookie.save("wishlist", [...state().wishlist.items, payload], {
        path: "/",
      });
      dispatch(addProduct({...new WishlistItemModel(payload)}));
    }
  } catch (error) {
    dispatch(triggerToast({ message: error.message, type: DialogType.DANGER }));
  }
};

export const getItemsHandler = createAsyncThunk(
  "wishlist/getItems",
  async (_, { dispatch, getState, rejectWithValue }) => {
    const { login } = getState().sign;
    try {
      if (login) {
        const { params } = getState().wishlist;
        const { status, message, result } = await NewWishlist.getItems(params);
        if (status === 200) {
          dispatch(addItems(result));
          const wishlist = cookie.load("wishlist") ?? [];
          if (wishlist.length > 0) {
            wishlist.map(
              (item) =>
                !getState().wishlist.items.find(
                  (i) => i.product_id === item.id
                ) && dispatch(addItemHandler(item))
            );
            cookie.remove("wishlist", { path: "/" });
          }
        } else {
          dispatch(triggerToast({ message, type: DialogType.DANGER }));
        }
      } else {
      }
    } catch (error) {
      dispatch(
        triggerToast({ message: error.message, type: DialogType.DANGER })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const getWishlistItemsIds = createAsyncThunk(
  "wishlist/getIds",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { message, status, data } = await NewWishlist.getItemsIds();
      if (status === 200) {
        return data;
      } else {
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

export const deleteItemHandler = (payload) => async (dispatch, state) => {
  const login = state().sign.login;
  try {
    if (login) {
      let { status, message, result } = await NewWishlist.deleteItem(payload);
      if (status === 200) {
        dispatch(getItemsHandler());
        dispatch(getWishlistItemsIds());
        dispatch(triggerToast({ message, type: DialogType.INFO }));
      } else {
        dispatch(triggerToast({ message, type: DialogType.DANGER }));
      }
    } else {
      dispatch(deleteProduct({ ...payload, cookie: true }));
    }
  } catch (error) {
    dispatch(triggerToast({ message: error.message, type: DialogType.DANGER }));
  }
};

export default wishlist.reducer;

export const {
  addProduct,
  deleteProduct,
  addItems,
  addMessage,
  resetWishlist,
  resetWishlistParams,
  updateWishlistParams,
} = wishlist.actions;
