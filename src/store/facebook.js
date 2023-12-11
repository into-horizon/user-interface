import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthService from "../services/Auth";
import { triggerToast } from "./toast";
import { DialogType } from "react-custom-popup";

const initialState = { loading: false, user: {} };
let signInWithFacebook = createSlice({
  name: "signInWithFacebook",
  initialState,
  reducers: {
    addUserWithFacebook(_, action) {
      return action.payload;
    },
    resetFacebookState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      signInHandlerWithFacebook.fulfilled,
      (state, { payload }) => {
        state.user = payload;
        state.loading = false;
      }
    );
    builder.addCase(signInHandlerWithFacebook.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(signInHandlerWithFacebook.pending, (state) => {
      state.loading = true;
    });
  },
});

export const signInHandlerWithFacebook = createAsyncThunk(
  "facebook",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { status, message, user } = await AuthService.signupWithFacebook(
        payload
      );
      if (status === 200) {
        return user;
      } else {
        dispatch(triggerToast({ type: DialogType.DANGER, message }));
        return rejectWithValue(message);
      }
    } catch (error) {
      dispatch(
        triggerToast({ type: DialogType.DANGER, message: error.message })
      );
      return rejectWithValue(error.message);
    }
  }
);

export default signInWithFacebook.reducer;
export const { addUserWithFacebook,resetFacebookState } = signInWithFacebook.actions;
