import React, { useEffect, useState } from "react";
import { logOutHandler } from "../../store/auth";
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CBadge, CListGroup, CListGroupItem } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilBell,
  cilHeart,
  cilCart,
  cilUser,
  cilSettings,
  cilAccountLogout,
  cilUserPlus,
  cilArrowCircleRight,
  cifSa,
  cifUs,
} from "@coreui/icons";
import { namespaces } from "../../i18n";

const Header = ({ cart, logOutHandler }) => {
  const login = useSelector((state) => state.sign.login);
  const navigate = useNavigate();
  const [displayList, setDisplayList] = useState(false);
  const { t, i18n } = useTranslation([
    namespaces.LANDING_PAGE.ns,
    namespaces.SIGN_IN.ns,
    namespaces.SIGN_UP.ns,
    namespaces.GLOBAL.ns,
  ]);
  const [style, setStyle] = useState({});

  useEffect(() => {
    let x = window.innerWidth;
    if (x < 553) {
      setStyle({ display: "none" });
    }
  }, []);

  const logOutHandle = () => {
    logOutHandler();
    navigate("/");
  };
  document.addEventListener("click", (e) => {
    if (!displayList) {
      return;
    }
    document.activeElement.tagName.toLowerCase() === "body" &&
      !e.target?.classList?.value.includes("icon") &&
      setDisplayList(false);
  });

  return (
    <Navbar bg="primary" variant="dark" className=" w-100 ">
      <Container>
        <Navbar.Brand className=" my-auto ">
          <Link to="/" className="nav-link my-auto w-50 ">
            {/* <span className="logo">Horizon</span> */}
            <img
              src={process.env.REACT_APP_HORIZON_LOGO}
              alt="logo"
              className="h-100 w-75"
            />
          </Link>
        </Navbar.Brand>
        <Nav className="lg-show">
          <div className="links" style={style}>
            <Nav>
              <Link to="/wishlist" className="nav-link " key="wishlist">
                <CIcon icon={cilHeart} size="xxl" className="my-auto" />
              </Link>

              {login && (
                <Nav.Link
                  as={"div"}
                  className="nav-link position-relative px-0 mx-2 pointer"
                  key="notification"
                  onClick={() => setDisplayList((x) => !x)}
                >
                  <CIcon icon={cilBell} size="xxl" />
                  <CBadge
                    color="danger"
                    position="top-end"
                    shape="rounded-pill"
                    className="mt-1"
                  >
                    9
                  </CBadge>

                  {displayList && (
                    <CListGroup className="position-absolute notifications-list start-0 overflow-y-auto  ">
                      <CListGroupItem component="a" href="#">
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1">List group item heading</h5>
                          <small>3 days ago</small>
                        </div>
                        <p className="mb-1">
                          Donec id elit non mi porta gravida at eget metus.
                          Maecenas sed diam eget risus varius blandit.
                        </p>
                      </CListGroupItem>
                      <CListGroupItem component="a" href="#">
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1">List group item heading</h5>
                          <small className="text-medium-emphasis">
                            3 days ago
                          </small>
                        </div>
                        <p className="mb-1">
                          Donec id elit non mi porta gravida at eget metus.
                          Maecenas sed diam eget risus varius blandit.
                        </p>
                      </CListGroupItem>
                      <CListGroupItem component="a" href="#">
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1">List group item heading</h5>
                          <small className="text-medium-emphasis">
                            3 days ago
                          </small>
                        </div>
                        <p className="mb-1">
                          Donec id elit non mi porta gravida at eget metus.
                          Maecenas sed diam eget risus varius blandit.
                        </p>
                      </CListGroupItem>
                    </CListGroup>
                  )}
                </Nav.Link>
              )}

              <Link
                to="/cart"
                className="nav-link position-relative mx-2"
                key="cart"
              >
                <CIcon icon={cilCart} size="xxl" />
                <CBadge
                  style={{ top: -10, right: "22%" }}
                  className=" position-absolute mt-1"
                >
                  <h6>
                    {cart.reduce((x, y) => {
                      return x + y.quantity;
                    }, 0)}
                  </h6>
                </CBadge>
              </Link>

              <NavDropdown title={<CIcon icon={cilUser} size="xxl" />}>
                {login ? (
                  <>
                    <Link
                      to="/settings"
                      className="dropdown-item d-flex gap-2 align-items-center "
                    >
                      <CIcon icon={cilSettings} />
                      <span>{t("settings".toUpperCase())}</span>
                    </Link>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      onClick={logOutHandle}
                      className="d-flex gap-2 align-items-center "
                    >
                      <CIcon icon={cilAccountLogout} />
                      {t("logout".toUpperCase())}
                    </NavDropdown.Item>
                  </>
                ) : (
                  <>
                    <Link
                      className="dropdown-item d-flex gap-2 align-items-center "
                      to="/signin"
                    >
                      <CIcon icon={cilArrowCircleRight} />
                      {t("LOGIN", namespaces.SIGN_UP)}
                    </Link>
                    <Link
                      to="/signUp"
                      className="dropdown-item d-flex  gap-2 align-items-center "
                    >
                      <CIcon icon={cilUserPlus} />
                      {t("SIGN_UP", namespaces.SIGN_UP)}
                    </Link>
                  </>
                )}
              </NavDropdown>
            </Nav>
          </div>
          <NavDropdown title={t("LANGUAGE")} id="collasible-nav-dropdown">
            <NavDropdown.Item
              as={Button}
              active={i18n.language === "ar"}
              onClick={() => i18n.changeLanguage("ar")}
              className=" d-flex  gap-2  align-items-center "
            >
              <CIcon icon={cifSa} />
              العربية
            </NavDropdown.Item>
            <NavDropdown.Item
              as={Button}
              active={i18n.language === "en"}
              onClick={() => i18n.changeLanguage("en")}
              className=" d-flex  gap-2  align-items-center "
            >
              <CIcon icon={cifUs} />
              English
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart.data,
  dataLogOut: state.log,
  userSignIn: state.sign ? state.sign : null,
});
const mapDispatchToProps = { logOutHandler };
export default connect(mapStateToProps, mapDispatchToProps)(Header);
