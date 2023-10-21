import React, { Suspense, useEffect, useState, lazy } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Home from "./component/Home";
import { useTranslation } from "react-i18next";
import "@coreui/coreui/dist/css/coreui.min.css";
import Loader from "./component/loader";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
// import Seller from "./component/seller";
import { parentCategoryHandler } from "./store/parent";
import { connect, useDispatch } from "react-redux";
import AuthRoutes from "./routes/AuthRoutes";
import cookie from "react-cookies";
import { myProfileHandler } from "./store/auth";
import { useSelector } from "react-redux";
import { getCartItemsHandler, resetCartItems } from "./store/cart";
import { getItemsHandler, resetWishlist } from "./store/wishlist";
import { myAddressHandler } from "./store/address";
import { getFollowingStores } from "./store/following";
import ApiService from "./services/ApiService";
import Toast from "./component/Toast";
import GlobalToast from "./component/Toast";
import { getTopStores } from "./store/landingPage";
import { Button, Nav } from "react-bootstrap";
import CIcon from "@coreui/icons-react";
import {
  cilArrowCircleRight,
  cilCart,
  cilHeart,
  cilSearch,
  cilUser,
} from "@coreui/icons";
import { CTooltip } from "@coreui/react";

const Main = lazy(() => import("./pages/main"));
const Page404 = lazy(() => import("./pages/Page404"));
const Verification = lazy(() => import("./component/verification"));
const Cart = lazy(() => import("./component/cart"));
const Wishlist = lazy(() => import("./component/wishlist"));
const Product = lazy(() => import("./component/product"));
const Products = lazy(() => import("./component/products/products"));
const Seller = lazy(() => import("./component/seller"));
const Footer = lazy(() => import("./component/footer"));
const Header = lazy(() => import("./component/header"));

const App = ({
  parentCategoryHandler,
  myProfileHandler,
  getCartItemsHandler,
  getItemsHandler,
  getFollowingStores,
  getTopStores,
}) => {
  const { login } = useSelector((state) => state.sign);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [loader, setLoading] = useState(true);
  const dispatch = useDispatch();
  let token = cookie.load("access_token");
  let path = cookie.load("redirectTo", { path: "/" });
  useEffect(() => {
    Promise.all([parentCategoryHandler()]).finally(() => setLoading(false));
    const lang = localStorage.getItem("i18nextLng");
    if (lang === "en" || lang === "ar") {
      i18n.changeLanguage(lang);
    } else {
      i18n.changeLanguage("en");
    }
    getTopStores();
  }, []);
  const setDefaultHeaders = async () => await ApiService.setDefaultHeaders();

  useEffect(() => {
    setDefaultHeaders().then(() => {
      if (login) {
        Promise.all([
          getCartItemsHandler(),
          getItemsHandler(),
          dispatch(myAddressHandler({ limit: 5, offset: 0 })),
          getFollowingStores(),
          myProfileHandler(),
        ]);
      } else if (token && !login) {
        myProfileHandler();
      } else {
        dispatch(resetCartItems(cookie.load("cart") ?? []));
        dispatch(resetWishlist(cookie.load("wishlist") ?? []));
      }
    });
  }, [login]);
  useEffect(() => {
    if (i18n.language === "en") {
      document.documentElement.setAttribute("lang", "en");
      document.documentElement.setAttribute("dir", "ltl");
    } else if (i18n.language === "ar") {
      document.documentElement.setAttribute("lang", "ar");
      document.documentElement.setAttribute("dir", "rtl");
    }
  }, [i18n.language]);
  useEffect(() => {
    setDefaultHeaders();
  }, [location.pathname]);
  return (
    <>
      <GlobalToast />
      {loader ? (
        <Loader />
      ) : (
        <>
          <Suspense fallback={<Loader />}>
            <Header />
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/home" element={<Home />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/store/:id" element={<Seller />} />
                <Route path="/*" element={<AuthRoutes />} />
                <Route path="*" element={<Page404 />} />
              </Routes>
            </Suspense>
            <div
              xs={12}
              style={{ zIndex: 100 }}
              className="lg-hide w-100 bg-light position-fixed bottom-0"
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
                    <Link
                      className="nav-link btn btn-secondary"
                      to={"/wishlist"}
                    >
                      <CIcon icon={cilHeart} size="xl" />
                    <br />
                    wishlist
                    </Link>
                  </Nav.Item>
                </CTooltip>
                {login ? (
                  <CTooltip content="settings">
                    <Nav.Item className="mx-auto">
                      <Link
                        className="nav-link btn btn-secondary"
                        to={"/settings"}
                      >
                        <CIcon icon={cilUser} size="xl" />
                        <br />
                        settings
                      </Link>
                    </Nav.Item>
                  </CTooltip>
                ) : (
                  <CTooltip content="login">
                    <Nav.Item className="mx-auto">
                      <Link
                        className="nav-link btn btn-secondary"
                        to={"/signin"}
                      >
                        <CIcon icon={cilArrowCircleRight} size="xl" />
                        <br />
                        login
                      </Link>
                    </Nav.Item>
                  </CTooltip>
                )}
                <CTooltip content="search for a product">
                  <Nav.Item className="mx-auto">
                    <Link
                      className="nav-link btn btn-secondary"
                      to={"/products"}
                    >
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
                    {i18n.language === "ar" ? "English" : "عربي"}
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            <Footer />
          </Suspense>
        </>
      )}
    </>
  );
};
const mapDispatchToProps = {
  parentCategoryHandler,
  myProfileHandler,
  getCartItemsHandler,
  getItemsHandler,
  getFollowingStores,
  getTopStores,
};
export default connect(null, mapDispatchToProps)(App);
// export default App;
