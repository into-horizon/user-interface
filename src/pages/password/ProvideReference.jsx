import React from "react";
import {
  CButton,
  CCard,
  CCardBody,
  //   CCardFooter,
  CCardHeader,
  CCardSubtitle,
  CCardTitle,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CSpinner,
} from "@coreui/react";
import { useTranslation } from "react-i18next";
import { namespaces } from "../../i18n";
import { useDispatch, useSelector } from "react-redux";
import { provideResetPasswordReference } from "../../store/auth";
function ProvideReference() {
  const { t } = useTranslation([namespaces.PASSWORD.ns, namespaces.GLOBAL.ns]);
  const { resetPassword:{feedback, isReferenceInvalid}, loading } = useSelector(
    (state) => state.sign
  );
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(provideResetPasswordReference(e.target.reference.value));
  };
  return (
    <div className="wrapper d-flex flex-row  justify-content-center  align-content-center ">
      <CContainer>
        <CRow className=" justify-content-center  align-content-center  w-100 h-100">
          <CCol md={6}>
            <CCard>
              <CCardHeader>
                <CCardTitle>{t("RESET_PASSWORD")}</CCardTitle>
              </CCardHeader>
              <CCardBody>
                <CCardSubtitle className=" mb-3">
                  {t(["REFERENCE_TEXT"])}
                </CCardSubtitle>
                <CForm onSubmit={handleSubmit}>
                  <CRow className=" gy-3">
                    <CCol xs="12">
                      <CFormInput
                        placeholder={t("REFERENCE_PLACEHOLDER")}
                        floatingLabel={t("REFERENCE_PLACEHOLDER")}
                        name="reference"
                        id="reference"
                        feedbackInvalid={feedback}
                        invalid={isReferenceInvalid}
                        required
                      />
                    </CCol>
                    <CCol xs="12" className=" d-flex ">
                      <CButton
                        type="submit"
                        variant="outline"
                        className=" mx-auto"
                      >
                         {loading? <CSpinner size="sm"/> : t("SUBMIT", namespaces.GLOBAL)}
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
              {/* <CCardFooter></CCardFooter> */}
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}

export default ProvideReference;
