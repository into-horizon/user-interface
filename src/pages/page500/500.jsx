import { cilSad } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardTitle,
  CCol,
  CContainer,
  CRow,
} from '@coreui/react';
import React from 'react';

const Page500 = () => {
  return (
    <div className='bg-light min-vh-100 d-flex flex-row align-items-center '>
      <CContainer className=' h-100'>
        <CRow className=' justify-content-center  align-content-center h-100 '>
          <CCol xs={12} md={8} lg={6}>
            <CCard className='h-100'>
              <CCardHeader>
                <CCardTitle>500 Error: Internal Server Error.</CCardTitle>
              </CCardHeader>
              <CCardBody>
                <h5 className=' text-danger  text-center my-4'>
                  <CIcon icon={cilSad} size='xxl' className='mx-3' />
                  platform under maintenance
                  <CIcon icon={cilSad} size='xxl' className='mx-3' />
                </h5>
                <CCardFooter className=' d-flex '>
                  <CButton
                    className='mx-auto mt-3 '
                    onClick={() => window.location.reload()}
                  >
                    Reload
                  </CButton>
                </CCardFooter>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Page500;
