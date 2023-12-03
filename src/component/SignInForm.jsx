import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { signInHandler } from "../store/auth";
import { signInHandlerWithGoogle } from "../store/google";
import { googleProvider, facebookProvider } from "../store/authProvider";
import { signInHandlerWithFacebook } from "../store/facebook";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import background from "../assets/8.jpg";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { EyeSlash, Eye } from "react-bootstrap-icons";
import LocalizedInputGroup from "./common/LocalizedInputGroup";

const SignInForm = ({ signInHandler }) => {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { t } = useTranslation();
  const { loading } = useSelector((state) => state.sign);
  const [passwordType, setPasswordType] = useState("password");

  const submitHandler = (e) => {
    e.preventDefault();

    signInHandler({
      email: e.target.email.value,
      password: e.target.password.value,
    });
  };

  return (
    <div className="bg-light d-flex flex-row align-items-center wrapper w-100 ">
      <CContainer>
        <CRow className=" w-100 h-100 justify-content-center align-content-center  ">
          <CCol xs={12} md={10} lg={10} xl={9}>
            <CCardGroup>
              <CCard className="p-4 bg-light  rounded-0  lg-show ">
                <CCardBody>
                  <img src={background} alt="background" />
                </CCardBody>
              </CCard>
              <CCard className=" rounded-0  p-sm-5  p-lg-3  ">
                <CCardBody className=" d-flex ">
                  <CForm onSubmit={submitHandler} className="my-auto  w-100 ">
                    <h1>{t("login")}</h1>
                    <p className="text-medium-emphasis">
                      {t("Sign In to your account")}
                    </p>
                    <CInputGroup className="my-4  ">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        name="email"
                        placeholder="email"
                      />
                    </CInputGroup>
                    <CInputGroup className="my-2">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={passwordType}
                        name="password"
                        placeholder={t("pass")}
                      />
                      <CButton
                        color="secondary"
                        className=" bg-light "
                        variant="outline"
                        onClick={() =>
                          setPasswordType(
                            passwordType === "password" ? "text" : "password"
                          )
                        }
                      >
                        {passwordType === "password" && <Eye color="inherit" />}
                        {passwordType === "text" && (
                          <EyeSlash color="inherit" />
                        )}
                      </CButton>
                    </CInputGroup>

                    <CRow
                      className="justify-content-between mt-2"
                      xs={{ gutterY: 3 }}
                    >
                      <CCol xs={"auto"}>
                        <Button
                          variant="primary"
                          type="submit"
                          className="btn"
                          disabled={loading}
                        >
                          {loading ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            t("sub")
                          )}
                        </Button>
                      </CCol>
                      <CCol xs={"auto"}>
                        <CButton color="link">forgot password?</CButton>
                      </CCol>
                      <CCol xs={12}>
                        <p className=" text-center ">
                          don't have account?{" "}
                          <Link to="/signUp">{t("sign")} </Link>
                        </p>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

// export default SignInForm

const mapStateToProps = (state) => ({
  userSignIn: state.sign ? state.sign : null,
  googleUser: state.signInWithGoogleData ? state.signInWithGoogleData : null,
  provider: state.provider,
  facebookUser: state.signInWithFacebookData
    ? state.signInWithFacebookData
    : null,
});

const mapDispatchToProps = {
  signInHandler,
  signInHandlerWithGoogle,
  googleProvider,
  facebookProvider,
  signInHandlerWithFacebook,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInForm);
