import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  status: 0,
  type: "",
  title: "",
};
const globalDialog = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    showDialog(_, action) {
      return { ...action.payload };
    },
    resetState() {
      return { ...initialState };
    },
  },
});

export default globalDialog.reducer;

export const { showDialog, resetState } = globalDialog.actions;
