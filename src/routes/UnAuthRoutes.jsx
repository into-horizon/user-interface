import React from "react";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
import routes from "./routes";
export const UnAuthRoutes = ({  match: { url } }) => {
  const { login } = useSelector((state) => state.sign);
  return (
    <>
      {!login &&
        routes
          .filter((r) => !r.auth)
          .map((route, i) => {
            console.log(route);
            return (
              <Route
                key={`route${i}`}
                path={route.path}
                component={route.component}
                exact={route.exact}
              />
            );
          })}
    </>
  );
};

export default (UnAuthRoutes);
