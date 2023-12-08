import React, { lazy, useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import routes from "./routes";
import cookie from "react-cookies";
import { Children } from "react";

const Page404 = lazy(() => import("../pages/Page404"));

export const AuthRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useSelector((state) => state.sign);
  const path = cookie.load("redirectTo", { path: "/" });
  // useEffect(() => {
  //   if (
  //     login &&
  //     !!routes.find(
  //       (v) => v.path === location.pathname.toLowerCase() && v.auth !== login
  //     )
  //   ) {
  //     if (user?.id && user?.verified && location.pathname === "/verification") {
  //       navigate("/");
  //     } else {
  //       navigate("/");
  //     }
  //   } else if (user?.id && !user?.verified) {
  //     navigate("/verification");
  //   } else if (
  //     !login &&
  //     !!routes.find(
  //       (v) => v.path === location.pathname.toLowerCase() && v.auth !== login
  //     )
  //   ) {
  //     navigate("/");
  //   }
  //   console.log(
  //     "🚀 ~ file: AuthRoutes.jsx:28 ~ useEffect ~ user?.id && !user?.verified:",
  //     user?.id && !user?.verified
  //   );
  // }, [location.pathname, login, navigate, path, user?.id, user?.verified]);
  return (
    <Routes>
      {Children.toArray(
        routes.map(
          (route) =>
            login === route.auth && (
              <Route path={route.path} element={<route.component />} />
            )
        )
      )}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default AuthRoutes;
