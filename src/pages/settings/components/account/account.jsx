import React, { Children, useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
  updateProfileHandler,
  updatePictureHandler,
  deactivateProfileHandler,
  changePasswordHandler,
  deleteProfilePicture,
} from '../../../../store/auth';
import { Button, Row, Form, Col, Accordion } from 'react-bootstrap';
import { usePopup } from 'react-custom-popup';
import ChangeEmail from './changeEmail';
import CIcon from '@coreui/icons-react';
import { cilCloudUpload } from '@coreui/icons';
import DeleteModal from '../../../../component/common/DeleteModal';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
  CFormInput,
  CFormSelect,
  CFormText,
  CInputGroup,
  CRow,
  CSpinner,
} from '@coreui/react';
import { State } from 'country-state-city';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { validatePassword } from '../../../../services/utils';

const Account = () => {
  const {
    loading,
    user: { first_name, last_name, city, profile_picture },
  } = useSelector((state) => state.sign);
  // const navigate = useNavigate();
  const { t, i18n } = useTranslation([
    namespaces.SETTINGS.ns,
    namespaces.SIGN_UP.ns,
    namespaces.GLOBAL.ns,
  ]);
  const { showOptionDialog } = usePopup();
  const dispatch = useDispatch();
  const [cities, setCities] = useState([]);
  const [passwordType, setPasswordType] = useState('password');
  const [newPasswordType, setNewPasswordType] = useState('password');
  const [invalidPasswordConfirmation, setInvalidPasswordConfirmation] =
    useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    invalid: false,
    message: '',
  });

  let data;
  const updateHandler = (e) => {
    e.preventDefault();
    data = {
      first_name: e.target.first_name.value,
      last_name: e.target.last_name.value,
      city: e.target.city.value,
    };
    dispatch(updateProfileHandler(data));
  };
  const deactivateHandler = () => {
    showPopup();
  };

  const showPopup = () => {
    showOptionDialog({
      containerStyle: { width: 350 },
      text: (
        <p className={i18n.language === 'ar' ? ' text-end' : ''}>
          {t('DEACTIVATE_MESSAGE')}
        </p>
      ),
      title: t('DEACTIVATE'),
      options: [
        {
          name: t('CANCEL', namespaces.GLOBAL),
          type: 'cancel',
        },
        {
          name: t('CONFIRM', namespaces.GLOBAL),
          type: 'confirm',
          style: { background: 'lightcoral' },
        },
      ],
      onConfirm: () => {
        dispatch(deactivateProfileHandler());
      },
    });
  };

  const changeHandler = (e) => {
    let formData = new FormData();
    formData.append('image', e.target.files[0]);
    dispatch(updatePictureHandler(formData));
  };

  const updatePasswordHandler = (e) => {
    e.preventDefault();
    const { password, newPassword, repeatedPassword } = e.target;
    try {
      validatePassword(newPassword.value);
      setPasswordValidation({ invalid: false });
    } catch (error) {
      setPasswordValidation({ invalid: true, message: error });
      return;
    }
    if (newPassword.value !== repeatedPassword.value) {
      setInvalidPasswordConfirmation(true);
      return;
    } else {
      setInvalidPasswordConfirmation(false);
    }
    const obj = {
      current: password.value,
      new: newPassword.value,
      repeatedPassword: repeatedPassword.value,
    };
    dispatch(changePasswordHandler(obj));
  };

  // const Error = ({ data }) => {
  //   return (
  //     <React.Fragment>
  //       <ol>{Children.toArray(data.map((d, i) => <li>{d}</li>))}</ol>
  //     </React.Fragment>
  //   );
  // };

  useEffect(() => {
    setCities(State.getStatesOfCountry(String('JO')));
  }, []);
  return (
    <div>
      <>
        <Row className='justify-content-center align-content-center'>
          <>
            <Col xs={'6'} className='justify-content-center row'>
              <LazyLoadImage
                className='w-50 h-50 mx-auto img-thumbnail'
                src={profile_picture}
                loading='lazy'
              />
              <Col xs={'8'}>
                <Row className='justify-content-between'>
                  <Col xs={'auto'}>
                    <Form>
                      <Form.Group>
                        <Form.Label
                          htmlFor='file-input'
                          className='btn btn-secondary'
                        >
                          <CIcon icon={cilCloudUpload} />
                        </Form.Label>
                        <Form.Control
                          id='file-input'
                          type='file'
                          name='file-input'
                          accept='image/*'
                          hidden
                          onChange={changeHandler}
                        />
                      </Form.Group>
                    </Form>
                  </Col>
                  <Col xs={'auto'}>
                    <DeleteModal
                      onConfirm={(close) => {
                        dispatch(deleteProfilePicture());
                        close();
                      }}
                      disabled={profile_picture?.includes('default')}
                    />
                  </Col>
                </Row>
              </Col>
            </Col>
          </>
        </Row>
      </>

      <Row className='w-100'>
        <Col xs={12}>
          <Accordion defaultActiveKey='0' className='w-100'>
            <Accordion.Item eventKey='0' className='w-100'>
              <Accordion.Header>{t('PERSONAL_INFO')}</Accordion.Header>
              <Accordion.Body>
                <Form onSubmit={updateHandler} className='w-100'>
                  <CRow xs={{ gutterY: 2 }}>
                    <Col xs='12' lg='6'>
                      <CFormInput
                        floatingLabel={t('FIRST_NAME', namespaces.SIGN_UP)}
                        placeholder={t('FIRST_NAME', namespaces.SIGN_UP)}
                        id='first_name'
                        value={first_name ?? ''}
                      />
                    </Col>
                    <Col xs='12' lg='6'>
                      <CFormInput
                        floatingLabel={t(
                          'last_name'.toUpperCase(),
                          namespaces.SIGN_UP
                        )}
                        placeholder={t(
                          'last_name'.toUpperCase(),
                          namespaces.SIGN_UP
                        )}
                        id='last_name'
                        value={last_name ?? ''}
                      />
                    </Col>

                    <Col xs='12' lg='6'>
                      <CFormSelect
                        floatingLabel={t(
                          'city'.toUpperCase(),
                          namespaces.SIGN_UP
                        )}
                        placeholder={t(
                          'city'.toUpperCase(),
                          namespaces.SIGN_UP
                        )}
                        name='city'
                        id='city'
                        defaultValue={city}
                      >
                        {Children.toArray(
                          cities.map((item) => (
                            <option value={item.name.split(' ')[0]}>
                              {t(
                                item.name.split(' ')[0].toUpperCase(),
                                namespaces.SIGN_UP
                              )}
                            </option>
                          ))
                        )}
                      </CFormSelect>
                    </Col>
                  </CRow>

                  <Button
                    variant='outline-primary'
                    className='mt-2'
                    type='submit'
                    disabled={loading}
                  >
                    {loading ? (
                      <CSpinner size='sm' variant='grow' />
                    ) : (
                      t('SAVE_CHANGES', namespaces.GLOBAL)
                    )}
                  </Button>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='1'>
              <Accordion.Header>{t('ACCOUNT_INFO')}</Accordion.Header>
              <Accordion.Body>
                <ChangeEmail />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='2'>
              <Accordion.Header>{t('CHANGE_PASSWORD')}</Accordion.Header>
              <Accordion.Body>
                <Form onSubmit={updatePasswordHandler} className='h-100'>
                  <Row className='gy-3'>
                    <Col xs='12'>
                      <CInputGroup>
                        <CFormInput
                          placeholder={t('CURRENT_PASSWORD')}
                          floatingLabel={t('CURRENT_PASSWORD')}
                          type={passwordType}
                          id='password'
                          name='password'
                          autoComplete='true'
                          required
                        />
                        <Button
                          className='bg-light'
                          color='secondary'
                          variant='outline'
                          onClick={() =>
                            setPasswordType(
                              passwordType === 'password' ? 'text' : 'password'
                            )
                          }
                        >
                          {passwordType === 'password' ? (
                            <Eye color='secondary' />
                          ) : (
                            <EyeSlash color='secondary' />
                          )}
                        </Button>
                      </CInputGroup>
                    </Col>
                    <Col xs='12'>
                      <CInputGroup>
                        <CFormInput
                          placeholder={t('NEW_PASSWORD')}
                          floatingLabel={t('NEW_PASSWORD')}
                          type={newPasswordType}
                          id='newPassword'
                          invalid={passwordValidation.invalid}
                          required
                          autoComplete='true'
                        />
                        <Button
                          className='bg-light'
                          color='secondary'
                          variant='outline'
                          onClick={() =>
                            setNewPasswordType(
                              newPasswordType === 'password'
                                ? 'text'
                                : 'password'
                            )
                          }
                        >
                          {newPasswordType === 'password' ? (
                            <Eye color='secondary' />
                          ) : (
                            <EyeSlash color='secondary' />
                          )}
                        </Button>
                      </CInputGroup>
                      {passwordValidation.invalid && (
                        <CFormText className=' text-danger mb-2 mt-0'>
                          {passwordValidation.message}
                        </CFormText>
                      )}
                    </Col>
                    <Col xs='12'>
                      <CFormInput
                        placeholder={t('CONFIRM_NEW_PASSWORD')}
                        floatingLabel={t('CONFIRM_NEW_PASSWORD')}
                        type={newPasswordType}
                        id='repeatedPassword'
                        required
                        invalid={invalidPasswordConfirmation}
                        autoComplete='true'
                        feedbackInvalid={t(
                          'INVALID_REPEATED_PASSWORD',
                          namespaces.SIGN_UP
                        )}
                      />
                    </Col>
                    <Col xs='12'>
                      <Button
                        variant='outline-primary'
                        type='submit'
                        disabled={loading}
                      >
                        {loading ? (
                          <CSpinner size='sm' variant='grow' />
                        ) : (
                          t('SAVE_CHANGES', namespaces.GLOBAL)
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
      <Button
        variant='danger'
        className='my-2'
        type='submit'
        onClick={deactivateHandler}
      >
        {t('DEACTIVATE')}
      </Button>
    </div>
  );
};

export default Account;
