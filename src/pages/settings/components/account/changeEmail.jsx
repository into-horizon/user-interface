import React from "react";
import { connect, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button, Row, Form, Col } from "react-bootstrap";
import { updateAccountInfo } from "../../../../store/auth";
import { CFormInput, CSpinner } from "@coreui/react";
import { namespaces } from "../../../../i18n";
import CFormInputWithMask from "../../../../component/common/CFormInputWithMask";

const Email = ({ updateAccountInfo, profileData }) => {
  const { loading } = useSelector((state) => state.sign);
  const { t } = useTranslation([
    namespaces.SETTINGS.ns,
    namespaces.SIGN_UP.ns,
    namespaces.GLOBAL.ns,
  ]);
  const { email, mobile } = profileData.user;

  const updateHandler = (e) => {
    e.preventDefault();
    let data = {
      email: e.target.email.value,
      mobile: e.target.mobile.value,
    };
    updateAccountInfo(data);
  };

  return (
    <div>
      <Form onSubmit={updateHandler} className="h-100">
        <Row className=" gy-3 ">
          <Col xs={12} md={12}>
            <CFormInput
              placeholder={t("EMAIL", namespaces.SIGN_UP)}
              name="email"
              defaultValue={email}
              floatingLabel={t("EMAIL", namespaces.SIGN_UP)}
            />
          </Col>
          <Col xs={12} md={12}>
            <CFormInputWithMask
              placeholder={t("PHONE", namespaces.SIGN_UP)}
              floatingLabel={t("PHONE", namespaces.SIGN_UP)}
              name="mobile"
              mask="+{962}000000000"
              defaultValue={mobile}
              className="w-100"
              dir="ltr"
              autoComplete="phone"
            />
          </Col>
          <Col>
            <Button
              variant="outline-primary"
              type="submit"
              controlid="button-email"
              disabled={loading}
            >
              {loading ? (
                <CSpinner size="sm" variant="grow" />
              ) : (
                t("SAVE_CHANGES", namespaces.GLOBAL)
              )}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  profileData: state.sign ? state.sign : null,
});
const mapDispatchToProps = { updateAccountInfo };
export default connect(mapStateToProps, mapDispatchToProps)(Email);
