import { CFormInput } from "@coreui/react";
import { IMaskMixin } from "react-imask";

const CFormInputWithMask = IMaskMixin(({ inputRef, ...props }) => (
  <CFormInput {...props} ref={inputRef} />
));

export default CFormInputWithMask;
