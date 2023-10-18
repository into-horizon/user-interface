import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: "",
  message: "",
  title: "",
};
const toast = createSlice({
  name: "toast",
  initialState,
  reducers: {
    triggerToast(_, action) {
      return action.payload;
    },
    resetState() {
      return { ...initialState };
    },
  },
});

export default toast.reducer;
export const { triggerToast,resetState } = toast.actions;
