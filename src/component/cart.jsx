import React, { Children } from "react";
import { connect, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import { useTranslation } from "react-i18next";
import { namespaces } from "../i18n";
import LoadingSpinner from "./common/LoadingSpinner";
const Cart = ({ updateCartItemHandler, deleteCartItemHandler, login }) => {
  const { t, i18n } = useTranslation([
    namespaces.CART.ns,
    namespaces.PRODUCT.ns,
    namespaces.COLOR.ns,
  ]);
  const navigate = useNavigate();
  const { data: cart, loading } = useSelector((state) => state.cart);
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
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <>
      <h1 className="text-align-center border-bottom d-block pb-2 mx-auto px-5 border-info w-fit-content">
        {t("Cart".toUpperCase())}
      </h1>
      <Row className="justify-content-center w-100 pb-5 ">
        {cart.length > 0 ? (
          <>
            {" "}
            <Col xxl={10}>
              <Table responsive striped bordered>
                <thead>
                  <tr>
                    <th>{t("PRODUCT_IMAGE")}</th>
                    <th>{t("PRODUCT_NAME")}</th>
                    <th>{t("Price".toUpperCase(), namespaces.PRODUCT)}</th>
                    <th>{t("color".toUpperCase(), namespaces.PRODUCT)}</th>
                    <th>{t("size".toUpperCase(), namespaces.PRODUCT)}</th>
                    <th>{t("QUANTITY")}</th>
                    <th>{t("SUBTOTAL")}</th>
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
                        <td>{item[`${i18n.language}title`]}</td>
                        <td>{`${item.price} ${t(
                          item.currency.toUpperCase(),
                          namespaces.PRODUCT
                        )}`}</td>
                        <td>{t(item.color, namespaces.COLOR) ?? "-"}</td>
                        <td>{item.size ?? "-"}</td>
                        <td>
                          <Row className="justify-content-center align-items-center">
                            <Col xs="auto">
                              <Button
                                type="button"
                                variant="light"
                                className="border border-1"
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
                                className="border border-1"
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
                        <td>{`${item.price * (item.quantity ?? 1)} ${t(
                          item.currency.toUpperCase(),
                          namespaces.PRODUCT
                        )}`}</td>
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
                        {t("SUBTOTAL")}:{" "}
                        {cart
                          .reduce((x, y) => {
                            return (x += Number(y.price) * y.quantity);
                          }, 0)
                          .toFixed(2)}{" "}
                        {t("JOD", namespaces.PRODUCT)}
                      </strong>
                    </th>
                  </tr>
                </tfoot>
              </Table>
            </Col>
            <Col xl={3} md={6} xs={"12"}>
              <Button
                className="border-5 mx-5 text-light rounded-5"
                variant="info"
                onClick={submitHandler}
              >
                {t("PROCEED_TO_CHECKOUT")}
              </Button>
            </Col>
          </>
        ) : (
          <Col xs="auto">
            <h2>{t("EMPTY_CART")}</h2>
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
