import React, { Suspense } from "react";
import "./index.css";
import App from "./App";
import store from "./store/";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import "./i18next";
import reportWebVitals from "./reportWebVitals";
import Loader from "./component/common/Loader";
import { PopupProvider } from "react-custom-popup";
import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <Suspense fallback={<Loader />}>
      <PopupProvider>
        <Router>
          <App />
        </Router>
      </PopupProvider>
    </Suspense>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
