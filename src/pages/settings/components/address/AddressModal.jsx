import React, { useEffect, useRef, useState } from 'react';
import {
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import Map from './Map';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';
import CFormInputWithMask from '../../../../component/common/CFormInputWithMask';

const AddressModal = ({
  handleSubmit,
  BtnComponent,
  addressProp,
  close,
  setCurrentAddress,
}) => {
  const { t } = useTranslation([
    namespaces.ADDRESS.ns,
    namespaces.SIGN_UP.ns,
    namespaces.GLOBAL.ns,
  ]);
  const [address, setAddress] = useState(addressProp ?? {});
  const [showModal, setShowModal] = useState(false);
  const submitBtn = useRef(null);
  useEffect(() => {
    if (close) {
      setShowModal(false);
    }
  }, [close]);
  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(address, () => setShowModal(false));
    setShowModal(false);
  };

  const onChange = (e) => {
    e.persist();
    setAddress((prevAddress) => ({
      ...prevAddress,
      [e?.target?.id]: e?.target?.value,
    }));
  };
  const setStr = (e) => {
    setAddress((a) => ({
      ...a,
      building_number:
        e.address_components.find((x) => x.types.includes('street_number'))
          ?.long_name ?? '',
      street_name:
        e.address_components.find((x) => x.types.includes('route'))
          ?.long_name ?? '',
      region:
        e.address_components.find((x) => x.types.includes('sublocality'))
          ?.long_name ?? '',
      city:
        e.address_components.find((x) => x.types.includes('locality'))
          ?.long_name ?? '',
      lat: e.geometry.location.lat ?? '',
      lng: e.geometry.location.lng ?? '',
    }));
  };
  return (
    <>
      {BtnComponent && <BtnComponent onClick={() => setShowModal(true)} />}
      <CModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        alignment='center'
        scrollable
        backdrop={false}
      >
        <CModalHeader>
          <CModalTitle>{t('ADDRESS')}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <Form onSubmit={onSubmit}>
            <Row className=' gy-2 '>
              <Col xs={'12'} md={'6'}>
                <CFormInput
                  placeholder={t('FIRST_NAME', namespaces.SIGN_UP)}
                  floatingLabel={t('FIRST_NAME', namespaces.SIGN_UP)}
                  name='first_name'
                  id='first_name'
                  value={address.first_name ?? ''}
                  onChange={onChange}
                />
              </Col>
              <Col xs={'12'} md={'6'}>
                <CFormInput
                  placeholder={t('LAST_NAME', namespaces.SIGN_UP)}
                  floatingLabel={t('LAST_NAME', namespaces.SIGN_UP)}
                  name='last_name'
                  id='last_name'
                  value={address.last_name ?? ''}
                  onChange={onChange}
                />
              </Col>
              <Col xs={'12'} md={'6'}>
                <CFormInput
                  placeholder={t('CITY')}
                  floatingLabel={t('CITY')}
                  name='city'
                  id='city'
                  value={address.city ?? ''}
                  onChange={onChange}
                />
              </Col>
              <Col xs={'12'} md={'6'}>
                <CFormInputWithMask
                  placeholder={t('MOBILE')}
                  floatingLabel={t('MOBILE')}
                  name='mobile'
                  id='mobile'
                  dir='ltr'
                  mask='+{962}000000000'
                  value={address.mobile ?? ''}
                  onChange={onChange}
                />
              </Col>

              <Col xs={'12'} md={'6'}>
                <CFormInput
                  placeholder={t('REGION')}
                  floatingLabel={t('REGION')}
                  name='region'
                  id='region'
                  value={address.region ?? ''}
                  onChange={onChange}
                />
              </Col>
              <Col xs={'12'} md={'6'}>
                <CFormInput
                  placeholder={t('STREET')}
                  floatingLabel={t('STREET')}
                  name='street_name'
                  id='street_name'
                  value={address.street_name ?? ''}
                  onChange={onChange}
                />
              </Col>
              <Col xs={'12'} md={'6'}>
                <CFormInput
                  placeholder={t('BUILDING_NUMBER')}
                  floatingLabel={t('BUILDING_NUMBER')}
                  name='building'
                  id='building_number'
                  value={address.building_number ?? ''}
                  onChange={onChange}
                />
              </Col>
              <Col xs={'12'} md={'6'}>
                <CFormInput
                  placeholder={t('APARTMENT_NUMBER')}
                  floatingLabel={t('APARTMENT_NUMBER')}
                  name='apartment_number'
                  id='apartment_number'
                  value={address.apartment_number ?? ''}
                  onChange={onChange}
                />
              </Col>
              <Col xs={'12'} md={'6'}>
                {['checkbox'].map((type) => (
                  <div key={`default-${type}`} className='mx-3 mb-3'>
                    <Form.Check
                      type={type}
                      name='default_address'
                      id={`default-${type}`}
                      label={t('DEFAULT_ADDRESS')}
                      checked={!!address.default}
                      onChange={(e) =>
                        setAddress((address) => ({
                          ...address,
                          default: e.target.checked,
                        }))
                      }
                    />
                  </div>
                ))}
              </Col>
              <input type='hidden' id='lat' />
              <input type='hidden' id='lng' />
            </Row>
            <div className='m-auto'>
              <Map onClick={setStr} setCurrentAddress={setCurrentAddress} />
            </div>
            <button type='submit' hidden ref={submitBtn}></button>
          </Form>
        </CModalBody>
        <CModalFooter>
          <Button variant='secondary' onClick={() => setShowModal(false)}>
            {t('CLOSE', namespaces.GLOBAL)}
          </Button>
          <Button variant='primary' onClick={() => submitBtn.current.click()}>
            {t('SUBMIT', namespaces.GLOBAL)}
          </Button>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default AddressModal;
