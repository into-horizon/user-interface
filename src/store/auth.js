import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cookie from "react-cookies";
import AuthService from "../services/Auth";
import { triggerToast } from "./toast";
import { ToastTypes } from "../services/utils";
import { showDialog } from "./dialog";
import { DialogType } from "react-custom-popup";
import { resetCartItems } from "./cart";
import { resetWishlist } from "./wishlist";
import { resetGoogleUser } from "./google";
import { resetFacebookState } from "./facebook";

const initialState = {
  login: false,
  user: {},
  message: "",
  verificationCodeRequested: false,
  loading: false,
  globalLoading: true,
  resetPassword: {
    isReferenceInvalid: false,
    feedback: "",
    isResetTokenInvalid: false,
    success: false,
  },
};
const sign = createSlice({
  name: "sign",
  initialState,
  reducers: {
    loginAction(state, action) {
      return { ...state, ...action.payload };
    },
    stopLoading(state) {
      state.globalLoading = false;
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
    builder.addCase(signInHandler.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(signInHandler.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(signInHandler.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signupHandler.fulfilled, (state, action) => {
      state.loading = false;
      state.login = true;
      state.user = action.payload;
    });
    builder.addCase(signupHandler.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(signupHandler.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logOutHandler.fulfilled, (state) => {
      return initialState;
    });
    builder.addCase(logOutHandler.rejected, (state) => {
      return initialState;
    });
    builder.addCase(logOutHandler.pending, (state) => {
      state.globalLoading = true;
    });
    builder.addCase(myProfileHandler.fulfilled, (state) => {
      state.globalLoading = false;
    });
    builder.addCase(myProfileHandler.rejected, (state) => {
      state.globalLoading = false;
    });
    builder.addCase(myProfileHandler.pending, (state) => {
      state.globalLoading = true;
    });
    builder.addCase(validateResetToken.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(validateResetToken.rejected, (state, action) => {
      state.loading = false;
      state.resetPassword.isResetTokenInvalid = true;
      state.resetPassword.feedback = action.payload;
    });
    builder.addCase(validateResetToken.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(checkVerificationCode.fulfilled, (state) => {
      state.loading = false;
      state.user.verified = true;
    });
    builder.addCase(requestVerificationCode.fulfilled, (state) => {
      state.verificationCodeRequested = true;
    });
    builder.addCase(checkVerificationCode.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(checkVerificationCode.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(provideResetPasswordReference.rejected, (state, action) => {
      state.resetPassword.isReferenceInvalid = true;
      state.resetPassword.feedback = action.payload;
      state.loading = false;
    });
    builder.addCase(provideResetPasswordReference.fulfilled, (state) => {
      state.resetPassword.isReferenceInvalid = false;
      state.resetPassword.feedback = "";
      state.loading = false;
    });
    builder.addCase(provideResetPasswordReference.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.loading = false;
      state.resetPassword.success = true;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.resetPassword.feedback = action.payload;
    });
    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
    });
  },
});
export const signupHandler = createAsyncThunk(
  "auth/sign-up",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      let { status, message, access_token, refresh_token, session_id, user } =
        await AuthService.register(payload);
      if (status === 200) {
        cookie.save("access_token", access_token, { path: "/" });
        cookie.save("refresh_token", refresh_token, { path: "/" });
        cookie.save("session_id", session_id, { path: "/" });
        dispatch(resetGoogleUser());
        dispatch(resetFacebookState());
        return user;
      } else if (status === 403) {
        dispatch(
          showDialog({
            title: "something went wrong",
            message: message,
            type: DialogType.DANGER,
          })
        );
        return rejectWithValue(message);
      }
      return;
    } catch (error) {
      dispatch(
        showDialog({
          title: "something went wrong",
          message: error.message,
          type: DialogType.DANGER,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const signInHandler = createAsyncThunk(
  "auth/login",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      let { access_token, refresh_token, status, session_id, message, user } =
        await AuthService.login(payload);
      if (status === 200) {
        cookie.save("access_token", access_token, { path: "/" });
        cookie.save("refresh_token", refresh_token, { path: "/" });
        cookie.save("session_id", session_id, { path: "/" });
        dispatch(loginAction({ login: true, user }));
      } else {
        dispatch(
          showDialog({
            message,
            type: DialogType.DANGER,
            title: "something went wrong",
          })
        );
        return rejectWithValue(message);
      }
    } catch (error) {
      dispatch(loginAction({ message: error.message }));
      return rejectWithValue(error.message);
    }
  }
);
export const logOutHandler = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      let data = await AuthService.logout();
      if (data.status === 200) {
        cookie.remove("access_token", { path: "/" });
        cookie.remove("refresh_token", { path: "/" });
        cookie.remove("session_id", { path: "/" });
        dispatch(loginAction({ login: false }));
        dispatch(
          triggerToast({ type: DialogType.INFO, message: data.message })
        );
      } else {
        dispatch(
          triggerToast({ type: DialogType.DANGER, message: data.message })
        );
        return rejectWithValue(data.message);
      }
    } catch (error) {
      dispatch(
        triggerToast({ type: DialogType.DANGER, message: error.message })
      );
      return rejectWithValue(error.message);
    }
    dispatch(resetCartItems([]));
    dispatch(resetWishlist([]));
  }
);
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
export const myProfileHandler = createAsyncThunk(
  "auth/getProfile",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      let { user, status, message } = await AuthService.getProfile();
      if (status === 200) {
        dispatch(loginAction({ login: true, user: user }));
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
      if (status === 200) {
        dispatch(triggerToast({ message, type: ToastTypes.INFO }));
        return data;
      } else {
        dispatch(triggerToast({ message, type: ToastTypes.DANGER }));
        rejectWithValue(message);
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          triggerToast({ message: error.message, type: ToastTypes.DANGER })
        );
        return rejectWithValue(error.message);
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
  } catch (error) {
    dispatch(triggerToast({ type: DialogType.DANGER, message: error.message }));
  }
};

export const checkVerificationCode = createAsyncThunk(
  "auth/verifyCode",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { message, status } = await AuthService.verifyCode(payload);
      if (status === 200) {
        dispatch(triggerToast({ type: DialogType.SUCCESS, message }));
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
export const requestVerificationCode = createAsyncThunk(
  "auth/requestVerificationCode",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { message, status } = await AuthService.requestVerificationCode();
      if (status === 200) {
        dispatch(triggerToast({ type: DialogType.SUCCESS, message }));
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

export const provideResetPasswordReference = createAsyncThunk(
  "auth/provideReference",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { message, status } =
        await AuthService.resetPasswordProvideReference(payload);
      if (status === 200) {
        dispatch(triggerToast({ type: DialogType.SUCCESS, message }));
      } else {
        return rejectWithValue(message);
        // return message;
      }
    } catch (error) {
      dispatch(
        triggerToast({ message: error.message, type: DialogType.DANGER })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const validateResetToken = createAsyncThunk(
  "auth/validate/ResetToken",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { message, status } = await AuthService.validateResetToken(payload);
      if (status === 200) {
        return;
      } else {
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

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { message, status } = await AuthService.resetPassword(payload);
      if (status === 200) {
        dispatch(triggerToast({ type: DialogType.SUCCESS, message }));
      } else {
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

export default sign.reducer;
export const { loginAction, stopLoading } = sign.actions;
