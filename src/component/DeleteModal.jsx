import { Button } from "@coreui/coreui";
import { cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CModal,
  CModalBody,
  CModalContent,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTooltip,
} from "@coreui/react";
import React from "react";
import { useState } from "react";

const DeleteModal = ({ onConfirm, tooltipContent, btnSize, disabled }) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <CTooltip content={tooltipContent ?? "delete"}>
        <CButton
          size={btnSize}
          color="danger"
          onClick={() => setVisible(true)}
          disabled={disabled}
        >
          <CIcon icon={cilTrash} size={btnSize} />
        </CButton>
      </CTooltip>
      <CModal
        visible={visible}
        alignment="center"
        onClose={() => setVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Delete Confirmation</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure delete this?</CModalBody>
        <CModalFooter>
          <CButton
            color="danger"
            onClick={() => onConfirm(() => setVisible(false))}
          >
            Confirm
          </CButton>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default DeleteModal;
