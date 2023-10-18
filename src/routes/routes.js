import { lazy } from "react";

const PlacedOrder = lazy(() => import("../component/PlacedOrder"));
const Settings = lazy(() => import("../pages/settings/Settings"));
const SignInForm = lazy(() => import("../component/SignInForm"));
const SignupForm = lazy(() => import("../component/SignupForm"));
const Checkout = lazy(() => import("../pages/Checkout"));

export const routes = [
  { path: "/signin", component: SignInForm, exact: true, auth: false },
  { path: "/signUp", component: SignupForm, exact: true, auth: false },
  { path: "/settings/*", component: Settings, exact: true, auth: true },
  { path: "/checkout", component: Checkout, exact: true, auth: true },
  { path: "/successOrder", component: PlacedOrder, exact: true, auth: true },
];

export default routes;
