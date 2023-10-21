import React, { useState, useEffect, Children } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import cookie from "react-cookies";
import { Col, Form, Row } from "react-bootstrap";
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
} from "@coreui/react";
import { cilPlus, cilShieldAlt, cilXCircle, cilCheckAlt } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import image from "../assets/no-image.png";
import { checkCodeHandler, clearDiscount } from "../store/discount";
import { placedOrderHandler } from "../store/order";
import { resetCartItems } from "../store/cart";
import { useHistory, useNavigate } from "react-router-dom";
import AddressModal from "./settings/components/address/AddressModal";
import { addAddressHandler, myAddressHandler } from "../store/address";
export const Checkout = ({
  checkCodeHandler,
  placedOrderHandler,
  addAddressHandler,
  myAddressHandler,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: addresses } = useSelector((state) => state.address);
  const cart = useSelector((state) => state.cart);
  const { message: msg, placedOrder } = useSelector((state) => state.order);
  const [total, setTotal] = useState({ subtotal: 0, discount: 0, shipping: 3 });
  const { message, status, discount } = useSelector((state) => state.discount);
  const [selectedAddress, setSelectedAddress] = useState({});
  useEffect(() => {
    cookie.remove("redirectTo", { path: "/" });
    myAddressHandler();
  }, []);

  useEffect(() => {
    let address = addresses.find((address) => address.is_default === true);
    setSelectedAddress(address);
  }, [addresses]);

  useEffect(() => {
    setTotal((x) => {
      return {
        ...x,
        subtotal: cart
          .reduce((x, y) => {
            return (x += Number(y.price) * y.quantity);
          }, 0)
          .toFixed(2),
      };
    });
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
      setTotal((x) => {
        return {
          ...x,
          discount: discount.max_discount
            ? x.subtotal * discount.discount > discount.max_discount
              ? discount.max_discount
              : (x.subtotal * discount.discount).toFixed(2)
            : discount.discount,
        };
      });
    } else
      setTotal((x) => {
        return { ...x, discount: 0 };
      });
  }, [discount.id]);
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
    });
  };
  useEffect(() => {
    if (placedOrder.id) {
      dispatch(resetCartItems([]));
      navigate("/successOrder");
    }
  }, [placedOrder.id]);

  return (
    <CRow className="justify-content-center align-items-center cart gap-1">
      <CCol xs={11} lg={6} xl={4}>
        <h5>your items</h5>
        {Children.toArray(
          cart.map((item) => (
            <section className="mb-3" style={{ maxWidth: "540px" }}>
              <CRow className="g-0 card">
                <CRow>
                  <CCol xs={4}>
                    <CCardImage
                      src={
                        item.picture ?? item.pictures?.product_picture ?? image
                      }
                    />
                  </CCol>
                  <CCol xs={8} lg={6}>
                    <CCardBody>
                      <CCardTitle>{item.entitle}</CCardTitle>
                      <CCardText>
                        <ul>
                          <li>{`price: ${item.price}`}</li>
                          <li>{`quantity: ${item.quantity}`}</li>
                          {item.size && <li>{`size ${item.size}`}</li>}
                          {item.color && <li>{`color: ${item.color}`}</li>}
                        </ul>
                      </CCardText>
                    </CCardBody>
                  </CCol>
                </CRow>
              </CRow>
            </section>
          ))
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
                <CTooltip content="add new address">
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
          <Col md={12} className="p-1rem m-2rem addressCard">
            <ul>
              <li>
                {`name: ${selectedAddress?.first_name} ${selectedAddress?.last_name}`}
              </li>
              <li>{`city: ${selectedAddress?.city} - ${selectedAddress?.country}`}</li>
              <li>{`street: ${selectedAddress?.street_name}`}</li>
              <li>{`mobile: ${selectedAddress?.mobile}`}</li>
              <li>{`building number: ${selectedAddress?.building_number}`}</li>
              <li>{`apartment number: ${selectedAddress?.apartment_number}`}</li>
            </ul>
          </Col>
        )}
        <CRow className="p-1rem">
          <h5 className="m-1rem">Select Payment Method</h5>
          <CFormCheck
            type="radio"
            name="payment"
            label="Cash on Delivery"
            defaultChecked
          />
          <CFormCheck
            type="radio"
            name="payment"
            label="Credit card"
            disabled
          />
          <CFormCheck
            type="radio"
            name="payment"
            label="e-fawateercom"
            disabled
          />
        </CRow>
      </CCol>
      <CCol xs={10} lg={5} xl={3} className="">
        <CForm onSubmit={discountCodeHandler}>
          <CRow className="justify-content-center align-items-center">
            <CCol xs={8}>
              <CFormInput
                style={{ margin: 0 }}
                placeholder="promo code"
                id="discount_code"
                value={discount?.discount_code}
                required
              />
            </CCol>
            <CCol xs={4}>
              {discount.id ? (
                <CButton type="submit" color="danger">
                  <CIcon icon={cilXCircle}></CIcon>remove
                </CButton>
              ) : (
                <CButton type="submit" color="success">
                  <CIcon icon={cilCheckAlt}></CIcon>apply
                </CButton>
              )}
            </CCol>
            <Col xs={12}>
              <strong
                className={`${status === 200 ? "text-success" : "text-danger"}`}
              >
                {message}
              </strong>
            </Col>
          </CRow>
        </CForm>
          <div className="p-3 my-3 bg-info border-5 rounded w-100" >
            <h5>order summary</h5>
            <ul>
              <li>{`Subtotal: ${total.subtotal}`}</li>
              <li>{`Delivery: ${total.shipping}`}</li>
              <li>{`Tax: 0.0`}</li>
              {total.discount > 0 && <li>{`discount: ${total.discount} `}</li>}
              <li>{`Total: ${(
                Number(total.subtotal) +
                Number(total.shipping) -
                Number(total.discount)
              ).toFixed(2)}`}</li>
            </ul>
          </div>
        <Col md={12}>
          <CButton style={{ width: "100%" }} onClick={orderHandler}>
            place your order
          </CButton>
        </Col>
        <span>{placedOrder?.id}</span>
      </CCol>
    </CRow>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  checkCodeHandler,
  placedOrderHandler,
  addAddressHandler,
  myAddressHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
