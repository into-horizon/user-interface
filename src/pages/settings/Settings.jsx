import React, {
  useState,
  useEffect,
  Children,
  useCallback,
  Fragment,
  lazy,
  Suspense,
} from "react";
import { connect } from "react-redux";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { myProfileHandler } from "../../store/auth";
import { Col, Row } from "react-bootstrap";
import { CSidebar, CSidebarBrand, CSidebarNav, CButton } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilUser,
  cilMap,
  cilNotes,
  cilTruck,
  cilExpandLeft,
  cilExpandRight,
} from "@coreui/icons";
import Loader from "../../component/common/Loader";
import { useTranslation } from "react-i18next";
import { namespaces } from "../../i18n";
const Account = lazy(() => import("./components/account/account"));
const Address = lazy(() => import("./components/address/address"));
const Orders = lazy(() => import("./components/Orders/Orders"));
const Notification = lazy(() =>
  import("./components/notification/notification")
);
const OrdersDetails = lazy(() => import("./components/Orders/OrdersDetails"));

const routes = [
  {
    path: "/account",
    exact: true,
    sidebar: "ACCOUNT",
    main: Account,
    icon: cilUser,
  },
  {
    path: "/address",
    exact: true,
    sidebar: "ADDRESSES",
    main: Address,
    icon: cilMap,
  },
  {
    path: "/notification",
    exact: true,
    sidebar: "NOTIFICATIONS",
    main: Notification,
    icon: cilNotes,
  },

  {
    path: "/orders",
    exact: true,
    sidebar: "ORDERS",
    main: Orders,
    icon: cilTruck,
  },
  {
    path: "/orderItems/:id",
    exact: true,
    sidebar: "Orders details",
    main: OrdersDetails,
    secondary: true,
  },
];
export const SideNavbar = ({ show, setShow, width }) => {
  const [narrow, setNarrow] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation([namespaces.SETTINGS.ns]);
  const navigate = useNavigate();
  const [icon, setIcon] = useState(cilExpandLeft);
  const [iconPosition, setIconPosition] = useState("text-end");
  const hideSidebar = useCallback(() => {
    width < 700 && setShow(false);
  }, [setShow, width]);

  useEffect(() => {
    width < 1000 && setNarrow(true);
  }, [width]);
  useEffect(() => {
    if (location.pathname === "/settings") {
      navigate("/settings/account");
    }
  }, [location.pathname, navigate]);
  useEffect(() => {
    if (
      (narrow && i18n.language === "ar") ||
      (!narrow && i18n.language === "en")
    ) {
      setIcon(cilExpandLeft);
    } else setIcon(cilExpandRight);
    if (narrow) {
      setIconPosition("text-center");
    } else if (i18n.language === "ar") {
      setIconPosition("text-start");
    } else if (i18n.language === "en") {
      setIconPosition("text-end");
    }
  }, [narrow, i18n.language]);
  return (
    <Fragment>
      <CSidebar narrow={narrow} visible={show} onHide={hideSidebar}>
        <CSidebarBrand className="bg-primary border-top border-light">
          {t("SETTINGS")}
        </CSidebarBrand>
        <CSidebarNav className="bg-light">
          {Children.toArray(
            routes.map((route) =>
              route.secondary ? null : (
                <li className="nav-item">
                  <Link className="nav-link" to={`/settings${route.path}`}>
                    <CIcon
                      customClassName="nav-icon"
                      icon={route.icon}
                      className="mx-auto"
                    />
                    {t(route.sidebar)}
                  </Link>
                </li>
              )
            )
          )}
        </CSidebarNav>

        <CButton
          className={`rounded-0 bg-primary  position-relative p-2 ${iconPosition}`}
          onClick={() => setNarrow(!narrow)}
        >
          <CIcon
            icon={icon}
            size="xl"
            className=" mx-0 "
            style={{ "--ci-primary-color": "#fff" }}
          />
        </CButton>
      </CSidebar>
    </Fragment>
  );
};
const Settings = () => {
  const { t } = useTranslation([namespaces.SETTINGS.ns]);
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [show, setShow] = useState(true);
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <Row className="justify-content-start w-100 ">
      {!show && (
        <CButton
          color="info"
          className=" position-relative"
          onClick={() => setShow(true)}
        >
          {t("SETTINGS_MENU")}
        </CButton>
      )}
      <Col xs={"auto"}>
        <SideNavbar show={show} setShow={setShow} width={windowWidth} />
      </Col>
      <Col lg={6} md={9} sm={11} xs={12} className="m-3">
        <Suspense fallback={<Loader />}>
          <Routes>
            {Children.toArray(
              routes.map((route) => (
                <Route path={route.path} element={<route.main />} />
              ))
            )}
          </Routes>
        </Suspense>
        {location.pathname === "/settings" && (
          <Navigate to={"/settings/account"} />
        )}
      </Col>
    </Row>
  );
};

const mapStateToProps = (state) => ({
  profileData: state.sign ? state.sign : null,
});

const mapDispatchToProps = { myProfileHandler };

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
