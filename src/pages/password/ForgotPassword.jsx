import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardTitle,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
} from "@coreui/react";
import React from "react";

function ForgotPassword() {
  return (
    <div className="wrapper justify-content-center  align-content-center ">
      <CContainer>
        <CRow>
          <CCol md={12}>
            <CCard>
              <CCardHeader>
                <CCardTitle></CCardTitle>
              </CCardHeader>
              <CCardBody>
                <CForm>
                  <CRow>
                    <CCol xs="12">
                      <CFormInput />
                    </CCol>
                    <CCol xs="12">
                      <CFormInput />
                    </CCol>
                    <CCol xs="12">
                      <CButton type="submit"></CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
              <CCardFooter></CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}

export default ForgotPassword;
