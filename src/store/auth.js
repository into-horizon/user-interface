import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cookie from "react-cookies";
import AuthService from "../services/Auth";
import { triggerToast } from "./toast";
import { ToastTypes } from "../services/utils";

const sign = createSlice({
  name: "sign",
  initialState: {
    login: false,
    user: {},
    message: "",
    verify: {},
    loading: false,
  },
  reducers: {
    loginAction(state, action) {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteProfilePicture.fulfilled, (state, action) => {
      state.loading = false;
      state.user.profile_picture = action.payload.profile_picture;
    });
    builder.addCase(deleteProfilePicture.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteProfilePicture.pending, (state) => {
      state.loading = true;
    });
  },
});
export const signupHandler = (payload) => async (dispatch, state) => {
  try {
    let data = await AuthService.register(payload);
    if (data.status === 200) {
      dispatch(loginAction({ token: { ...data } }));
    } else if (data.status === 403) {
      dispatch(loginAction({ message: data.message }));
    }
  } catch (error) {
    dispatch(loginAction({ message: error.message }));
  }
};

export const signInHandler = (payload) => async (dispatch, state) => {
  try {
    let { access_token, refresh_token, status, session_id, message } =
      await AuthService.login(payload);
    if (status === 200) {
      cookie.save("access_token", access_token, { path: "/" });
      cookie.save("refresh_token", refresh_token, { path: "/" });
      cookie.save("session_id", session_id, { path: "/" });
      let { user } = await AuthService.getProfile();
      dispatch(loginAction({ login: true, user: user }));
    } else {
      dispatch(loginAction({ message: message }));
    }
  } catch (error) {
    dispatch(loginAction({ message: error.message }));
  }
};
export const logOutHandler = (payload) => async (dispatch, state) => {
  try {
    let data = await AuthService.logout();
    if (data.status === 200) {
      cookie.remove("access_token", { path: "/" });
      cookie.remove("refresh_token", { path: "/" });
      cookie.remove("session_id", { path: "/" });
      dispatch(loginAction({ login: false, message: data.message }));
    } else {
      dispatch(loginAction({ message: data.message }));
    }
  } catch (error) {
    dispatch(loginAction({ message: error.message }));
  }
};
export const endSession = () => async (dispatch, state) => {
  dispatch(loginAction({ login: false, user: {} }));
};
export const verificationHandler = async (dispatch, state) => {
  try {
    let data = await AuthService.verification();
    if (data) {
      dispatch(loginAction({ verify: { ...data } }));
    }
  } catch (error) {
    dispatch(loginAction({ message: error.message }));
  }
};
export const verifyHandler = (payload) => async (dispatch, state) => {
  try {
    let data = await AuthService.verify(payload);
    if (data) {
      dispatch(loginAction({ verify: { ...data } }));
    }
  } catch (error) {
    dispatch(loginAction({ message: error.message }));
  }
};
export const myProfileHandler = () => async (dispatch, state) => {
  try {
    let { user, status, message } = await AuthService.getProfile();
    if (status === 200) {
      dispatch(loginAction({ login: true, user: user }));
    } else {
      dispatch(loginAction({ message: message }));
    }
  } catch (error) {
    dispatch(loginAction({ message: error.message }));
  }
};
export const updateProfileHandler = (payload) => async (dispatch, state) => {
  try {
    let { status, user, message } = await AuthService.updateProfileInfo(
      payload
    );
    if (status === 200) {
      dispatch(loginAction({ user: { ...state().sign.user, ...user } }));
    } else {
      dispatch(loginAction({ message: message }));
    }
  } catch (error) {
    dispatch(loginAction({ message: error.message }));
  }
};
export const updateEmailHandler = (payload) => async (dispatch, state) => {
  try {
    let {
      user: { email, mobile },
      status,
      message,
    } = await AuthService.updateEmail(payload);
    if (status === 200) {
      dispatch(
        loginAction({
          user: { ...state().sign.user, email: email, mobile: mobile },
        })
      );
    } else {
      dispatch(loginAction({ message: message }));
    }
  } catch (error) {
    dispatch(loginAction({ message: error.message }));
  }
};
export const updateMobileHandler = (payload) => async (dispatch, state) => {
  try {
    let data = await AuthService.updateMobile(payload);
    if (data.status === 200) {
      dispatch(
        loginAction({
          user: { ...state().sign.user, mobile: data.profile.mobile },
          message: data.message,
        })
      );
    } else if (data.status === 403) {
      dispatch(loginAction({ message: data.message }));
    } else {
      dispatch(loginAction({ message: data }));
    }
  } catch (error) {
    dispatch(loginAction({ message: error.message }));
  }
};
export const updatePictureHandler = (payload) => async (dispatch, state) => {
  try {
    let { user, status, message } = await AuthService.updatePicture(payload);
    if (status === 200) {
      dispatch(loginAction({ user: user }));
    } else {
      dispatch(loginAction({ message: message }));
    }
  } catch (error) {
    dispatch(loginAction({ message: error.message }));
  }
};

export const deleteProfilePicture = createAsyncThunk(
  "profile/picture/delete",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { message, status, data } = await AuthService.removePicture(
        payload
      );
      console.log("🚀 ~ file: auth.js:185 ~ data:", data);
      if (status === 200) {
        dispatch(triggerToast({ message, type: ToastTypes.INFO }));
        return data;
      } else {
        dispatch(triggerToast({ message, type: ToastTypes.DANGER }));
        rejectWithValue(message);
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
export const deactivateProfileHandler = () => async (dispatch, state) => {
  try {
    let data = await AuthService.deactivate();
    if (data.status === 403) {
      dispatch(loginAction({ message: data.message }));
    } else {
      dispatch(loginAction({ message: data.message }));
    }
  } catch (error) {
    dispatch(loginAction({ message: error.message }));
  }
};

export const changePasswordHandler = (payload) => async (dispatch, state) => {
  try {
    let { status, message } = await AuthService.changePassword(payload);
    if (status === 200) {
      dispatch(loginAction({ message: message, status: status }));
      return { message: message, status: status };
    } else {
      dispatch(loginAction({ message: message, status: status }));
      return { message: message, status: status };
    }
  } catch (error) {}
};

export default sign.reducer;
export const { loginAction, deleteMessage } = sign.actions;
