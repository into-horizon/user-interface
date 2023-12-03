import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  usePopup,
  AnimationType,
  OutAnimationType,
} from "react-custom-popup";
import { resetState } from "../../store/dialog";

export const GlobalDialog = () => {
  const dispatch = useDispatch();
  const { message, type, title } = useSelector((state) => state.dialog);
  const { showAlert } = usePopup();
  // const messages = {
  //   create: "created successfully",
  //   update: "updated successfully",
  //   delete: "deleted successfully",
  //   error: "something went wrong",
  // };
  const showDialog = useCallback(
    (title, message) => {
      showAlert({
        type,
        text: message,
        title,
        animationType: AnimationType.FADE_IN,
        outAnimationType: OutAnimationType.FADE_OUT,
      });
    },
    [showAlert, type]
  );
  useEffect(() => {
    message && showDialog(title ?? "Error", message ?? "something went wrong");
    dispatch(resetState());
  }, [dispatch, message, showDialog, title]);
  return <></>;
};

export default GlobalDialog;
