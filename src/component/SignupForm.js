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

import background from "../assets/8.jpg";
import facebook from "../assets/f.png";
import google from "../assets/g.png";
import PhoneInput from "react-phone-number-input";

import { Country, State } from "country-state-city";
import { Spinner, Form, Button } from "react-bootstrap";
import "react-phone-number-input/style.css";
import { useTranslation } from "react-i18next";

const SignupForm = (props) => {
  const dispatch = useDispatch();
  const { userSignUp } = props;
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [phone, setPhone] = useState();
  const [city, setCity] = useState();
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
    dispatch(deleteMessage());
    setLoading(true);
    setShowError(false);
    e.preventDefault();

    let phoneArray = e.target.mobile.value.split(" ");
    let country_code = phoneArray[0].slice(1);
    let obj = {
      email: e.target.email.value,
      password: e.target.password.value,
      first_name: e.target.first_name.value,
      last_name: e.target.last_name.value,
      mobile: "0" + phoneArray.slice(1).join(""),
      country: e.target.country.value,
      city: e.target.city.value,
      country_code: country_code,
      gender: e.target.gender.value,
      google_id: e.target.google_id.value || null,
      facebook_id: e.target.facebook_id.value || null,
    };
    props.signupHandler(obj);

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
  }, []);
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

  const getCities = (e) => {
    let id = document.getElementById("countryId").value;
    setCity(State.getStatesOfCountry(String(id)));
  };

  return (
    <div className="wrapper">
      <div className="inner">
        <div className="image-holder">
          <img className="image" src={background} alt={background} />
        </div>
        <form onSubmit={handleSubmit}>
          <h3>{t("text1")}</h3>

          <div className="form-group">
            <input
              type="text"
              placeholder={t("name1")}
              className="form-control-input"
              name="first_name"
              value={user ? user.first_name : null}
            />
            <input
              type="text"
              placeholder={t("name2")}
              className="form-control-input"
              name="last_name"
              value={user ? user.last_name : null}
            />
          </div>

          <div className="form-wrapper">
            <input
              type="text"
              placeholder={t("em")}
              className="form-control-input"
              name="email"
              value={user ? user.email : null}
            />
          </div>

          <div className="form-wrapper">
            <PhoneInput
              placeholder={t("phone")}
              international
              defaultCountry="JO"
              name="mobile"
              value={phone}
              onChange={setPhone}
            />
          </div>

          <div className="form-wrapper">
            <select id="" className="form-control-input" name="gender">
              <option value="Gender" selected>
                {t("gen")}
              </option>
              <option value="male">{t("mal")}</option>
              <option value="female">{t("fem")}</option>
            </select>
          </div>

          <div className="form-wrapper">
            <select
              id="countryId"
              className="form-control-input"
              name="country"
              onChange={getCities}
            >
              <option value="country" selected>
                {t("count")}
              </option>
              {Country.getAllCountries().map((item, index) => (
                <option id={item} value={item.isoCode} key={index}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-wrapper">
            <select id="" className="form-control-input" name="city">
              <option value="City" selected>
                {t("city")}
              </option>
              {city
                ? city.map((item, index) => (
                    <option value={item.name} key={index}>
                      {item.name.split(" ")[0]}
                    </option>
                  ))
                : null}
            </select>
          </div>

          <div className="form-wrapper">
            <input
              type="password"
              placeholder={t("pass")}
              name="password"
              className="form-control-input"
            ></input>
          </div>

          <div className="form-wrapper">
            <input
              type="password"
              placeholder={t("con-pass")}
              name="con_password"
              className="form-control-input"
            ></input>
          </div>

          {showError ? (
            <div style={{ color: "red", paddingBottom: "10px" }}>
              {" "}
              {userSignUp
                ? typeof userSignUp.message === "object"
                  ? userSignUp.message.map((el, index) => {
                      return <ul key={index}>{el} </ul>;
                    })
                  : userSignUp.message
                : null}
              <br />
            </div>
          ) : null}

          {loading ? <Spinner animation="border" /> : null}
          <Button type="submit" className="ahmad">
            {t("register")}{" "}
          </Button>

          <div className="SMI">
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
        </form>
      </div>
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
