import React, { lazy } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import routes from "./routes";
import { Children } from "react";

const Page404 = lazy(() => import("../pages/Page404"));

export const AuthRoutes = () => {
  const { login } = useSelector((state) => state.sign);
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
