import React, { lazy, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import routes from "./routes";
import cookie from "react-cookies";
import { Children } from "react";
import { requestVerificationCode } from "../store/auth";

const Page404 = lazy(() => import("../pages/Page404"));

export const AuthRoutes = ({ login }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.sign);
  const path = cookie.load("redirectTo", { path: "/" });
  useEffect(() => {
    if (login && !user?.verified) {
      dispatch(requestVerificationCode());
      navigate("/verification");
    } else if (
      routes.find(
        (v) =>
          (v.path === location.pathname.toLowerCase() && v.auth !== login) ||
          (v.path.toLowerCase() === "/signup" && login)
      )
    ) {
      if (login) {
        if (location.pathname === "/settings") {
          navigate("settings/account");
        } else {
          navigate(path ?? location.pathname);
        }
      } else {
        navigate("/signin");
      }
    }
  }, [location.pathname, login, navigate, path, user?.verified]);
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
