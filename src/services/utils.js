import i18next from "i18next";

export const ToastTypes = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  SUCCESS: "success",
  DANGER: "danger",
  WARNING: "warning",
  INFO: "info",
  LIGHT: "light",
  DARK: "dark",
};

export function validatePassword(password) {
  // Regular expression to check if the password meets the criteria
  const regex =
    /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;

  // Test the password against the regular expression
  if (regex.test(password)) {
    return true;
  } else {
    // Generate an error message based on the specific missing criteria
    let errorMessage = i18next.t("INVALID_PASSWORD", { ns: "sign-up" });
    if (!/(?=.*[0-9])/.test(password)) {
      errorMessage += i18next.t("INVALID_NUMBER", { ns: "sign-up" });
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errorMessage += i18next.t("INVALID_CAPITAL_LETTER", { ns: "sign-up" });
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errorMessage += i18next.t("INVALID_SMALL_LETTER", { ns: "sign-up" });
    }
    if (!/(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/.test(password)) {
      errorMessage += i18next.t("INVALID_SPECIAL_CHARACTERS", {
        ns: "sign-up",
      });
    }
    if (password.length < 8) {
      errorMessage += i18next.t("INVALID_LENGTH", { ns: "sign-up" });
    }
    errorMessage = errorMessage.slice(0, -2); // Remove the trailing comma and space
    errorMessage += ".";

    throw errorMessage;
  }
}
