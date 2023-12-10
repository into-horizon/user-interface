import {
  CButton,
  CCard,
  CCardBody,
  // CCardFooter,
  CCardHeader,
  CCardText,
  CCardTitle,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormText,
  CInputGroup,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { validatePassword } from "../../services/utils";
import { namespaces } from "../../i18n";
import { useDispatch, useSelector } from "react-redux";
import { validateResetToken } from "../../store/auth";
import LoadingSpinner from "../../component/common/LoadingSpinner";

function ForgotPassword() {
  const { token } = useParams();
  const { t } = useTranslation([
    namespaces.PASSWORD.ns,
    namespaces.SIGN_UP.ns,
    namespaces.GLOBAL.ns,
  ]);
  const dispatch = useDispatch();
  const {
    loading,
    resetPassword: { isResetTokenInvalid, feedback },
  } = useSelector((state) => state.sign);
  const [passwordType, setPasswordType] = useState("password");
  const [passwordValidation, setPasswordValidation] = useState({
    invalid: false,
    message: "",
  });
  const [invalidPasswordConfirmation, setInvalidPasswordConfirmation] =
    useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { password, con_password } = e.target;

    try {
      validatePassword(password.value);
      setPasswordValidation({ invalid: false });
    } catch (error) {
      setPasswordValidation({ invalid: true, message: error });
      return;
    }
    if (password.value !== con_password.value) {
      setInvalidPasswordConfirmation(true);
      return;
    } else {
      setInvalidPasswordConfirmation(false);
    }
  };

  useEffect(() => {
    dispatch(validateResetToken(token));
  }, [dispatch, token]);
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="wrapper d-flex flex-row justify-content-center  align-content-center  ">
      <CContainer>
        <CRow className=" justify-content-center  align-items-center w-100 h-100">
          <CCol xs={6}>
            <CCard>
              <CCardHeader>
                <CCardTitle>{t("RESET_PASSWORD")}</CCardTitle>
              </CCardHeader>
              <CCardBody>
                {isResetTokenInvalid ? (
                  <CCardText className=" text-danger text-center fw-bold">
                   {feedback}
                  </CCardText>
                ) : (
                  <CForm onSubmit={handleSubmit}>
                    <CRow>
                      <CCol xs="12">
                        <CInputGroup>
                          <CFormInput
                            type={passwordType}
                            placeholder={t("NEW_PASSWORD")}
                            floatingLabel={t("NEW_PASSWORD")}
                            name="password"
                            id="password"
                            className="mb-2 "
                            required
                            invalid={passwordValidation.invalid}
                          />
                          <CButton
                            className="mb-2 bg-light"
                            color="secondary"
                            variant="outline"
                            onClick={() =>
                              setPasswordType(
                                passwordType === "password"
                                  ? "text"
                                  : "password"
                              )
                            }
                          >
                            {passwordType === "password" ? (
                              <Eye color="secondary" />
                            ) : (
                              <EyeSlash color="secondary" />
                            )}
                          </CButton>
                        </CInputGroup>
                        {passwordValidation.invalid && (
                          <CFormText className=" text-danger mb-2 mt-0">
                            {passwordValidation.message}
                          </CFormText>
                        )}
                      </CCol>
                      <CCol xs="12">
                        <CFormInput
                          type={passwordType}
                          placeholder={t("REPEAT_PASSWORD", namespaces.SIGN_UP)}
                          floatingLabel={t(
                            "REPEAT_PASSWORD",
                            namespaces.SIGN_UP
                          )}
                          name="con_password"
                          id="con_password"
                          required
                          invalid={invalidPasswordConfirmation}
                          feedbackInvalid={t(
                            "INVALID_REPEATED_PASSWORD",
                            namespaces.SIGN_UP
                          )}
                        />
                      </CCol>
                      <CCol xs="12" className=" d-flex ">
                        <CButton
                          type="submit"
                          className=" mx-auto mt-3"
                          color="secondary"
                          variant="outline"
                        >
                          {t("SUBMIT", namespaces.GLOBAL)}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                )}
              </CCardBody>
              {/* <CCardFooter></CCardFooter> */}
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}

export default ForgotPassword;
