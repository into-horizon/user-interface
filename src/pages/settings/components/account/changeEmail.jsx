import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button, Row, Form, Col } from "react-bootstrap";
import { usePopup } from "react-custom-popup";
import { updateEmailHandler } from "../../../../store/auth";
import { CFormInput } from "@coreui/react";
import { namespaces } from "../../../../i18n";

const Email = ({ updateEmailHandler, profileData }) => {
  const [_loading, setLoading] = useState(true);
  const { t } = useTranslation(["settings", "sign-up"]);
  const { showOptionDialog } = usePopup();
  const { email, mobile } = profileData.user;
  useEffect(() => {
    setLoading(false);
  }, [profileData]);

  const updateHandler = (e) => {
    e.preventDefault();
    let data = {
      email: e.target.email.value,
      mobile: e.target.mobile.value,
    };
    showPopup(data);
  };
  const showPopup = (data) => {
    showOptionDialog({
      containerStyle: { width: 350 },
      text: "Are you sure you want to update your Email? You won't be able to revert that action.",
      title: "Update Email?",
      options: [
        {
          name: "Update",
          type: "confirm",
          style: { background: "lightcoral" },
        },
        {
          name: "Cancel",
          type: "cancel",
        },
      ],
      onConfirm: () => {
        setLoading(true);
        updateEmailHandler(data);
      },
    });
  };

  return (
    <div>
      <Form onSubmit={updateHandler} className="h-100">
        <fieldset>
          {/* <legend>Account info</legend> */}

          <Row className=" gy-3 ">
            <Col xs={12} md={12}>
              <CFormInput
                placeholder={t("EMAIL", namespaces.SIGN_UP)}
                name="email"
                defaultValue={email}
                floatingLabel={t("EMAIL", namespaces.SIGN_UP)}
              />
              {/* <Form.Group className="mb-3" controlid="formBasicEmail">
                <Form.Label>Email Address </Form.Label>

                <Form.Control
                  placeholder="email"
                  name="email"
                  defaultValue={email}
                  style={{ maxWidth: "100%" }}
                />
              </Form.Group> */}
            </Col>
            <Col xs={12} md={12}>
              <CFormInput
                placeholder={t("PHONE", namespaces.SIGN_UP)}
                floatingLabel={t("PHONE", namespaces.SIGN_UP)}
                name="mobile"
                defaultValue={mobile}
                style={{ maxWidth: "100%" }}
              />
            </Col>
            <Col>
              <Button
                variant="outline-primary"
                type="submit"
                controlid="button-email"
              >
                Update
              </Button>
            </Col>
          </Row>
        </fieldset>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  profileData: state.sign ? state.sign : null,
});
const mapDispatchToProps = { updateEmailHandler };
export default connect(mapStateToProps, mapDispatchToProps)(Email);
