import React, { Suspense, useEffect, lazy, Children } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from 'react-router-dom';
// import "bootstrap/dist/css/bootstrap.min.css";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useTranslation } from 'react-i18next';
import '@coreui/coreui/dist/css/coreui.min.css';
import Loader from './component/common/Loader';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
// import Seller from "./component/seller";
import { parentCategoryHandler } from './store/parent';
import { connect, useDispatch } from 'react-redux';
import AuthRoutes from './routes/AuthRoutes';
import cookie from 'react-cookies';
import { myProfileHandler, stopLoading } from './store/auth';
import { useSelector } from 'react-redux';
import { getCartItemsHandler, resetCartItems } from './store/cart';
import {
  getItemsHandler,
  getWishlistItemsIds,
  resetWishlist,
} from './store/wishlist';
import { myAddressHandler } from './store/address';
import { getFollowingStores } from './store/following';
import GlobalToast from './component/common/Toast';
import { getTopStores } from './store/landingPage';

import { getAllCategories, getLandingPageCategories } from './store/category';
import MobileNavBar from './component/common/MobileNavBar';
import AuthService from './services/Auth';
import Page500 from './pages/page500/500';
import GlobalDialog from './component/common/Dialog';
import SettingsLayout from './layouts/SettingsLayout';
import Verification from './pages/verification/verification';

const Main = lazy(() => import('./pages/main'));
const Page404 = lazy(() => import('./pages/Page404'));
const Cart = lazy(() => import('./component/cart'));
const Wishlist = lazy(() => import('./component/wishlist'));
const Product = lazy(() => import('./component/product'));
const Products = lazy(() => import('./pages/products/products'));
const Seller = lazy(() => import('./component/seller'));
const SignInForm = lazy(() => import('./component/SignInForm'));
const SignupForm = lazy(() => import('./component/SignupForm'));
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const AuthLayout = lazy(() => import('./layouts/AuthLayout'));
const Account = lazy(() =>
  import('./pages/settings/components/account/account')
);
const Address = lazy(() =>
  import('./pages/settings/components/address/address')
);
const Notification = lazy(() =>
  import('./pages/settings/components/notification/notification')
);
const Orders = lazy(() => import('./pages/settings/components/Orders/Orders'));
const OrdersDetails = lazy(() =>
  import('./pages/settings/components/Orders/OrdersDetails')
);

const App = ({
  parentCategoryHandler,
  getCartItemsHandler,
  getFollowingStores,
  getTopStores,
}) => {
  const { login, globalLoading, user } = useSelector((state) => state.sign);
  const { i18n } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let token = cookie.load('access_token');
  useEffect(() => {
    const lang = localStorage.getItem('i18nextLng');
    if (lang === 'en' || lang === 'ar') {
      i18n.changeLanguage(lang);
    } else {
      i18n.changeLanguage('en');
    }
  }, [i18n]);

  useEffect(
    () => {
      // setLoading(true);
      Promise.all([AuthService.checkAPI()])
        .then(() => {
          if (location.pathname === '/500') {
            navigate('/');
          }
          Promise.all([
            parentCategoryHandler(),
            dispatch(
              getAllCategories(),
              getTopStores(),
              dispatch(getLandingPageCategories())
            ),
          ]);
          if (login) {
            Promise.all([
              getCartItemsHandler(),
              dispatch(getWishlistItemsIds()),
              // dispatch(myAddressHandler({ limit: 5, offset: 0 })),
              getFollowingStores(),
            ]);
          } else if (token && !login) {
            dispatch(myProfileHandler());
          } else if (!token) {
            dispatch(stopLoading());
          } else {
            dispatch(resetCartItems(cookie.load('cart') ?? []));
            dispatch(resetWishlist(cookie.load('wishlist') ?? []));
          }
        })
        .catch(() => {
          navigate('/500');
          dispatch(stopLoading());
        });
      // .finally(() => setLoading(false));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // dispatch,
      // getCartItemsHandler,
      // getFollowingStores,
      // getItemsHandler,
      // getTopStores,
      login,
      // navigate,
      // parentCategoryHandler,
      // token,
    ]
  );
  useEffect(() => {
    if (i18n.language === 'en') {
      document.documentElement.setAttribute('lang', 'en');
      document.documentElement.setAttribute('dir', 'ltl');
    } else if (i18n.language === 'ar') {
      document.documentElement.setAttribute('lang', 'ar');
      document.documentElement.setAttribute('dir', 'rtl');
    }
  }, [i18n.language]);
  useEffect(() => {
    if (token && !login) return;
    if (login && !user?.verified) {
      navigate('/verification');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, login, user?.verified]);

  if (globalLoading) {
    return <Loader />;
  }

  return (
    <>
      <GlobalToast />
      <GlobalDialog />
      <div
        className=' position-relative min-vh-100   '
        style={{ maxWidth: '100vw' }}
      >
        <Suspense fallback={<Loader />}>
          <div className='-mb-lg-5 '>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path='/' element={<MainLayout />}>
                  <Route index element={<Main />} />
                  <Route path='cart' element={<Cart />} />
                  <Route path='wishlist' element={<Wishlist />} />
                  <Route path='products' element={<Products />} />
                  <Route path='product/:id' element={<Product />} />
                  <Route path='store/:id' element={<Seller />} />
                </Route>
                <Route path='/verification' element={<Verification />} />
                <Route path='settings' element={<SettingsLayout />}>
                  <Route index element={<Navigate to='account' replace />} />
                  <Route path='account' element={<Account />} />
                  <Route path='address' element={<Address />} />
                  <Route path='notification' element={<Notification />} />
                  <Route path='orders' element={<Orders />} />
                  <Route path='orderItems/:id' element={<OrdersDetails />} />
                </Route>
                <Route path='/' element={<AuthLayout />}>
                  <Route path='signin' element={<SignInForm />} />
                  <Route path='signUp' element={<SignupForm />} />
                </Route>
                <Route path='/500' element={<Page500 />} />
                <Route path='*' element={<Page404 />} />
              </Routes>
            </Suspense>
          </div>
          <MobileNavBar login={login} />
        </Suspense>
      </div>
    </>
  );
};
const mapDispatchToProps = {
  parentCategoryHandler,
  getCartItemsHandler,
  getItemsHandler,
  getFollowingStores,
  getTopStores,
};
export default connect(null, mapDispatchToProps)(App);
// export default App;
