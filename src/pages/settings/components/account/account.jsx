import React, { useEffect, useState } from "react";
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
    _loading,
    user: { first_name, last_name, country, city, profile_picture },
  } = useSelector((state) => state.sign);
  const navigate = useNavigate();
  const { showOptionDialog, showToast, showAlert } = usePopup();
  const [_loadingXX, setLoading] = useState(true);

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
                  <fieldset className="fieldset">
                    {/* <legend>Personal Information</legend> */}
                    <Row>
                      <Col>
                        <Form.Group
                          className="mb-3"
                          controlid="formBasicFirstName"
                        >
                          <Form.Label>First Name </Form.Label>
                          <Form.Control
                            type="first_name"
                            placeholder="first name"
                            name="first_name"
                            defaultValue={
                              profileData ? first_name : "First Name"
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group
                          className="mb-3"
                          id="last_name"
                          controlid="formBasicLastName"
                        >
                          <Form.Label>Last Name </Form.Label>
                          <Form.Control
                            type="last_name"
                            placeholder="last name"
                            name="last_name"
                            defaultValue={profileData ? last_name : "Last Name"}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group
                          className="mb-3"
                          id="country"
                          controlid="formBasicCountry"
                        >
                          <Form.Label> Country </Form.Label>
                          <Form.Control
                            type="country"
                            placeholder="country"
                            name="country"
                            defaultValue={profileData ? country : "Country"}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group
                          className="mb-3"
                          id="city"
                          controlid="formBasicCity"
                        >
                          <Form.Label> City </Form.Label>
                          <Form.Control
                            type="city"
                            placeholder="city"
                            name="city"
                            defaultValue={profileData ? city : "City"}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button variant="primary" type="submit">
                      Update
                    </Button>
                    {loading2 ? <Spinner animation="border" /> : null}
                  </fieldset>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Account info</Accordion.Header>
              <Accordion.Body>
                <ChangeEmail />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Change Password</Accordion.Header>
              <Accordion.Body>
                <Form onSubmit={updatePasswordHandler} className="h-100">
                  <Row>
                    <Form.Group className="mb-3">
                      <Form.Control
                        placeholder="current password"
                        type="password"
                        id="password"
                        required
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group className="mb-3">
                      <Form.Control
                        placeholder="new password"
                        type="password"
                        id="newPassword"
                        required
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group className="mb-3">
                      <Form.Control
                        placeholder="repeat new password"
                        type="password"
                        id="repeatedPassword"
                        required
                      />
                      <Button variant="primary" type="submit">
                        Update
                      </Button>
                    </Form.Group>
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
