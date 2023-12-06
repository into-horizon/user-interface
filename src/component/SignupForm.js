import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { signupHandler, verificationHandler } from "../store/auth";
import { signInHandlerWithGoogle } from "../store/google";
import { signInHandlerWithFacebook } from "../store/facebook";

import facebook from "../assets/f.png";
import google from "../assets/g.png";

import { State } from "country-state-city";
import { Spinner, Button } from "react-bootstrap";
import "react-phone-number-input/style.css";
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
const SignupForm = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation("sign-up");

  const [user, setUser] = useState({});
  const [invalidPasswordConfirmation, setInvalidPasswordConfirmation] =
    useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    invalid: false,
    message: "",
  });
  const { loading } = useSelector((state) => state.sign);
  const [city, setCity] = useState([]);
  const [passwordType, setPasswordType] = useState("password");

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
      country: "jordan",
      city: city.value,
      country_code: 962,
      gender: gender.value,
      // google_id: e.target.google_id.value || null,
      // facebook_id: e.target.facebook_id.value || null,
    };
    // props.signupHandler(obj);

    dispatch(signupHandler(obj));
  };

  useEffect(() => {
    let provider = localStorage.getItem("provider");
    if (window.location.search) {
      if (provider === "google") {
        props.signInHandlerWithGoogle(window.location.search);
      } else if (provider === "facebook") {
        props.signInHandlerWithFacebook(window.location.search);
      }
    }
  }, [props]);
  useEffect(() => {
    console.log(
      "🚀 ~ file: SignupForm.js ~ line 72 ~ SignupForm ~ [props.googleUser",
      props.googleUser
    );
    setUser(props.googleUser);
  }, [props.googleUser]);
  useEffect(() => {
    setUser(props.facebookUser);
    console.log(
      "🚀 ~ file: SignupForm.js ~ line 80 ~ useEffect ~ props.facebookUser.user",
      props.facebookUser.user
    );
  }, [props.facebookUser]);

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
                    value={user ? user.first_name : null}
                  />
                  <CFormInput
                    type="text"
                    placeholder={t("LAST_NAME")}
                    floatingLabel={t("LAST_NAME")}
                    name="last_name"
                    id="last_name"
                    className="mb-2 "
                    required
                    value={user ? user.last_name : null}
                  />

                  <CFormInput
                    type="text"
                    placeholder={t("EMAIL")}
                    floatingLabel={t("EMAIL")}
                    name="email"
                    id="email"
                    className="mb-2 "
                    required
                    value={user ? user.email : null}
                  />

                  <CFormInputWithMask
                    placeholder={t("PHONE")}
                    floatingLabel={t("PHONE")}
                    mask="+{962}000000000"
                    name="mobile"
                    id="mobile"
                    className="mb-2 "
                    required
                  />
                  <CFormSelect
                    name="gender"
                    className="mb-2 p-2"
                    id="gender"
                    required
                  >
                    <option value="male">{t("MALE")}</option>
                    <option value="female">{t("FEMALE")}</option>
                  </CFormSelect>

                  <CFormSelect name="city" className="mb-2 p-2" id="city">
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
                </form>

                <div className=" mx-auto w-auto d-flex justify-content-center mt-2    ">
                  <Link to="/">
                    <input
                      hidden
                      className="input"
                      name="google_id"
                      type="text"
                      value={user ? user.google_id : null}
                    />
                    <img className=" w-75 " src={google} alt="" />
                  </Link>
                  <Link to="/">
                    <input
                      hidden
                      className="input"
                      name="facebook_id"
                      type="text"
                      value={user ? user.google_id : null}
                    />
                    <img className=" w-75 " src={facebook} alt="" />
                  </Link>
                </div>
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
