import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import routes from "./routes";
export const UnAuthRoutes = ({ login, match: { url } }) => {
  console.log(
    "🚀 ~ file: UnAuthRoutes.jsx ~ line 6 ~ UnAuthRoutes ~ login",
    login
  );
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

const mapStateToProps = (state) => ({
  login: state.sign.login,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UnAuthRoutes);
