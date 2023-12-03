import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import {
  signupHandler,
  verificationHandler,
  deleteMessage,
} from "../store/auth";
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
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CFormInputWithMask from "./common/CFormInputWithMask";
import { Children } from "react";
import { Eye } from "react-bootstrap-icons";

const SignupForm = (props) => {
  const dispatch = useDispatch();
  const { userSignUp } = props;
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [invalidPasswordConfirmation, setInvalidPasswordConfirmation] =
    useState(false);
  const [phone, setPhone] = useState();
  const [city, setCity] = useState([]);
  const [showError, setShowError] = useState(false);

  const [values, setValues] = useState({
    first_name: props.googleUser.first_name || "",
    last_name: props.googleUser.last_name || "",
    email: props.googleUser.email || "",
    gender: "",
    mobile: "",
    country: "",
    city: "",
    country_code: "",
    password: "",
    google_id: props.googleUser.google_id || "",
    facebook_id: props.googleUser.facebook_id || "",
  });

  const handleChange = (e) => {
    console.log(e.target.name, "name");
    console.log(e.target.value, "value");
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
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
    } = e.target;
    e.preventDefault();
    // dispatch(deleteMessage());
    setLoading(true);
    setShowError(false);
    console.log(mobile.value.substring(1));
    if (password.value !== con_password.value) {
      setInvalidPasswordConfirmation(true);
      return;
    }

    let phoneArray = e.target.mobile.value.split(" ");
    let country_code = phoneArray[0].slice(1);
    let obj = {
      email: e.target.email.value,
      password: e.target.password.value,
      first_name: e.target.first_name.value,
      last_name: e.target.last_name.value,
      mobile: "0" + phoneArray.slice(1).join(""),
      // country: e.target.country.value,
      city: e.target.city.value,
      // country_code: country_code,
      gender: e.target.gender.value,
      // google_id: e.target.google_id.value || null,
      // facebook_id: e.target.facebook_id.value || null,
    };
    // props.signupHandler(obj);

    console.log(
      "🚀 ~ file: SignupForm.js ~ line 31 ~ SignupForm ~ userSignUp",
      userSignUp
    );
  };

  useEffect(() => {
    if (userSignUp.message) {
      let check = userSignUp.message[0];
      console.log(
        "🚀 ~ file: SignupForm.js ~ line 92 ~ useEffect ~ userSignUp.message",
        userSignUp.message
      );
      if (
        userSignUp.message.includes("Missing") ||
        check.includes("password") ||
        userSignUp.message.includes("email") ||
        userSignUp.message.includes("mobile")
      ) {
        setShowError(true);
      }
    }
    setLoading(false);
  }, [userSignUp]);

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

  // const getCities = (e) => {
  //   let id = document.getElementById("countryId").value;
  // };

  useEffect(() => {
    setCity(State.getStatesOfCountry(String("JO")));
  }, []);

  return (
    <div className="bg-light d-flex flex-row align-items-center wrapper w-100">
      <CContainer>
        <CRow className=" align-content-center  justify-content-center ">
          <CCol xs={6}>
            <CCard>
              <CCardHeader>
                <CCardTitle>
                  <h3>{t("text1")}</h3>
                </CCardTitle>
              </CCardHeader>
              <CCardBody>
                <form
                  onSubmit={handleSubmit}
                  className=" d-flex flex-column gy-3"
                >
                  <CFormInput
                    type="text"
                    placeholder={t("name1")}
                    floatingLabel={t("name1")}
                    name="first_name"
                    id="first_name"
                    className="mb-2 "
                    value={user ? user.first_name : null}
                  />
                  <CFormInput
                    type="text"
                    placeholder={t("name2")}
                    floatingLabel={t("name2")}
                    name="last_name"
                    id="last_name"
                    className="mb-2 "
                    value={user ? user.last_name : null}
                  />

                  <CFormInput
                    type="text"
                    placeholder={t("em")}
                    floatingLabel={t("em")}
                    name="email"
                    id="email"
                    className="mb-2 "
                    value={user ? user.email : null}
                  />

                  <CFormInputWithMask
                    placeholder={t("phone")}
                    floatingLabel={t("phone")}
                    mask="+{962}000000000"
                    name="mobile"
                    id="mobile"
                    className="mb-2 "
                    onChange={setPhone}
                    inputComponent={CFormInput}
                    onInvalid={(e) => console.log(e)}
                  />
                  {/* <CFormLabel htmlFor="gender">{t("gen")}</CFormLabel> */}
                  <CFormSelect name="gender" className="mb-2  " id="gender">
                    {/* <option value="Gender" disabled >
                      {t("gen")}
                    </option> */}
                    <option value="male">{t("mal")}</option>
                    <option value="female">{t("fem")}</option>
                  </CFormSelect>

                  <CFormSelect name="city" className="mb-2  " id="city">
                    {/* <option value="City">{t("city")}</option> */}
                    {Children.toArray(
                      city.map((item) => (
                        <option value={item.name.split(" ")[0]}>
                          {/* {displayName(item.name.split(" ")[0])} */}
                          {item.name.split(" ")[0]}
                        </option>
                      ))
                    )}
                  </CFormSelect>

                  <CInputGroup>
                    <CFormInput
                      type="password"
                      placeholder={t("pass")}
                      floatingLabel={t("pass")}
                      name="password"
                      id="password"
                      className="mb-2 "
                    />
                    <CButton
                      className="mb-2 bg-light"
                      color="secondary"
                      variant="outline"
                    >
                      <Eye color="secondary" />
                    </CButton>
                  </CInputGroup>

                  <CFormInput
                    type="password"
                    placeholder={t("con-pass")}
                    floatingLabel={t("con-pass")}
                    name="con_password"
                    id="con_password"
                    invalid={invalidPasswordConfirmation}
                    feedbackInvalid={"passwords don't match"}
                  />

                  <Button type="submit" className="ahmad">
                    {loading ? (
                      <Spinner animation="border" variant="primary" />
                    ) : (
                      t("register")
                    )}
                  </Button>
                </form>

                <div className="">
                  <Link to="/">
                    <input
                      hidden
                      className="input"
                      name="google_id"
                      type="text"
                      value={user ? user.google_id : null}
                    />
                    <img className="SM" src={google} alt="" />
                  </Link>
                  <Link to="/">
                    <input
                      hidden
                      className="input"
                      name="facebook_id"
                      type="text"
                      value={user ? user.google_id : null}
                    />
                    <img className="SM" src={facebook} alt="" />
                  </Link>
                </div>
                <div>
                  <a className="btn btn-sign" href="/signIn">
                    {t("sub")}{" "}
                  </a>
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
