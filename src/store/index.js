import thunk from "redux-thunk";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { applyMiddleware } from "redux";

import auth from "./auth";
import address from "./address";
import parent from "./parent";
import product from "./products";
import signInWithGoogle from "./google";
import authProvider from "./authProvider";
import signInWithFacebook from "./facebook";
import cart from "./cart";
import wishlist from "./wishlist";
import discount from "./discount";
import order from "./order";
import follow from "./following";
// import account from './auth';
import toast from "./toast";
import dialog from "./dialog";
import landingPage from "./landingPage";
import category from "./category";
let reducers = combineReducers({
  sign: auth,
  address: address,
  parent: parent,
  products: product,
  google: signInWithGoogle,
  provider: authProvider,
  facebook: signInWithFacebook,
  cart: cart,
  wishlist: wishlist,
  discount: discount,
  order: order,
  follow: follow,
  toast,
  dialog,
  landingPage,
  category,
});

let store = configureStore({ reducer: reducers }, applyMiddleware(thunk));

export default store;
