import React, { Children, useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import {
  updateProfileHandler,
  updatePictureHandler,
  deactivateProfileHandler,
  logOutHandler,
  changePasswordHandler,
  deleteProfilePicture,
} from "../../../../store/auth";
import { useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import { Button, Row, Form, Col, Spinner, Accordion } from "react-bootstrap";
import {
  usePopup,
  OutAnimationType,
  AnimationType,
  DialogType,
  ToastPosition,
} from "react-custom-popup";
import ChangeEmail from "./changeEmail";
import CIcon from "@coreui/icons-react";
import { cilCloudUpload } from "@coreui/icons";
import DeleteModal from "../../../../component/common/DeleteModal";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { CFormInput, CFormSelect, CRow } from "@coreui/react";
import { State } from "country-state-city";
import { useTranslation } from "react-i18next";
import { namespaces } from "../../../../i18n";

const Account = ({
  updateProfileHandler,
  updatePictureHandler,
  profileData,
  deactivateProfileHandler,
  logOutHandler,
  changePasswordHandler,
  deleteProfilePicture,
}) => {
  const {
    message,
    // _loading,
    user: { first_name, last_name, city, profile_picture },
  } = useSelector((state) => state.sign);
  const navigate = useNavigate();
  const { t } = useTranslation(["", "sign-up"]);
  const { showOptionDialog, showToast, showAlert } = usePopup();
  const [_loadingXX, setLoading] = useState(true);
  const [cities, setCities] = useState([]);

  const [loading2, setLoading2] = useState(true);

  useEffect(() => {
    if (!cookie.load("access_token")) {
      navigate("/pageInvalidToken");
    }
  }, [navigate]);
  useEffect(() => {
    if (message && !message.title ? message.includes("deactivated") : null) {
      navigate("/signIn");
    }
  }, [message, navigate, profileData]);
  useEffect(() => {
    setLoading(false);
    setLoading2(false);
  }, [profileData]);
  let data;
  const updateHandler = (e) => {
    e.preventDefault();
    data = {
      first_name: e.target.first_name.value,
      last_name: e.target.last_name.value,
      country: e.target.country.value,
      city: e.target.city.value,
    };
    showPopup(data);
  };
  const deactivateHandler = () => {
    showPopup2();
  };

  const showPopup = (data) => {
    showOptionDialog({
      containerStyle: { width: 350 },
      text: "Are you sure you want to update your profile? You won't be able to revert that action.",
      title: "Update Profile?",
      options: [
        {
          name: "Cancel",
          type: "cancel",
        },
        {
          name: "Update",
          type: "confirm",
          style: { background: "lightcoral" },
        },
      ],
      onConfirm: () => {
        setLoading2(true);
        updateProfileHandler(data);
      },
    });
  };

  const showPopup2 = (data) => {
    showOptionDialog({
      containerStyle: { width: 350 },
      text: "Are you sure you want to deactivate your profile? You can activate your profile any time signin twice",
      title: "Deactivate Profile?",
      options: [
        {
          name: "Cancel",
          type: "cancel",
        },
        {
          name: "Deactivate",
          type: "confirm",
          style: { background: "lightcoral" },
        },
      ],
      onConfirm: () => {
        setLoading2(true);
        deactivateProfileHandler();
        logOutHandler();
      },
    });
  };

  const changeHandler = (e) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("image", e.target.files[0]);
    updatePictureHandler(formData);
  };

  const updatePasswordHandler = (e) => {
    e.preventDefault();
    const obj = {
      current: e.target.password.value,
      new: e.target.newPassword.value,
      repeatedPassword: e.target.repeatedPassword.value,
    };
    if (obj.new !== obj.repeatedPassword) {
      return showAlert({
        type: DialogType.DANGER,
        text: "Passwords don`t match",
        title: "Please make sure to repeat new password correctly",
        animationType: AnimationType.FADE_IN,
        outAnimationType: OutAnimationType.FADE_OUT,
      });
    }
    Promise.all([changePasswordHandler(obj)]).then(
      ([{ status, message: msg }]) => {
        const { title, details } = msg;
        if (title) {
          showAlert({
            type: DialogType.DANGER,
            text: <Error data={details} />,
            title: title,
            animationType: AnimationType.FADE_IN,
            outAnimationType: OutAnimationType.FADE_OUT,
          });
        } else if (status === 403) {
          showAlert({
            type: DialogType.DANGER,
            text: msg,
            title: "Error",
            animationType: AnimationType.FADE_IN,
            outAnimationType: OutAnimationType.FADE_OUT,
          });
        } else if (status === 200) {
          showToast({
            text: msg,
            type: DialogType.INFO,
            position: ToastPosition.BOTTOM_RIGHT,
            timeoutDuration: 3000,
          });
          e.target.reset();
        }
      }
    );
  };

  const Error = ({ data }) => {
    return (
      <React.Fragment>
        <ol>
          {data.map((d, i) => (
            <li key={`detail${i}`}>{d}</li>
          ))}
        </ol>
      </React.Fragment>
    );
  };

  useEffect(() => {
    setCities(State.getStatesOfCountry(String("JO")));
  }, []);
  const signupNs = {
    ns: "sign-up",
  };
  return (
    <div>
      <>
        <Row className="justify-content-center align-content-center">
          <>
            <Col xs={"6"} className="justify-content-center row">
              <LazyLoadImage
                className="w-50 h-50 mx-auto img-thumbnail"
                src={profile_picture}
                loading="lazy"
              />
              <Col xs={"8"}>
                <Row className="justify-content-between">
                  <Col xs={"auto"}>
                    <Form>
                      <Form.Group>
                        <Form.Label
                          htmlFor="file-input"
                          className="btn btn-secondary"
                        >
                          <CIcon icon={cilCloudUpload} />
                        </Form.Label>
                        <Form.Control
                          id="file-input"
                          type="file"
                          name="file-input"
                          accept="image/*"
                          hidden
                          onChange={changeHandler}
                        />
                      </Form.Group>
                    </Form>
                  </Col>
                  <Col xs={"auto"}>
                    <DeleteModal
                      onConfirm={(close) => {
                        deleteProfilePicture();
                        close();
                      }}
                      disabled={profile_picture.includes("default")}
                    />
                  </Col>
                </Row>
              </Col>
            </Col>
          </>
        </Row>
      </>

      <Row className="w-100">
        <Col xs={12}>
          <Accordion defaultActiveKey="0" className="w-100">
            <Accordion.Item eventKey="0" className="w-100">
              <Accordion.Header>Personal Information</Accordion.Header>
              <Accordion.Body>
                <Form onSubmit={updateHandler} className="w-100">
                  <CRow xs={{ gutterY: 2 }}>
                    <Col xs="12" lg="6">
                      <CFormInput
                        floatingLabel={t("FIRST_NAME", namespaces.SIGN_UP)}
                        placeholder={t("FIRST_NAME", signupNs)}
                        id="first_name"
                        value={first_name ?? ""}
                      />
                    </Col>
                    <Col xs="12" lg="6">
                      <CFormInput
                        floatingLabel={t("last_name".toUpperCase(), namespaces.SIGN_UP)}
                        placeholder={t("last_name".toUpperCase(), namespaces.SIGN_UP)}
                        id="last_name"
                        value={last_name ?? ""}
                      />
                    </Col>

                    <Col xs="12" lg="6">
                      <CFormSelect
                        floatingLabel={t("city".toUpperCase(), namespaces.SIGN_UP)}
                        placeholder={t("city".toUpperCase(), namespaces.SIGN_UP)}
                        name="city"
                        id="city"
                        defaultValue={profileData ? city : "City"}
                      >
                        {Children.toArray(
                          cities.map((item) => (
                            <option value={item.name.split(" ")[0]}>
                              {t(
                                item.name.split(" ")[0].toUpperCase(),
                                namespaces.SIGN_UP
                              )}
                            </option>
                          ))
                        )}
                      </CFormSelect>
                    </Col>
                    <Col xs="12" lg="6">
                      <CFormSelect
                        floatingLabel={t("gender".toUpperCase(), namespaces.SIGN_UP)}
                        placeholder="city"
                        name="city"
                        id="city"
                        defaultValue={profileData ? profileData?.gender : ""}
                      >
                        <option value="male">{t("MALE", namespaces.SIGN_UP)}</option>
                        <option value="female">{t("FEMALE", namespaces.SIGN_UP)}</option>
                      </CFormSelect>
                    </Col>
                  </CRow>

                  <Button
                    variant="outline-primary"
                    className="mt-2"
                    type="submit"
                  >
                    Update
                  </Button>
                  {loading2 ? <Spinner animation="border" /> : null}
                </Form>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Account info</Accordion.Header>
              <Accordion.Body>
                <ChangeEmail signupNs={signupNs} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Change Password</Accordion.Header>
              <Accordion.Body>
                <Form onSubmit={updatePasswordHandler} className="h-100">
                  <Row className=" gy-3">
                    <Col xs="12">
                      <CFormInput
                        placeholder="current password"
                        floatingLabel="current password"
                        type="password"
                        id="password"
                        required
                      />
                    </Col>
                    <Col xs="12">
                      <CFormInput
                        placeholder="new password"
                        floatingLabel="new password"
                        type="password"
                        id="newPassword"
                        required
                      />
                    </Col>
                    <Col xs="12">
                      <CFormInput
                        placeholder="repeat new password"
                        floatingLabel="repeat new password"
                        type="password"
                        id="repeatedPassword"
                        required
                      />
                    </Col>
                    <Col xs="12">
                      <Button variant="outline-primary" type="submit">
                        Update
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
      <Button
        variant="danger"
        className="my-2"
        type="submit"
        onClick={deactivateHandler}
      >
        Deactivate
      </Button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  profileData: state.sign ? state.sign : null,
});
const mapDispatchToProps = {
  updateProfileHandler,
  updatePictureHandler,
  deactivateProfileHandler,
  logOutHandler,
  changePasswordHandler,
  deleteProfilePicture,
};
export default connect(mapStateToProps, mapDispatchToProps)(Account);
