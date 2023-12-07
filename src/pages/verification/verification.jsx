import React, { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  checkVerificationCode,
  requestVerificationCode,
  verificationHandler,
  verifyHandler,
} from "../../store/auth";
import { useTranslation } from "react-i18next";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCardTitle,
  CCardFooter,
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
  const { t } = useTranslation("verification");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.sign);

  const handleVerification = async (e) => {
    e.preventDefault();
    dispatch(checkVerificationCode(e.target.code.value));
  };

  useEffect(() => {
    console.log('here');
    dispatch(requestVerificationCode());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
                  <p>{t("VERIFICATION_TEXT")}</p>
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
                      {loading ? (
                        <CSpinner size="sm" />
                      ) : (
                        t("verify".toUpperCase())
                      )}
                    </CButton>
                  </CInputGroup>
                </CForm>
              </CCardBody>
              <CCardFooter>
                <CCardText>
                  {t("NEW_CODE_TEXT")}
                  <CButton
                    color="link"
                    onClick={() => dispatch(requestVerificationCode())}
                  >
                    {t("NEW_CODE")}
                  </CButton>
                </CCardText>
              </CCardFooter>
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
