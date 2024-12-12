import React, { Children, Fragment, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import {
  CButton,
  CCol,
  CListGroup,
  CListGroupItem,
  CPlaceholder,
  CRow,
  CTooltip,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPen, cilPlus } from '@coreui/icons';
import AddressModal from './AddressModal';
import Paginator from '../../../../component/common/Paginator';
import DeleteModal from '../../../../component/common/DeleteModal';
import {
  updateAddressHandler,
  addAddressHandler,
  myAddressHandler,
  removeAddressHandler,
} from '../../../../store/address';
import { useState } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';

const Address = ({
  updateAddressHandler,
  addAddressHandler,
  removeAddressHandler,
  myAddressHandler,
}) => {
  const [params, setParams] = useState({ limit: 5, offset: 0 });
  const { t } = useTranslation([
    namespaces.ADDRESS.ns,
    namespaces.GLOBAL.ns,
    namespaces.SIGN_UP.ns,
  ]);
  const {
    data: addresses,
    count,
    loading,
  } = useSelector((state) => state.address);
  // const dispatch = useDispatch();
  const deleteHandler = async (id) => {
    await removeAddressHandler({ id: id });
  };

  const AddBtnComponent = (props) => (
    <CTooltip content={t('ADD_ADDRESS_TOOLTIP')}>
      <CButton className='my-2' {...props}>
        <CIcon icon={cilPlus} />
      </CButton>
    </CTooltip>
  );
  const UpdateBtnComponent = (props) => (
    <CTooltip content={t('EDIT', namespaces.GLOBAL)}>
      <CButton color='secondary' {...props} size='sm'>
        <CIcon icon={cilPen} size='sm' />
      </CButton>
    </CTooltip>
  );
  const handleDelete = async (id) => {
    await deleteHandler(id);
    myAddressHandler(params);
  };
  const handlePageChange = (pageNumber) => {
    setParams((currentParams) => {
      const newParams = {
        ...currentParams,
        offset: currentParams.limit * (pageNumber - 1),
      };
      myAddressHandler(newParams);
      return newParams;
    });
  };

  useEffect(() => {
    myAddressHandler(params);
  }, [myAddressHandler, params]);
  const AddressItem = ({ label, value }) => (
    <Fragment>
      {value && (
        <>
          {label}: <bdi>{value}</bdi>
          <br />
        </>
      )}
    </Fragment>
  );

  return (
    <>
      <AddressModal
        BtnComponent={AddBtnComponent}
        setCurrentAddress
        handleSubmit={async (address, close) => {
          await addAddressHandler(address);
          myAddressHandler(params);
          close();
        }}
      />
      <div>
        {loading ? (
          Children.toArray(
            _.range(0, 3).map(() => (
              <CListGroup>
                <CListGroupItem
                  component={'div'}
                  className='col-12 my-1 bg-light'
                >
                  <CRow>
                    <CCol xs={'10'}>
                      <CPlaceholder animation='glow' as={'p'}>
                        <CPlaceholder xs={2} /> <CPlaceholder xs={9} />
                      </CPlaceholder>
                      <CPlaceholder animation='glow' as={'p'}>
                        <CPlaceholder xs={2} /> <CPlaceholder xs={6} />
                      </CPlaceholder>
                      <CPlaceholder animation='glow' as={'p'}>
                        <CPlaceholder xs={2} />{' '}
                        <CPlaceholder as={'span'} xs={4} />
                      </CPlaceholder>
                    </CCol>
                    <CCol xs={2}>
                      <CPlaceholder animation='wave'>
                        <CPlaceholder
                          as={CButton}
                          xs={3}
                          color='secondary'
                          tabIndex={-1}
                          className='mx-2'
                        />
                        <CPlaceholder
                          as={CButton}
                          xs={3}
                          color='danger'
                          tabIndex={-1}
                        />
                      </CPlaceholder>
                    </CCol>
                  </CRow>
                </CListGroupItem>
              </CListGroup>
            ))
          )
        ) : addresses.length === 0 ? (
          <h3>{t('NO_ADDRESSES')}</h3>
        ) : (
          <>
            <CListGroup>
              {Children.toArray(
                addresses?.map((el) => (
                  <CListGroupItem
                    key={el.id}
                    component={'div'}
                    className='col-12 my-1 bg-light'
                  >
                    <CRow>
                      <CCol xs={'10'}>
                        <p>
                          <AddressItem
                            value={`${el.first_name}  ${el.last_name}`}
                            label={t('NAME')}
                          />
                          <AddressItem
                            value={t(el.city, namespaces.SIGN_UP)}
                            label={t('CITY')}
                          />
                          <AddressItem value={el.region} label={t('REGION')} />
                          <AddressItem
                            value={el.street_name}
                            label={t('STREET')}
                          />
                          <AddressItem value={el.mobile} label={t('MOBILE')} />
                        </p>
                      </CCol>

                      <CCol xs={'2'} className=' d-flex gap-1  '>
                        <div>
                          <AddressModal
                            addressProp={el}
                            BtnComponent={UpdateBtnComponent}
                            handleSubmit={async (address, close) => {
                              await updateAddressHandler(address);
                              myAddressHandler(params);
                              close();
                            }}
                          />
                        </div>
                        <div>
                          <DeleteModal
                            onConfirm={() => handleDelete(el.id)}
                            btnSize={'sm'}
                          />
                        </div>
                      </CCol>
                    </CRow>
                  </CListGroupItem>
                ))
              )}
            </CListGroup>
            <Paginator
              count={count}
              params={params}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </>
  );
};

const mapDispatchToProps = {
  updateAddressHandler,
  addAddressHandler,
  myAddressHandler,
  removeAddressHandler,
};

export default connect(null, mapDispatchToProps)(Address);
