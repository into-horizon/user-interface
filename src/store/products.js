import ProductService from "../services/Product";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updateOrders } from "./order";
import { triggerToast } from "./toast";
import { DialogType } from "react-custom-popup";
import _ from "lodash";

const initialSearchQuery = {
  limit: 10,
  offset: 0,
};
const initialState = {
  product: {},
  message: "",
  searchedProducts: { data: [], count: 0 },
  storeProducts: { count: 0, data: [] },
  reviews: [],
  loading: false,
  searchQuery: initialSearchQuery,
};

let Product = createSlice({
  name: "product",
  initialState,
  reducers: {
    productAction(state, action) {
      return { ...state, ...action.payload };
    },
    updateSearchQuery(state, { payload }) {
      const array = Object.entries({
        ...state.searchQuery,
        ...payload,
      }).filter(([_key, value]) => !_.isEmpty(value));
      state.searchQuery = Object.fromEntries(array);
    },
    resetSearchQuery(state) {
      state.searchQuery = initialSearchQuery;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(searchProductsHandler.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(searchProductsHandler.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(searchProductsHandler.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.searchedProducts = payload;
    });
  },
});

export const productHandler = (payload) => async (dispatch, state) => {
  let { data, status, message } = await ProductService.getProduct(payload);

  if (status === 200) {
    dispatch(productAction({ product: data }));
  } else {
    dispatch(productAction({ message: message }));
  }
};

export const searchProductsHandler = createAsyncThunk(
  "products/search",
  async (__, { dispatch, rejectWithValue, getState }) => {
    // dispatch(updateSearchQuery({}));
    const { searchQuery } = getState().products;
    try {
      const { message, status, data } = await ProductService.productsSearch(
        searchQuery
      );
      if (status === 200) {
        return data;
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

export const getStoreProductsHandler = (payload) => async (dispatch, state) => {
  try {
    let { status, data } = await ProductService.productsSearch(payload);
    if (status === 200) {
      dispatch(productAction({ storeProducts: data }));
    }
  } catch (error) {
    dispatch(productAction({ message: error.message }));
  }
};

export const addReviewHandler = (payload) => async (dispatch, state) => {
  try {
    let {
      order: {
        orders: { data: orders },
      },
    } = state();
    let { data, status, message } = await ProductService.addProductReview(
      payload
    );
    if (status === 200) {
      let newOrders = orders.map((order) => {
        if (order.id === data.order_id) {
          let newItems = order.items.map((item) => {
            if (item.id === data.id) return { ...item, ...data };
            else return item;
          });

          let newOrder = { ...order };
          newOrder["items"] = newItems;
          return newOrder;
        } else return order;
      });
      dispatch(productAction({ message: "Review submitted successfully" }));
      dispatch(updateOrders(newOrders));
    } else {
      dispatch(productAction({ message: message }));
    }
  } catch (error) {
    dispatch(productAction({ message: error }));
  }
};

export const getProductReviews =
  ({ id, query }) =>
  async (dispatch) => {
    try {
      let { status, data, message } = await ProductService.getProductReviews(
        id,
        query
      );
      if (status === 200) {
        dispatch(productAction({ reviews: data }));
      } else {
        dispatch(productAction({ message: message }));
      }
    } catch (error) {
      dispatch(productAction({ message: error }));
    }
  };

export default Product.reducer;
export const { productAction, updateSearchQuery, resetSearchQuery } =
  Product.actions;
