import React from "react";
import { Button, Nav } from "react-bootstrap";
import CIcon from "@coreui/icons-react";
import {
  cilArrowCircleRight,
  cilCart,
  cilHeart,
  cilLanguage,
  cilSearch,
  cilUser,
} from "@coreui/icons";
import { Link } from "react-router-dom";

import { CTooltip } from "@coreui/react";
import { useTranslation } from "react-i18next";
const MobileNavBar = ({ login }) => {
  const { i18n } = useTranslation();
  return (
    <div
      xs={12}
      className="lg-hide w-100 bg-light position-fixed bottom-0 z-3 "
    >
      <Nav variant="pills">
        <CTooltip content="cart">
          <Nav.Item className="mx-auto">
            <Link className="nav-link btn btn-secondary" to={"/cart"}>
              <CIcon icon={cilCart} size="xl" />
              <br />
              Cart
            </Link>
          </Nav.Item>
        </CTooltip>
        <CTooltip content="wishlist">
          <Nav.Item className="mx-auto">
            <Link className="nav-link btn btn-secondary" to={"/wishlist"}>
              <CIcon icon={cilHeart} size="xl" />
              <br />
              wishlist
            </Link>
          </Nav.Item>
        </CTooltip>
        {login ? (
          <CTooltip content="settings">
            <Nav.Item className="mx-auto">
              <Link className="nav-link btn btn-secondary" to={"/settings"}>
                <CIcon icon={cilUser} size="xl" />
                <br />
                settings
              </Link>
            </Nav.Item>
          </CTooltip>
        ) : (
          <CTooltip content="login">
            <Nav.Item className="mx-auto">
              <Link className="nav-link btn btn-secondary" to={"/signin"}>
                <CIcon icon={cilArrowCircleRight} size="xl" />
                <br />
                login
              </Link>
            </Nav.Item>
          </CTooltip>
        )}
        <CTooltip content="search for a product">
          <Nav.Item className="mx-auto">
            <Link className="nav-link btn btn-secondary" to={"/products"}>
              <CIcon icon={cilSearch} size="xl" />
              <br />
              Search
            </Link>
          </Nav.Item>
        </CTooltip>
        <Nav.Item className="m-auto">
          <Nav.Link
            as={Button}
            onClick={() =>
              i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar")
            }
            className="m-auto"
          >
            <CIcon icon={cilLanguage} size="xl"/>
            <br />  
            {i18n.language === "ar" ? "English" : "عربي"}
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default MobileNavBar;
