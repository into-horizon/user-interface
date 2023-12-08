import { lazy } from "react";

const PlacedOrder = lazy(() => import("../component/PlacedOrder"));
const Settings = lazy(() => import("../pages/settings/Settings"));
const SignInForm = lazy(() => import("../component/SignInForm"));
const SignupForm = lazy(() => import("../component/SignupForm"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Verification = lazy(() => import("../pages/verification/verification"));

export const routes = [
  { path: "/signin", component: SignInForm, exact: true, auth: false },
  { path: "/signUp", component: SignupForm, exact: true, auth: false },
  { path: "/settings/*", component: Settings, exact: true, auth: true },
  { path: "/checkout", component: Checkout, exact: true, auth: true },
  { path: "/successOrder", component: PlacedOrder, exact: true, auth: true },
  { path: "/verification", component: Verification, exact: true, auth: true },
];

const commonRoutes = [
  "/cart",
  "/wishlist",
  "/products",
  "/product/:id",
  "/store/:id",
  "/500",
];
export const authRoutes = routes
  .filter((route) => route.auth)
  .map((route) => route.path)
  // .concat(commonRoutes);
export const unauthRoutes = routes
  .filter((route) => !route.auth)
  .map((route) => route.path)
  // .concat(commonRoutes);
  
export default routes;
