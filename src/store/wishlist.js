import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import cookie from 'react-cookies';
import NewWishlist from '../services/Wishlist';
import { triggerToast } from './toast';
import { PopupType } from 'react-custom-popup';

let cookieWishlist = () => cookie.load('wishlist') || [];
const cookieWishlistIds = () => cookie.load('wishlist-ids') || [];

const initialState = {
  message: '',
  items: [...cookieWishlist()],
  ids: cookieWishlistIds(),
  loading: false,
  params: { limit: 5, offset: 0 },
};
const wishlist = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addProduct(state, action) {
      state.items = state.items.concat(action.payload);
      state.ids = state.ids.concat(action.payload.product_id);
      if (action.payload.cookie) {
        cookie.save('wishlist', state.items, { path: '/' });
        cookie.save('wishlist-ids', state.ids, { path: '/' });
      }
    },
    deleteProduct(state, action) {
      const { product_id } = action.payload;
      state.items = state.items.filter(
        (item) => item.product_id !== product_id
      );
      state.ids = state.ids.filter((id) => id !== product_id);
      if (action.payload.cookie) {
        cookie.save('wishlist', state.items, { path: '/' });
        cookie.save('wishlist-ids', state.ids, { path: '/' });
      }
      // state.items = [...newState];
    },
    addItems(state, action) {
      return { ...state, items: action.payload };
    },
    addMessage(state, action) {
      return { ...state, message: action.payload };
    },
    resetWishlist() {
      return initialState;
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
    payload.cookie = !login;
    dispatch(addProduct(payload));
    if (login) {
      let { status, message } = await NewWishlist.addItem({
        product_id: [payload.product_id],
      });
      if (status === 200) {
        // dispatch(triggerToast({ message, type: PopupType.INFO }));
        // dispatch(getWishlistItemsIds());
        return;
      } else {
        dispatch(triggerToast({ message, type: PopupType.DANGER }));
      }
    }
  } catch (error) {
    dispatch(triggerToast({ message: error.message, type: PopupType.DANGER }));
  }
};

export const getItemsHandler = createAsyncThunk(
  'wishlist/getItems',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const { login } = getState().sign;
    const { ids } = getState().wishlist;
    try {
      if (login) {
        const wishlistIds = cookie.load('wishlist-ids') ?? [];
        if (wishlistIds.filter((id) => !ids.includes(id)).length > 0) {
          await NewWishlist.addItem({
            product_id: wishlistIds.filter((id) => !ids.includes(id)),
          });
          cookie.save('wishlist', [], { path: '/' });
          cookie.save('wishlist-ids', [], { path: '/' });
        }
        const { params } = getState().wishlist;
        const { status, message, result } = await NewWishlist.getItems(params);
        if (status === 200) {
          dispatch(addItems(result));
        } else {
          dispatch(triggerToast({ message, type: PopupType.DANGER }));
        }
      } else {
      }
    } catch (error) {
      dispatch(
        triggerToast({ message: error.message, type: PopupType.DANGER })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const getWishlistItemsIds = createAsyncThunk(
  'wishlist/getIds',
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
        triggerToast({ message: error.message, type: PopupType.DANGER })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const deleteItemHandler = (payload) => async (dispatch, state) => {
  const login = state().sign.login;
  try {
    dispatch(deleteProduct({ ...payload, cookie: !login }));
    if (login) {
      let { status, message } = await NewWishlist.deleteItem(payload);
      if (status === 200) {
        // dispatch(getItemsHandler());
        dispatch(getWishlistItemsIds());
        // dispatch(triggerToast({ message, type: PopupType.INFO }));
      } else {
        dispatch(triggerToast({ message, type: PopupType.DANGER }));
      }
    }
  } catch (error) {
    dispatch(triggerToast({ message: error.message, type: PopupType.DANGER }));
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
