import React, { Children } from "react";
import { connect } from "react-redux";
import { Redirect, useNavigate } from "react-router-dom";
import {
  addItem,
  decrementQuantity,
  incrementQuantity,
  deleteItem,
  updateCartItemHandler,
  deleteCartItemHandler,
} from "../store/cart";
import image from "../assets/no-image.png";
import cookie from "react-cookies";
import { Button, Col, Row, Table } from "react-bootstrap";
import CIcon from "@coreui/icons-react";
import { cilMinus, cilPlus } from "@coreui/icons";

const Cart = ({
  cart,
  updateCartItemHandler,
  deleteCartItemHandler,
  login,
}) => {
  const navigate = useNavigate();

  const qtyChangeHandler = (item) => {
    if (item.quantity === 1) {
      deleteCartItemHandler(item);
    } else {
      updateCartItemHandler({ ...item, quantity: item.quantity - 1 });
    }
  };
  const submitHandler = () => {
    !login && cookie.save("redirectTo", "/checkout", { path: "/" });
    navigate("/checkout");
  };
  return (
    <>
      
      <h1 className="text-align-center border-bottom d-block pb-2 mx-auto px-5 border-info" style={{maxWidth: 'fit-content'}}>Cart</h1>
      <Row className="justify-content-center cart">
        {cart.length > 0 ? (
          <>
            {" "}
            <Col xxl={10}>
              <Table responsive striped bordered>
                <thead>
                  <tr>
                    <th>Product Image</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>color</th>
                    <th>size</th>
                    <th>Quantity</th>
                    <th>Sub Total</th>
                  </tr>
                </thead>

                <tbody>
                  {Children.toArray(
                    cart.map((item) => (
                      <tr>
                        <td>
                          <img
                            src={
                              item.picture ??
                              item.pictures?.product_picture ??
                              image
                            }
                            alt=""
                            className="cartImg"
                          />
                        </td>
                        <td>{item.entitle}</td>
                        <td>{`${item.price} ${item.currency}`}</td>
                        <td>{item.color ?? "-"}</td>
                        <td>{item.size ?? "-"}</td>
                        <td>
                          <Row className="justify-content-center align-items-center">
                            <Col xs="auto">
                              <Button
                                type="button"
                                variant="light"
                                onClick={() => {
                                  qtyChangeHandler(item);
                                }}
                              >
                                <CIcon icon={cilMinus} />
                              </Button>
                            </Col>
                            <Col xs="auto">
                              <span className="in">{item.quantity ?? 1}</span>
                            </Col>
                            <Col xs="auto">
                              <Button
                                type="button"
                                variant="light"
                                onClick={() => {
                                  updateCartItemHandler({
                                    ...item,
                                    quantity: (item.quantity ?? 1) + 1,
                                  });
                                }}
                              >
                                <CIcon icon={cilPlus} />
                              </Button>
                            </Col>
                          </Row>
                        </td>
                        <td>{`${item.price * (item.quantity ?? 1)} ${
                          item.currency
                        }`}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>
                      <strong className="text-dark">
                        Subtotal:{" "}
                        {cart
                          .reduce((x, y) => {
                            return (x += Number(y.price) * y.quantity);
                          }, 0)
                          .toFixed(2)}
                      </strong>
                    </th>
                  </tr>
                </tfoot>
              </Table>
            </Col>
            <Col xl={3} md={6} xs={12}>
              <Button
                className="border-5 mx-5 text-light"
                variant="info"
                onClick={submitHandler}
              >
                Proceed to checkout
              </Button>
            </Col>
          </>
        ) : (
          <Col xs="auto">
            <h2>your cart is empty</h2>
          </Col>
        )}
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  login: state.sign.login,
});

const mapDispatchToProps = {
  addItem,
  decrementQuantity,
  incrementQuantity,
  deleteItem,
  updateCartItemHandler,
  deleteCartItemHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
