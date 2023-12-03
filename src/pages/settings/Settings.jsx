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
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { myProfileHandler } from "../../store/auth";
import { Col, Row, Spinner } from "react-bootstrap";
import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilUser, cilMap, cilNotes, cilTruck } from "@coreui/icons";
import Loader from "../../component/common/Loader";
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
    sidebar: "account!",
    main: Account,
    icon: cilUser,
  },
  {
    path: "/address",
    exact: true,
    sidebar: "address!",
    main: Address,
    icon: cilMap,
  },
  {
    path: "/notification",
    exact: true,
    sidebar: "notification!",
    main: Notification,
    icon: cilNotes,
  },

  {
    path: "/orders",
    exact: true,
    sidebar: "Orders",
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
  const hideSidebar = useCallback(() => {
    width < 700 && setShow(false);
  }, [width]);

  useEffect(() => {
    width < 1000 && setNarrow(true);
  }, [width]);
  return (
    <Fragment>
      <CSidebar narrow={narrow} visible={show} onHide={hideSidebar}>
        <CSidebarBrand className="bg-primary border-top border-light">
          Settings
        </CSidebarBrand>
        <CSidebarNav className="bg-light">
          {Children.toArray(
            routes.map((route) =>
              route.secondary ? null : (
                <li className="nav-item">
                  <Link className="nav-link" to={`/settings${route.path}`}>
                    <CIcon customClassName="nav-icon" icon={route.icon} />
                    {route.sidebar}
                  </Link>
                </li>
              )
            )
          )}
        </CSidebarNav>

        <CSidebarToggler
          className="bg-primary position-relative"
          onClick={() => setNarrow(!narrow)}
        />
      </CSidebar>
    </Fragment>
  );
};
const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [show, setShow] = useState(true);
  const location = useLocation();
  useEffect(() => {
    if (windowWidth < 1000) {
    } else {
    }
  }, [windowWidth]);
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
    <Row className="justify-content-start">
      {!show && (
        <CButton
          color="info"
          className=" position-relative"
          onClick={() => setShow(true)}
        >
          Settings Menu
        </CButton>
      )}
      <Col xs={"auto"}>
        <SideNavbar show={show} setShow={setShow} width={windowWidth} />
      </Col>
      <Col lg={6} md={9} className="m-3">
        {loading && <Spinner animation="border" />}
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
          <Navigate to="/settings/account" />
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
