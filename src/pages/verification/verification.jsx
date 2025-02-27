import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkVerificationCode,
  requestVerificationCode,
} from '../../store/auth';
import { useTranslation } from 'react-i18next';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCardTitle,
  CCardFooter,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CRow,
  CSpinner,
} from '@coreui/react';
import { Navigate } from 'react-router-dom';
import Header from '../../component/common/Header';
// import './verification.css';

const Verification = () => {
  const { t } = useTranslation('verification');
  const dispatch = useDispatch();
  const { loading, verificationCodeRequested, user } = useSelector(
    (state) => state.sign
  );
  const handleVerification = async (e) => {
    e.preventDefault();
    dispatch(checkVerificationCode(e.target.code.value));
  };

  useEffect(() => {
    if (!verificationCodeRequested && !user?.client?.verified) {
      dispatch(requestVerificationCode());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verificationCodeRequested]);

  if (user?.client?.verified) {
    return <Navigate to={'/'} />;
  }
  return (
    <div className=' min-vw-100 wrapper bg-light align-items-center justify-content-between   d-flex flex-column'>
      {/* <Header /> */}
      <CContainer className=' m-auto'>
        <CRow className=' justify-content-center align-items-center '>
          <CCol xs={6}>
            <CCard>
              <CCardHeader>
                <CCardTitle>{t('VERIFICATION')}</CCardTitle>
              </CCardHeader>
              <CCardBody>
                <CCardText>
                  <p>{t('VERIFICATION_TEXT')}</p>
                </CCardText>
                <CForm onSubmit={handleVerification} className=' mt-5'>
                  <CInputGroup>
                    <CFormInput
                      name='code'
                      id='code'
                      required
                      placeholder={t('PLEASE_ENTER_CODE')}
                    />
                    <CButton type='submit' disabled={loading}>
                      {loading ? (
                        <CSpinner size='sm' />
                      ) : (
                        t('verify'.toUpperCase())
                      )}
                    </CButton>
                  </CInputGroup>
                </CForm>
              </CCardBody>
              <CCardFooter>
                <CCardText>
                  {t('NEW_CODE_TEXT')}
                  <CButton
                    color='link'
                    onClick={() => dispatch(requestVerificationCode())}
                  >
                    {t('NEW_CODE')}
                  </CButton>
                </CCardText>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Verification;
