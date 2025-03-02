import i18next from 'i18next';
import { namespaces } from '../i18n';

export const ToastTypes = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
  LIGHT: 'light',
  DARK: 'dark',
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
    let errorMessage = i18next.t('INVALID_PASSWORD', namespaces.SIGN_UP);
    if (!/(?=.*[0-9])/.test(password)) {
      errorMessage += i18next.t('INVALID_NUMBER', namespaces.SIGN_UP);
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errorMessage += i18next.t('INVALID_CAPITAL_LETTER', namespaces.SIGN_UP);
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errorMessage += i18next.t('INVALID_SMALL_LETTER', namespaces.SIGN_UP);
    }
    if (!/(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/.test(password)) {
      errorMessage += i18next.t('INVALID_SPECIAL_CHARACTERS', {
        ns: 'sign-up',
      });
    }
    if (password.length < 8) {
      errorMessage += i18next.t('INVALID_LENGTH', namespaces.SIGN_UP);
    }
    errorMessage = errorMessage.slice(0, -2); // Remove the trailing comma and space
    errorMessage += '.';

    throw errorMessage;
  }
}

export const formatLocalizationKey = (key) => {
  if (typeof key === 'string') {
    return key.toUpperCase().replaceAll(' ', '_');
  }
  return '';
};
