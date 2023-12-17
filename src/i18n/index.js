import cartLocalization from "./cart";
import colorLocalization from "./colors";
import globalLocalization from "./global";
import landingPageLocalization from "./landing-page";
import passwordLocalization from "./password";
import productLocalization from "./product";
import signInLocalization from "./sign-in";
import signup from "./signup";
import verificationLocalization from "./verification";
import wishlistLocalization from "./wishlist";

export const namespaces = {
  SIGN_IN: { ns: "sign-in" },
  SIGN_UP: { ns: "sign-up" },
  VERIFICATION: { ns: "verification" },
  GLOBAL: { ns: "global" },
  PASSWORD: { ns: "password" },
  LANDING_PAGE: { ns: "landing-page" },
  PRODUCT: { ns: "product" },
  COLOR: { ns: "color" },
  WISHLIST: { ns: "wishlist" },
  CART: { ns: "cart" },
};

const localizations = [
  { ns: namespaces.SIGN_UP.ns, source: signup },
  { ns: namespaces.VERIFICATION.ns, source: verificationLocalization },
  { ns: namespaces.SIGN_IN.ns, source: signInLocalization },
  { ns: namespaces.GLOBAL.ns, source: globalLocalization },
  { ns: namespaces.PASSWORD.ns, source: passwordLocalization },
  { ns: namespaces.LANDING_PAGE.ns, source: landingPageLocalization },
  { ns: namespaces.PRODUCT.ns, source: productLocalization },
  { ns: namespaces.COLOR.ns, source: colorLocalization },
  { ns: namespaces.WISHLIST.ns, source: wishlistLocalization },
  { ns: namespaces.CART.ns, source: cartLocalization },
];

const ar = "ar";
const en = "en";

const setSources = async (i18n) => {
  localizations.forEach(({ ns, source }) => {
    i18n.addResourceBundle(en, ns, source[en]);
    i18n.addResourceBundle(ar, ns, source[ar]);
  });
};

export default setSources;
