import React, { useEffect, useState } from "react";
import { logOutHandler } from "../../store/auth";
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CBadge, CListGroup, CListGroupItem } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBell, cilHeart, cilCart, cilUser } from "@coreui/icons";

const Header = (props) => {
  const login = useSelector((state) => state.sign.login);
  const navigate = useNavigate();
  const { cart } = props;
  const [displayList, setDisplayList] = useState(false);
  const { t, i18n } = useTranslation();
  const [style, setStyle] = useState({});

  useEffect(() => {
    let x = window.innerWidth;
    if (x < 553) {
      setStyle({ display: "none" });
    }
  }, []);

  const changeLanguage = (lang) => {
    if (lang === "en") {
      i18n.changeLanguage(lang);
      document.documentElement.setAttribute("lang", "en");
      document.documentElement.setAttribute("dir", "ltl");
    } else {
      i18n.changeLanguage(lang);
      document.documentElement.setAttribute("lang", "ar");
      document.documentElement.setAttribute("dir", "rtl");
    }
  };
  const logOutHandle = () => {
    props.logOutHandler();
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
    <Navbar bg="primary" variant="dark" className="pt-3 w-100 ">
      <Container>
        <Navbar.Brand>
          <Link to="/" className="nav-link">
            <span className="logo">Horizon</span>
          </Link>
        </Navbar.Brand>
        <Nav className="lg-show">
          <div className="links" style={style}>
            <Nav>
              <Link to="/wishlist" className="nav-link " key="wishlist">
                {/* <<img className="fav" src={Fav} alt="fav" />> */}
                <CIcon icon={cilHeart} size="xxl" className="my-auto" />
              </Link>

              {login && (
                <Nav.Link
                  as={"div"}
                  className="nav-link position-relative px-0 mx-2 pointer "
                  key="notification"
                  onClick={() => setDisplayList((x) => !x)}
                >
                  <CIcon icon={cilBell} size="xxl" className="" />
                  <CBadge
                    color="danger"
                    position="top-end"
                    shape="rounded-pill"
                  >
                    9 <span className="visually-hidden">unread messages</span>
                  </CBadge>

                  {displayList && (
                    <CListGroup
                      style={{ width: "16rem !important" }}
                      className="position-absolute notifications-list"
                    >
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
                  style={{ position: "absolute", top: -10, right: "22%" }}
                >
                  <h6>
                    {cart.reduce((x, y) => {
                      return x + y.quantity;
                    }, 0)}
                  </h6>
                </CBadge>
              </Link>

              <NavDropdown
                id="collasible-nav-dropdown2"
                title={<CIcon icon={cilUser} size="xxl" />}
              >
                {login ? (
                  <>
                    <Link to="/settings" className="dropdown-item">
                      settings
                    </Link>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logOutHandle}>
                      Log Out
                    </NavDropdown.Item>
                  </>
                ) : (
                  <>
                    <Link to="/signUp" className="dropdown-item">
                      Sign Up
                    </Link>
                    <Link className="dropdown-item" to="/verification">
                      verification
                    </Link>
                    <Link className="dropdown-item" to="/signin">
                      Sign In
                    </Link>
                  </>
                )}
              </NavDropdown>
            </Nav>
          </div>
          <NavDropdown title={t("lan")} id="collasible-nav-dropdown">
            <NavDropdown.Item
              as={Button}
              active={i18n.language === "ar"}
              onClick={() => changeLanguage("ar")}
            >
              العربية
            </NavDropdown.Item>
            <NavDropdown.Item
              as={Button}
              active={i18n.language === "en"}
              onClick={() => changeLanguage("en")}
            >
              English
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  dataLogOut: state.log,
  userSignIn: state.sign ? state.sign : null,
});
const mapDispatchToProps = { logOutHandler };
export default connect(mapStateToProps, mapDispatchToProps)(Header);
