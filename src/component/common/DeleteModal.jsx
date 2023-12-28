import { cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTooltip,
} from "@coreui/react";
import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { namespaces } from "../../i18n";

const DeleteModal = ({ onConfirm, tooltipContent, btnSize, disabled }) => {
  const { t } = useTranslation([namespaces.GLOBAL.ns]);
  const [visible, setVisible] = useState(false);
  return (
    <>
      <CTooltip content={tooltipContent ?? t("DELETE")}>
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
        backdrop={false}
      >
        <CModalHeader>
          <CModalTitle>{t('DELETE_CONFIRMATION')}</CModalTitle>
        </CModalHeader>
        <CModalBody>{t('DELETE_TEXT')}</CModalBody>
        <CModalFooter>
          <CButton
            color="danger"
            onClick={() => onConfirm(() => setVisible(false))}
          >
            {t("CONFIRM")}
          </CButton>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            {t("CANCEL")}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default DeleteModal;
