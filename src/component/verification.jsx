import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { verificationHandler, verifyHandler } from "../store/auth";
import { useTranslation } from "react-i18next";
import { Form, Button } from "react-bootstrap";
// import './verification.css';

const Verification = (props) => {
  const { t } = useTranslation();

  const [verify, setVerify] = useState(false);
  const [verification, setVerification] = useState(false);

  const handleVerification = async (e) => {
    e.preventDefault();
    console.log("aaaaaaaaaaaaaaaaaaaaaa");
    props.verificationHandler();
    setVerification(true);
  };

  const handleCode = (e) => {
    e.preventDefault();
    let code = e.target.code.value;
    console.log(
      "🚀 ~ file: verification.jsx ~ line 19 ~ handleCode ~ code",
      code
    );
    // props.verifyHandler(code);
  };

  return (
    <div className="wrapper">
      <div className="inner2">
        <div>
          {verification === false ? (
            <form onSubmit={handleVerification}>
              <Form.Group className="mb-3">
                <Form.Text className="text-muted">
                  verification your phone Number
                </Form.Text>
              </Form.Group>

              <Button variant="primary" type="submit" className="btn">
                Verification
              </Button>
            </form>
          ) : (
            <form onSubmit={handleCode}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="phone"
                  name="code"
                  placeholder=" Enter code"
                />
                <Form.Text className="text-muted">
                  verification your phone Number
                </Form.Text>
              </Form.Group>

              <Button variant="secondary" type="submit" className="btn">
                verify code
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userSignUp: state.sign ? state.sign : null,
});

const mapDispatchToProps = { verificationHandler, verifyHandler };

export default connect(mapStateToProps, mapDispatchToProps)(Verification);
