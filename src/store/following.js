import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Following from "../services/Following";
import { triggerToast } from "./toast";
import { PopupType } from "react-custom-popup";
import StoreService from "../services/Store";

const follow = createSlice({
  name: "follow",
  initialState: { following: [], store: {}, isLoading: false },
  reducers: {
    addFollowStore(state, action) {
      return { ...state, following: [...state.following, action.payload] };
    },
    removeStoreFollow(state, action) {
      return { ...state, following: action.payload };
    },
    errorMessage(state, action) {
      return { ...state, message: action.payload };
    },
    addFollowingStores(state, action) {
      return { ...state, following: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStore.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getStore.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.store = payload;
    });
    builder.addCase(getStore.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const followStoreHandler = (payload) => async (dispatch, state) => {
  try {
    let { result, message, status } = await Following.followStore(payload);
    if (status === 200) {
      dispatch(addFollowStore(result));
    } else dispatch(triggerToast(message, PopupType.DANGER));
  } catch (error) {
    dispatch(triggerToast({ message: error.message, type: PopupType.DANGER }));
  }
};

export const unFollowStoreHandler = (payload) => async (dispatch, state) => {
  try {
    let { status, result, message } = await Following.unfollowStore(payload);
    if (status === 200) {
      let newState = state().follow.following.filter(
        (f) => f.store_id !== result.store_id
      );
      dispatch(removeStoreFollow(newState));
    } else dispatch(triggerToast(message, PopupType.DANGER));
  } catch (error) {
    dispatch(triggerToast({ message: error.message, type: PopupType.DANGER }));
  }
};

export const getFollowingStores = () => async (dispatch, state) => {
  try {
    let { result, message, status } = await Following.getFollowingStore();
    if (status === 200) {
      dispatch(addFollowingStores(result));
    } else dispatch(triggerToast(message, PopupType.DANGER));
  } catch (error) {
    dispatch(triggerToast({ message: error.message, type: PopupType.DANGER }));
  }
};

export const getStore = createAsyncThunk(
  "store/get",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { data, status, message } = await StoreService.getStore(payload);
      if (status === 200) {
        return data;
      } else {
        dispatch(triggerToast(message, PopupType.DANGER));
        rejectWithValue(message);
      }
    } catch (error) {
      dispatch(
        triggerToast({ message: error.message, type: PopupType.DANGER })
      );
      rejectWithValue(error.message);
    }
  }
);

export default follow.reducer;
export const {
  addFollowStore,
  removeStoreFollow,
  errorMessage,
  addFollowingStores,
} = follow.actions;
