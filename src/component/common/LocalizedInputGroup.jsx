import { CInputGroup } from "@coreui/react";
import React from "react";
import { useTranslation } from "react-i18next";

function LocalizedInputGroup(props) {
  const { i18n } = useTranslation();
  return (
    <CInputGroup
      {...props}
      className={`${props?.className??''} ${
        i18n.language === "ar" ? "flex-row-reverse " : ""
      }`}
    >
      {i18n.language === "en" ? props.children : [...props.children].reverse()}
    </CInputGroup>
  );
}

export default LocalizedInputGroup;
