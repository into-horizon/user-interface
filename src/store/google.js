import { createSlice } from "@reduxjs/toolkit";
import { triggerToast } from "./toast";
import { PopupType } from "react-custom-popup";
import AuthService from "../services/Auth";

let signInWithGoogle = createSlice({
  name: "signInWithGoogle",
  initialState: {},
  reducers: {
    addUserWithGoogle(state, action) {
      return action.payload;
    },
    resetGoogleUser() {
      return {};
    },
  },
});

export const signInHandlerWithGoogle = (payload) => async (dispatch, state) => {
  try {
    const { message, user, status } = await AuthService.signupWithGoogle(
      payload
    );
    if (status === 200) {
      dispatch(addUserWithGoogle(user));
    } else {
      dispatch(triggerToast({ type: PopupType.DANGER, message }));
    }
  } catch (error) {
    dispatch(triggerToast({ type: PopupType.DANGER, message: error.message }));
  }
};

export default signInWithGoogle.reducer;
export const { addUserWithGoogle,resetGoogleUser } = signInWithGoogle.actions;
