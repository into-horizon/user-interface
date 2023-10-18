import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePopup, ToastPosition } from "react-custom-popup";
import { resetState } from "../store/toast";

const GlobalToast = () => {
  const { message, type, title } = useSelector((state) => state.toast);
  const dispatch = useDispatch();
  const { showToast } = usePopup();
  const messages = {
    create: "created successfully",
    update: "updated successfully",
    delete: "deleted successfully",
    error: "something went wrong",
  };
  const toastShow = (toastType, message) => {
    showToast({
      text: message ?? messages[type],
      type: toastType,
      position: ToastPosition.BOTTOM_RIGHT,
      timeoutDuration: 5000,
    });
  };
  useEffect(() => {
    if (!!type) {
      toastShow(type, message);
      dispatch(resetState());
    }
  }, [message]);
  return <></>;
};

export default GlobalToast;
