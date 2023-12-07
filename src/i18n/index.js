import signup from "./signup";
import verificationLocalization from "./verification";

const localizations = [
  { ns: "sign-up", source: signup },
  { ns: "verification", source: verificationLocalization },
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
