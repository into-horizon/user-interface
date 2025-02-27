import React, { useState, useEffect, Children } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import cookie from 'react-cookies';
import { Col, Row } from 'react-bootstrap';
import {
  CForm,
  CFormInput,
  CButton,
  CFormSelect,
  CRow,
  CCol,
  CCard,
  CCardTitle,
  CCardImage,
  CCardText,
  CCardBody,
  CFormCheck,
  CTooltip,
  CInputGroup,
  CFormText,
  CSpinner,
} from '@coreui/react';
import { cilPlus, cilXCircle, cilCheckAlt } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import image from '../assets/no-image.png';
import { checkCodeHandler, clearDiscount } from '../store/discount';
import { placedOrderHandler } from '../store/order';
import { resetCartItems } from '../store/cart';
import { useNavigate } from 'react-router-dom';
import AddressModal from './settings/components/address/AddressModal';
import { addAddressHandler, myAddressHandler } from '../store/address';
import LoadingSpinner from '../component/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../i18n';
export const Checkout = ({
  checkCodeHandler,
  placedOrderHandler,
  addAddressHandler,
  myAddressHandler,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation([
    namespaces.CHECKOUT.ns,
    namespaces.ADDRESS.ns,
    namespaces.PRODUCT.ns,
    namespaces.CART.ns,
    namespaces.COLOR.ns,
    namespaces.GLOBAL.ns,
  ]);
  const { data: addresses } = useSelector((state) => state.address);
  const { data: cart, loading } = useSelector((state) => state.cart);
  const { placedOrder, loading: orderLoading } = useSelector(
    (state) => state.order
  );
  const [total, setTotal] = useState({ subtotal: 0, discount: 0, shipping: 3 });
  const { message, valid, discount, invalid } = useSelector(
    (state) => state.discount
  );
  const [selectedAddress, setSelectedAddress] = useState(
    addresses.find((address) => address.is_default)
  );
  useEffect(() => {
    cookie.remove('redirectTo', { path: '/' });
    myAddressHandler();
  }, [myAddressHandler]);

  useEffect(() => {
    let address = addresses.find((address) => address.is_default === true);
    setSelectedAddress(address);
  }, [addresses]);

  useEffect(() => {
    setTotal((x) => ({
      ...x,
      subtotal: cart
        .reduce((x, y) => {
          return (x += Number(y.price) * y.quantity);
        }, 0)
        .toFixed(2),
    }));
  }, [cart]);

  const discountCodeHandler = (e) => {
    e.preventDefault();
    discount.id
      ? dispatch(clearDiscount())
      : checkCodeHandler({
          discount_code: e.target.discount_code.value,
          order_amount: total.subtotal,
        });
  };
  useEffect(() => {
    if (discount?.id) {
      setTotal((x) => ({
        ...x,
        discount: discount.max_discount
          ? x.subtotal * discount.discount > discount.max_discount
            ? discount.max_discount
            : (x.subtotal * discount.discount).toFixed(2)
          : discount.discount,
      }));
    } else setTotal((x) => ({ ...x, discount: 0 }));
  }, [discount.discount, discount?.id, discount.max_discount]);
  const orderHandler = () => {
    placedOrderHandler({
      discount_id: discount?.id,
      address_id: selectedAddress.id,
      sub_total: total.subtotal,
      grand_total: (
        Number(total.subtotal) +
        Number(total.shipping) -
        Number(total.discount)
      ).toFixed(2),
      shipping: total.shipping,
      cartItems: cart,
    });
  };
  useEffect(() => {
    if (placedOrder?.id) {
      dispatch(resetCartItems([]));
      navigate('/successOrder');
    }
  }, [dispatch, navigate, placedOrder?.id]);

  useEffect(() => {
    if (cart.length === 0 && !loading) {
      navigate('/');
    }
  }, [cart.length, loading, navigate]);

  return (
    <CRow className='justify-content-center  cart gap-1 pt-3 w-100 h-100'>
      <CCol xs={11} lg={6} xl={4} className=' overflow-y-auto items-container '>
        <h5>{t('YOUR_ITEMS')}</h5>
        {loading ? (
          <LoadingSpinner />
        ) : (
          Children.toArray(
            cart.map((item) => (
              <CCard className='mb-3'>
                <CRow className='g-0'>
                  <CRow>
                    <CCol xs={4}>
                      <CCardImage
                        src={
                          item.picture ??
                          item.pictures?.product_picture ??
                          image
                        }
                      />
                    </CCol>
                    <CCol xs={8}>
                      <CCardBody>
                        <CCardTitle>{item[`${i18n.language}title`]}</CCardTitle>
                        <CCardText>
                          <ul>
                            <li>{`${t('PRICE', namespaces.PRODUCT)}: ${
                              item.final_price
                            } ${t(
                              item.currency.toUpperCase(),
                              namespaces.PRODUCT
                            )}`}</li>
                            <li>{`${t(
                              'quantity'.toUpperCase(),
                              namespaces.CART
                            )}: ${item.quantity}`}</li>
                            {item.size && (
                              <li>{`${t('size'.toUpperCase())} ${
                                item.size
                              }`}</li>
                            )}
                            {item.color && (
                              <li>{`${t(
                                'color'.toUpperCase(),
                                namespaces.PRODUCT
                              )}: ${t(item.color, namespaces.COLOR)}`}</li>
                            )}
                          </ul>
                        </CCardText>
                      </CCardBody>
                    </CCol>
                  </CRow>
                </CRow>
              </CCard>
            ))
          )
        )}
      </CCol>
      <CCol xs={11} lg={6} xl={4}>
        <Row>
          <Col xs={10}>
            <CFormSelect
              value={selectedAddress?.id}
              onChange={(e) =>
                setSelectedAddress(
                  addresses.find((address) => address.id === e.target.value)
                )
              }
            >
              {React.Children.toArray(
                addresses?.map((address) => (
                  <option
                    value={address.id}
                  >{`${address.first_name} ${address.last_name} - ${address.street_name}`}</option>
                ))
              )}
            </CFormSelect>
          </Col>
          <Col xs={2}>
            <AddressModal
              BtnComponent={(props) => (
                <CTooltip
                  content={t('ADD_ADDRESS_TOOLTIP', namespaces.ADDRESS)}
                >
                  <CButton {...props}>
                    <CIcon icon={cilPlus} />
                  </CButton>
                </CTooltip>
              )}
              handleSubmit={async (address, close) => {
                await addAddressHandler(address);
                close();
              }}
            />
          </Col>
        </Row>
        {selectedAddress && (
          <Col
            md={12}
            className=' my-2 border  border-success rounded-2  bg-secondary py-3'
          >
            <ul>
              <li>
                {`${t('name'.toUpperCase(), namespaces.ADDRESS)}: ${
                  selectedAddress?.first_name
                } ${selectedAddress?.last_name}`}
              </li>
              <li>{`${t('city'.toUpperCase(), namespaces.ADDRESS)}: ${
                selectedAddress?.city
              } - ${selectedAddress?.country}`}</li>
              <li>{`${t('REGION', namespaces.ADDRESS)}: ${
                selectedAddress?.region ?? '-'
              }`}</li>
              <li>{`${t('street'.toUpperCase(), namespaces.ADDRESS)}: ${
                selectedAddress?.street_name
              }`}</li>
              <li>{`${t('MOBILE', namespaces.ADDRESS)}: ${
                selectedAddress?.mobile
              }`}</li>
              <li>{`${t(
                'BUILDING_NUMBER'.toUpperCase(),
                namespaces.ADDRESS
              )}: ${selectedAddress?.building_number}`}</li>
              <li>{`${t('APARTMENT_NUMBER', namespaces.ADDRESS)}: ${
                selectedAddress?.apartment_number
              }`}</li>
            </ul>
          </Col>
        )}
        <CRow className='p-1rem'>
          <h5 className='m-1rem'>{t('SELECT_PAYMENT_METHOD')}</h5>
          <CFormCheck
            type='radio'
            name='payment'
            label={t('CASH_ON_DELIVERY')}
            defaultChecked
          />
          <CFormCheck
            type='radio'
            name='payment'
            label={t('CREDIT_CARD')}
            disabled
          />
        </CRow>
      </CCol>
      <CCol xs={10} lg={5} xl={3} className=''>
        <CForm onSubmit={discountCodeHandler}>
          <CRow className='justify-content-center align-items-center'>
            <CCol xs={12}>
              <CInputGroup>
                <CFormInput
                  placeholder={t('PROMO_CODE')}
                  id='discount_code'
                  value={discount?.discount_code}
                  invalid={invalid}
                  valid={valid}
                  required
                />
                {discount.id ? (
                  <CButton type='submit' color='danger'>
                    <CIcon icon={cilXCircle} />
                    {t('REMOVE', namespaces.GLOBAL)}
                  </CButton>
                ) : (
                  <CButton type='submit' color='success'>
                    <CIcon icon={cilCheckAlt} />
                    {t('APPLY')}
                  </CButton>
                )}
              </CInputGroup>
              <CFormText
                className={`${valid ? 'text-success' : 'text-danger'}`}
              >
                {message}
              </CFormText>
            </CCol>
          </CRow>
        </CForm>
        <div className='p-3 my-3 bg-info border-5 rounded w-100'>
          <h5>{t('ORDER_SUMMARY')}</h5>
          <ul>
            <li>{`${t('SUBTOTAL', namespaces.CART)}: ${total.subtotal}`}</li>
            <li>{`${t('DELIVERY_FEES')}: ${total.shipping}`}</li>
            <li>{`${t('TAX')}: 0.0`}</li>
            {total.discount > 0 && (
              <li>{`${t('DISCOUNT')}: ${total.discount} ${t(
                'JOD',
                namespaces.PRODUCT
              )} `}</li>
            )}
            <li>{`${t('TOTAL_PRICE')}: ${(
              Number(total.subtotal) +
              Number(total.shipping) -
              Number(total.discount)
            ).toFixed(2)}`}</li>
          </ul>
        </div>
        <Col md={12}>
          <CButton
            className=' w-100 '
            onClick={orderHandler}
            disabled={orderLoading || !selectedAddress?.id}
          >
            {orderLoading ? <CSpinner variant='grow' /> : t('PLACE_ORDER')}
          </CButton>
        </Col>
        <span>{placedOrder?.id}</span>
      </CCol>
    </CRow>
  );
};

const mapDispatchToProps = {
  checkCodeHandler,
  placedOrderHandler,
  addAddressHandler,
  myAddressHandler,
};

export default connect(null, mapDispatchToProps)(Checkout);
