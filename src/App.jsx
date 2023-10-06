import logo from "./logo.svg";
import Form from "./component/Form";
import React, { Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useParams,
  useHistory,
  generatePath,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import SignupForm from "./component/SignupForm";
import SignInForm from "./component/SignInForm";
import Verification from "./component/verification";
import Home from "./component/Home";
import Header from "./component/header";
import Main from "./pages/main";
import Page404 from "./pages/Page404";
import PageInvalidToken from "./pages/pageInvalidtoken";
import Footer from "./component/footer";
import Cart from "./component/cart";
import Wishlist from "./component/wishlist";
import Product from "./component/product";
import Settings from "./component/Settings";
import Products from "./component/products/products";
import Account from "./component/account/account";
import Address from "./component/address/address";
import Email from "./component/email/changeEmail";
import Notification from "./component/notification/notification";
import { useTranslation } from "react-i18next";
import { Rings } from "react-loader-spinner";
import "@coreui/coreui/dist/css/coreui.min.css";
import Loader from "./component/loader";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Seller from "./component/seller";
import { parentCategoryHandler } from "./store/parent";
import { connect, useDispatch } from "react-redux";
import UnAuthRoutes from "./routes/UnAuthRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import cookie from "react-cookies";
import { myProfileHandler } from "./store/auth";
import { useSelector } from "react-redux";
import { getCartItemsHandler, resetCartItems } from "./store/cart";
import { getItemsHandler, resetWishlist } from "./store/wishlist";
import { myAddressHandler } from "./store/address";
import { getFollowingStores } from "./store/following";
import ApiService from "./services/ApiService";

function App({
  parentCategoryHandler,
  myProfileHandler,
  getCartItemsHandler,
  getItemsHandler,
  myAddressHandler,
  getFollowingStores,
}) {
  const { login } = useSelector((state) => state.sign);
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const [loader, setLoading] = useState(true);
  const dispatch = useDispatch();
  let token = cookie.load("access_token");
  let path = cookie.load("redirectTo", { path: "/" });
  useEffect(() => {
    Promise.all([parentCategoryHandler(), token && myProfileHandler()])
      .then(([q, p]) => {})
      .finally(() => setLoading(false));
    const lang = localStorage.getItem("i18nextLng");
    if (lang === "en" || lang === "ar") {
      i18n.changeLanguage(lang);
    } else {
      i18n.changeLanguage("en");
    }
  }, []);
  useEffect(() => {
    (async () => await ApiService.setDefaultHeaders())().then(() => {
      if (login) {
        Promise.all([
          getCartItemsHandler(),
          getItemsHandler(),
          myAddressHandler(),
          getFollowingStores(),
          myProfileHandler(),
        ]);
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
  return (
    <div className="body">
      {loader ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10% 0",
          }}
        >
          <Rings height="30rem" width="50rem" color="blue" />
        </div>
      ) : (
        <div>
          <Header />
          <Switch>
            <Route exact path="/">
              <Main />
            </Route>
            <Route exact path="/pageInvalidToken">
              <PageInvalidToken />
            </Route>
            {/* <AuthRoutes />
            <UnAuthRoutes /> */}
            {/* <Route exact path='/signup' >
            <SignupForm />
            </Route>

            <Route exact path='/signIn'>
            <SignInForm />
            
          </Route> */}
            {/* <Route exact path='/settings'>
              <Settings />
              
            </Route> */}
            {/* <Route path='/settings/account'>
            <Settings />
            
            
            </Route>
            <Route exact path='/settings/email'>
            <Settings />
            
            </Route>
            <Route exact path='/settings/password'>
            <Settings />
            
            </Route>
            <Route exact path='/settings/notification'>
            <Settings />
            
            </Route>
            <Route exact path='/settings/address'>
            
            <Settings />
            
          </Route> */}
            <Route exact path="/verification">
              <Verification />
            </Route>

            <Route exact path="/cart">
              <Cart />
            </Route>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/wishlist">
              <Wishlist />
            </Route>
            <Route exact path={`/products`}>
              <Products />
            </Route>
            <Route exact path="/product/:id">
              <Product />
            </Route>
            <Route exact path="/store/:id" component={Seller} />
            <Route path="/" render={(props) => <AuthRoutes {...props} />} />
            <Route path="*">
              <Page404 />
            </Route>
          </Switch>

          <Route path="/loader">
            <Loader />
          </Route>
          <Footer />
        </div>
      )}
    </div>
  );
}
const mapDispatchToProps = {
  parentCategoryHandler,
  myProfileHandler,
  getCartItemsHandler,
  getItemsHandler,
  myAddressHandler,
  getFollowingStores,
};
export default connect(null, mapDispatchToProps)(App);
// export default App;
