import React, { useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePopup, ToastPosition } from "react-custom-popup";
import { resetState } from "../../store/toast";

const GlobalToast = () => {
  const { message, type } = useSelector((state) => state.toast);
  const dispatch = useDispatch();
  const { showToast } = usePopup();
  const messages = useMemo(
    () => ({
      create: "created successfully",
      update: "updated successfully",
      delete: "deleted successfully",
      error: "something went wrong",
    }),
    []
  );
  const toastShow = useCallback(
    (toastType, message) => {
      showToast({
        text: message ?? messages[type],
        type: toastType,
        position: ToastPosition.BOTTOM_RIGHT,
        timeoutDuration: 5000,
      });
    },
    [messages, showToast, type]
  );
  useEffect(() => {
    if (!!type) {
      toastShow(type, message);
      dispatch(resetState());
    }
  }, [dispatch, message, toastShow, type]);
  return <></>;
};

export default GlobalToast;
