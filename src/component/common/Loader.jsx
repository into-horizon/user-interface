import { CCol, CContainer, CRow } from "@coreui/react";
import React from "react";
import { Rings } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs="auto">
            {/* <Rings height="35rem" width="150" color="blue" /> */}
            {/* <div class="progress">
              <div class="inner"></div>
            </div> */}
            <div class="loader"></div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Loader;
