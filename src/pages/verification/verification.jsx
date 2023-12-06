import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  checkVerificationCode,
  verificationHandler,
  verifyHandler,
} from "../../store/auth";
import { useTranslation } from "react-i18next";
import { Form, Button } from "react-bootstrap";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCardTitle,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CRow,
  CSpinner,
} from "@coreui/react";
// import './verification.css';

const Verification = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.sign);

  const handleVerification = async (e) => {
    e.preventDefault();
    dispatch(checkVerificationCode(e.target.code.value));
  };

  // const handleCode = (e) => {
  //   e.preventDefault();
  //   let code = e.target.code.value;
  //   console.log(
  //     "🚀 ~ file: verification.jsx ~ line 19 ~ handleCode ~ code",
  //     code
  //   );
  //   // props.verifyHandler(code);
  // };

  return (
    <div className=" min-vw-100 wrapper bg-light align-items-center  d-flex flex-row">
      <CContainer>
        <CRow className=" justify-content-center align-items-center ">
          <CCol xs={6}>
            <CCard>
              <CCardHeader>
                <CCardTitle>{t("VERIFICATION")}</CCardTitle>
              </CCardHeader>
              <CCardBody>
                <CCardText>
                  <p>{t("PLEASE_ENTER_CODE")}</p>
                </CCardText>
                <CForm onSubmit={handleVerification} className=" mt-5">
                  <CInputGroup>
                    <CFormInput
                      name="code"
                      id="code"
                      required
                      placeholder={t("PLEASE_ENTER_CODE")}
                    />
                    <CButton type="submit" disabled={loading}>
                      {loading ? <CSpinner size="sm" /> : "verify"}
                    </CButton>
                  </CInputGroup>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userSignUp: state.sign ? state.sign : null,
});

const mapDispatchToProps = { verificationHandler, verifyHandler };

export default connect(mapStateToProps, mapDispatchToProps)(Verification);
