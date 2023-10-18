import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Row, Form, Col, Spinner } from "react-bootstrap";
import { usePopup } from "react-custom-popup";
import { updateEmailHandler } from "../../../../store/auth";

const Email = (props) => {
  const { updateEmailHandler, profileData } = props;
  const [loading, setLoading] = useState(true);
  const { showOptionDialog, showToast } = usePopup();
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

          <Row>
            <Col xs={12} md={12}>
              <Form.Group className="mb-3" controlid="formBasicEmail">
                <Form.Label>Email Address </Form.Label>

                <Form.Control
                  placeholder="email"
                  name="email"
                  defaultValue={email}
                  style={{ maxWidth: "100%" }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12}>
              <Form.Group className="mb-3" controlid="formBasicMobile">
                <Form.Label>Mobile </Form.Label>
                <Form.Control
                  placeholder="mobile"
                  name="mobile"
                  defaultValue={mobile}
                  style={{ maxWidth: "100%" }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Button variant="primary" type="submit" controlid="button-email">
              Update
            </Button>
            {loading ? <Spinner animation="border" /> : null}
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
