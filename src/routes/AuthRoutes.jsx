import React, { lazy, useEffect } from "react";
import { connect } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import routes from "./routes";
import cookie from "react-cookies";
import { Children } from "react";

const Page404 = lazy(() => import("../pages/Page404"));

export const AuthRoutes = ({ login }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = cookie.load("redirectTo", { path: "/" });
  useEffect(() => {
    routes.find(
      (v) => v.path === location.pathname.toLowerCase() && v.auth !== login
    ) && navigate(login ? path ?? "/" : "/signin");
  }, [login]);
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

const mapStateToProps = (state) => ({
  login: state.sign.login,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AuthRoutes);
