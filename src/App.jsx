import React, { Suspense, useEffect, useState, lazy } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useTranslation } from "react-i18next";
import "@coreui/coreui/dist/css/coreui.min.css";
import Loader from "./component/common/Loader";
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
import GlobalToast from "./component/common/Toast";
import { getTopStores } from "./store/landingPage";

import { getAllCategories } from "./store/category";
import MobileNavBar from "./component/common/MobileNavBar";
import AuthService from "./services/Auth";
import Page500 from "./pages/page500/500";
import GlobalDialog from "./component/common/Dialog";

const Main = lazy(() => import("./pages/main"));
const Page404 = lazy(() => import("./pages/Page404"));
const Verification = lazy(() => import("./component/verification"));
const Cart = lazy(() => import("./component/cart"));
const Wishlist = lazy(() => import("./component/wishlist"));
const Product = lazy(() => import("./component/product"));
const Products = lazy(() => import("./pages/products/products"));
const Seller = lazy(() => import("./component/seller"));
const Footer = lazy(() => import("./component/common/Footer"));
const Header = lazy(() => import("./component/common/Header"));

const App = ({
  parentCategoryHandler,
  myProfileHandler,
  getCartItemsHandler,
  getItemsHandler,
  getFollowingStores,
  getTopStores,
}) => {
  const { login } = useSelector((state) => state.sign);
  const { i18n } = useTranslation();
  const location = useLocation();
  const [loader, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let token = cookie.load("access_token");
  useEffect(() => {
    const lang = localStorage.getItem("i18nextLng");
    if (lang === "en" || lang === "ar") {
      i18n.changeLanguage(lang);
    } else {
      i18n.changeLanguage("en");
    }
  }, [i18n]);

  const setDefaultHeaders = async () => await ApiService.setDefaultHeaders();

  useEffect(() => {
    setLoading(true);
    Promise.all([AuthService.checkAPI()])
      .then(() => {
        if (location.pathname === "/500") {
          navigate("/");
        }
        setDefaultHeaders().then(() => {
          Promise.all([
            parentCategoryHandler(),
            dispatch(getAllCategories(), getTopStores()),
          ]);
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
          setLoading(false);
        });
      })
      .catch(() => {
        navigate("/500");
        setLoading(false);
      });
  }, [
    dispatch,
    getCartItemsHandler,
    getFollowingStores,
    getItemsHandler,
    getTopStores,
    location.pathname,
    login,
    myProfileHandler,
    navigate,
    parentCategoryHandler,
    token,
  ]);
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

  const WithFooter = ({ Component }) => {
    return (
      <>
        <Component />
        <Footer />
      </>
    );
  };

  if (loader) {
    return <Loader />;
  }

  return (
    <>
      {/* <ThemeProvider> */}
      <GlobalToast />
      <GlobalDialog />
      <div
        className=" position-relative min-h-screen  "
        style={{ maxWidth: "100vw" }}
      >
        <Suspense fallback={<Loader />}>
          <div className=" -mb-lg-5 ">
            <Header />
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<WithFooter Component={Main} />} />
                <Route path="/cart" element={<WithFooter Component={Cart} />} />
                <Route
                  path="/wishlist"
                  element={<WithFooter Component={Wishlist} />}
                />
                <Route
                  path="/products"
                  element={<WithFooter Component={Products} />}
                />
                <Route
                  path="/product/:id"
                  element={<WithFooter Component={Product} />}
                />
                <Route
                  path="/store/:id"
                  element={<WithFooter Component={Seller} />}
                />
                <Route path="/*" element={<AuthRoutes />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/500" element={<Page500 />} />
                <Route path="*" element={<Page404 />} />
              </Routes>
            </Suspense>
          </div>
          <MobileNavBar login={login} />
        </Suspense>
      </div>
      {/* </ThemeProvider> */}
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
