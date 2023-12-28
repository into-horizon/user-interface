import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { signupHandler, verificationHandler } from "../store/auth";
import { signInHandlerWithGoogle } from "../store/google";
import { signInHandlerWithFacebook } from "../store/facebook";

import facebook from "../assets/facebook.svg";
import google from "../assets/google.svg";

import { State } from "country-state-city";
import { Spinner, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCol,
  CContainer,
  CFormInput,
  CFormSelect,
  CFormText,
  CInputGroup,
  CRow,
} from "@coreui/react";
import CFormInputWithMask from "./common/CFormInputWithMask";
import { Children } from "react";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { validatePassword } from "../services/utils";
const SignupForm = ({ signInHandlerWithGoogle }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation("sign-up");
  const googleUser = useSelector((state) => state.google);
  const { user: facebookUser } = useSelector((state) => state.facebook);
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [invalidPasswordConfirmation, setInvalidPasswordConfirmation] =
    useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    invalid: false,
    message: "",
  });
  const { loading } = useSelector((state) => state.sign);
  const [city, setCity] = useState([]);
  const [passwordType, setPasswordType] = useState("password");
  const onChange = (e) => {
    setUser((user) => ({ ...user, [e.target.name]: e.target.value }));
  };
  const handleSubmit = (e) => {
    const {
      first_name,
      last_name,
      email,
      mobile,
      city,
      gender,
      password,
      con_password,
      google_id,
      facebook_id,
    } = e.target;
    e.preventDefault();
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

    let obj = {
      email: email.value,
      password: password.value,
      first_name: first_name.value,
      last_name: last_name.value,
      mobile: mobile.value.substring(1),
      city: city.value,
      country: "jordan",
      country_code: 962,
      gender: gender.value,
      google_id: google_id.value,
      facebook_id: facebook_id.value || null,
    };
    dispatch(signupHandler(obj));
  };

  useEffect(() => {
    let provider = localStorage.getItem("provider");
    if (window.location.search) {
      if (provider === "google") {
        signInHandlerWithGoogle(window.location.search);
      } else if (provider === "facebook") {
        dispatch(signInHandlerWithFacebook(window.location.search));
      }
    }
  }, [dispatch, signInHandlerWithGoogle]);
  useEffect(() => {
    if (googleUser?.email) {
      setUser(googleUser);
      // dispatch(resetGoogleUser());
    } else if (facebookUser?.email) {
      setUser(facebookUser);
    }
  }, [dispatch, googleUser, facebookUser]);
  useEffect(() => {
    setCity(State.getStatesOfCountry(String("JO")));
  }, []);

  return (
    <div className="bg-light d-flex flex-row align-items-center wrapper w-100">
      <CContainer>
        <CRow className=" align-content-center  justify-content-center ">
          <CCol xs={12} sm={10} md={9} xl={6}>
            <CCard className=" my-3 ">
              <CCardHeader>
                <CCardTitle>{t("SIGN_UP")}</CCardTitle>
              </CCardHeader>
              <CCardBody>
                <form
                  onSubmit={handleSubmit}
                  className=" d-flex flex-column gy-3"
                >
                  <CFormInput
                    type="text"
                    placeholder={t("FIRST_NAME")}
                    floatingLabel={t("FIRST_NAME")}
                    name="first_name"
                    id="first_name"
                    className="mb-2 "
                    required
                    value={user.first_name}
                    onChange={onChange}
                  />
                  <CFormInput
                    type="text"
                    placeholder={t("LAST_NAME")}
                    floatingLabel={t("LAST_NAME")}
                    name="last_name"
                    id="last_name"
                    className="mb-2 "
                    required
                    value={user.last_name}
                    onChange={onChange}
                  />

                  <CFormInput
                    type="text"
                    placeholder={t("EMAIL")}
                    floatingLabel={t("EMAIL")}
                    name="email"
                    id="email"
                    className="mb-2 "
                    required
                    value={user.email}
                    onChange={onChange}
                    disabled={googleUser.email || facebookUser.email}
                  />

                  <CFormInputWithMask
                    placeholder={t("PHONE")}
                    floatingLabel={t("PHONE")}
                    mask="+{962}000000000"
                    name="mobile"
                    dir="ltr"
                    id="mobile"
                    type="tel"
                    autoComplete="phone"
                    className="mb-2 "
                    required
                    onChange={onChange}
                  />
                  {/* <CFormSelect
                    name="gender"
                    className="mb-2"
                    id="gender"
                    floatingLabel={t("GENDER")}
                    required
                    onChange={onChange}
                  >
                    <option value="male">{t("MALE")}</option>
                    <option value="female">{t("FEMALE")}</option>
                  </CFormSelect> */}

                  <CFormSelect
                    name="city"
                    id="city"
                    className="mb-2"
                    floatingLabel={t("CITY")}
                  >
                    {Children.toArray(
                      city.map((item) => (
                        <option value={item.name.split(" ")[0]}>
                          {t(item.name.split(" ")[0].toUpperCase())}
                        </option>
                      ))
                    )}
                  </CFormSelect>

                  <CInputGroup>
                    <CFormInput
                      type={passwordType}
                      placeholder={t("PASSWORD")}
                      floatingLabel={t("PASSWORD")}
                      name="password"
                      id="password"
                      className="mb-2 "
                      required
                      invalid={passwordValidation.invalid}
                      autoComplete="true"
                    />
                    <CButton
                      className="mb-2 bg-light"
                      color="secondary"
                      variant="outline"
                      onClick={() =>
                        setPasswordType(
                          passwordType === "password" ? "text" : "password"
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

                  <CFormInput
                    type={passwordType}
                    placeholder={t("REPEAT_PASSWORD")}
                    floatingLabel={t("REPEAT_PASSWORD")}
                    name="con_password"
                    id="con_password"
                    autoComplete="true"
                    required
                    invalid={invalidPasswordConfirmation}
                    feedbackInvalid={t("INVALID_REPEATED_PASSWORD")}
                  />

                  <div className=" mx-auto mt-2 ">
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <Spinner animation="grow" size="sm" variant="light" />
                      ) : (
                        t("SIGN_UP")
                      )}
                    </Button>
                  </div>
                  <input
                    hidden
                    name="google_id"
                    id="google_id"
                    type="text"
                    value={googleUser?.google_id ?? ""}
                    onChange={onChange}
                  />
                  <input
                    hidden
                    className="input"
                    name="facebook_id"
                    id="facebook_id"
                    type="text"
                    defaultValue={facebookUser?.facebook_id ?? ""}
                    onChange={onChange}
                  />
                </form>

                <CRow className=" mx-auto w-auto d-flex justify-content-center  mt-2 gy-2 ">
                  <CCol xs="8" className=" d-flex ">
                    <a
                      href={`${process.env.REACT_APP_API}/auth/google`}
                      onClick={() => localStorage.setItem("provider", "google")}
                      className=" mx-auto "
                    >
                      <button className="google-btn">
                        <img src={google} alt="google" />
                        {t("CONTINUE_WITH_GOOGLE")}
                      </button>
                    </a>
                  </CCol>
                  <CCol xs="8" className=" d-flex ">
                    <a
                      href={`${process.env.REACT_APP_API}/auth/facebook`}
                      onClick={() =>
                        localStorage.setItem("provider", "facebook")
                      }
                      className=" mx-auto "
                    >
                      <button className="facebook-btn">
                        <img src={facebook} alt="facebook" />
                        {t("CONTINUE_WITH_FACEBOOK")}
                      </button>
                    </a>
                  </CCol>
                </CRow>
                <div className="mt-2">
                  <p className=" text-center ">
                    {t("HAVE_ACCOUNT")}{" "}
                    <Link to="/signIn" className=" link-info  mx-auto ">
                      {t("LOGIN")}
                    </Link>
                  </p>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

// export default SignupForm

const mapStateToProps = (state) => ({
  userSignUp: state.sign ? state.sign : null,
  googleUser: state.signInWithGoogleData ? state.signInWithGoogleData : null,
  provider: state.provider,
  facebookUser: state.signInWithFacebookData
    ? state.signInWithFacebookData
    : null,
});

const mapDispatchToProps = {
  signupHandler,
  verificationHandler,
  signInHandlerWithGoogle,
  signInHandlerWithFacebook,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);
