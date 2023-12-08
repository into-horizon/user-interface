import {
  cibFacebook,
  cibInstagram,
  cibLinkedin,
  cibTwitter,
  cilScreenSmartphone,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import React, { forwardRef } from "react";
import { Container, Col, Row, Navbar, Button } from "react-bootstrap";
import { CButton, CFooter, CFormInput, CInputGroup } from "@coreui/react";
import LocalizedInputGroup from "./LocalizedInputGroup";
const Footer = forwardRef((_, ref) => {
  return (
    <CFooter ref={ref} className="absolute-footer z-3 lg-show ">
      <Navbar bg="light">
        <Container>
          <Row className=" justify-content-around ">
            <Col md={3}>
              <Row>
                <Col xs={"12"} className="">
                  <strong>Follow us on</strong>
                </Col>
                <Col className="row justify-content-around p-3">
                  <Col xs={"auto"}>
                    <a className="" href="/#">
                      <CIcon icon={cibFacebook} size="lg" />
                    </a>
                  </Col>
                  <Col xs="auto">
                    <a className="" href="/#">
                      <CIcon icon={cibInstagram} />
                    </a>
                  </Col>
                  <Col xs="auto">
                    <a className="" href="/#">
                      <CIcon icon={cibLinkedin} />
                    </a>
                  </Col>
                  <Col xs="auto">
                    <a className="" href="/#">
                      <CIcon icon={cibTwitter} />
                    </a>
                  </Col>
                </Col>
              </Row>
              <Row>
                <Col className="p-3">
                  <strong>Get app exclusive deals</strong>
                </Col>
              </Row>
              <Row xs={1} md={1}>
                <Col>
                  <Button variant="primary" size="md">
                    <CIcon icon={cilScreenSmartphone} size="lg" />
                    Download Our App
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col xs={4} md={2}>
              <strong>GrabOne</strong>
              <div className="footlinks">
                <a href="/#">Contact Us</a>
                <a href="/#">About Us</a>
                <a href="/#">Terms & Returns</a>
                <a href="/#">Blog</a>
                <a href="/#">Gift Cards</a>
              </div>
            </Col>
            <Col xs={4} md={2}>
              <strong>My Account</strong>
              <div className="footlinks">
                <a href="/#">My Account</a>
                <a href="/#">My Cart</a>
                <a href="/#">My Coupons</a>
                <a href="/#">FAQ</a>
              </div>
            </Col>
            <Col xs={4} md={2}>
              <strong>Merchants</strong>
              <div className="footlinks">
                <a href="/#">Run a Deal</a>
                <a href="/#">Merchant Centre</a>
              </div>
            </Col>
            <Col className="lg-show">
              <strong className="news">Newsletter Signup</strong>
              <p className="news">
                Sign up for our daily emails and we'll send you all the best
                deals, tailored for you.
              </p>
              <CInputGroup>
                <CFormInput type="text" placeholder="Enter Your Email" />
                <CButton>Subscribe</CButton>
              </CInputGroup>
            </Col>
          </Row>
        </Container>
      </Navbar>
    </CFooter>
  );
});

export default Footer;
