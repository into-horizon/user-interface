import React, { Children } from "react";
import { connect } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
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

const Cart = ({
  cart,
  updateCartItemHandler,
  deleteCartItemHandler,
  login,
}) => {
  const history = useHistory();

  const qtyChangeHandler = (item) => {
    if (item.quantity === 1) {
      deleteCartItemHandler(item);
    } else {
      updateCartItemHandler({ ...item, quantity: item.quantity - 1 });
    }
  };
  const submitHandler = (e) => {
    e.preventDefault();
    let subTotal = Number(
      document.getElementById("subTotal").innerHTML.split(":")[1]
    );
    // return(
    //   <Redirect to='/'/>
    // )
    !login && cookie.save("redirectTo", "/checkout", { path: "/" });
    history.push("/checkout");
  };
  return (
    <div className="cart">
      {cart.length > 0 ? (
        <section>
          <form
            id="checkoutForm"
            className="checkoutForm"
            onSubmit={submitHandler}
          >
            <table>
              {/* <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>

        </thead> */}
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
                      {item.color && <td>{item.color}</td>}
                      {item.size && <td>{item.size}</td>}
                      <td>
                        <div className="btns">
                          <button
                            className="btn"
                            type="button"
                            onClick={() => {
                              qtyChangeHandler(item);
                            }}
                          >
                            -
                          </button>
                          <span className="in">{item.quantity ?? 1}</span>
                          <button
                            type="button"
                            className="btn"
                            onClick={() => {
                              updateCartItemHandler({
                                ...item,
                                quantity: (item.quantity ?? 1) + 1,
                              });
                            }}
                          >
                            +
                          </button>
                        </div>
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
                  <th>
                    <strong id="subTotal" className="subTotal">
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
            </table>
            {/* <strong id='subTotal' className="subTotal">Subtotal: {cart.reduce((x,y)=>{return x+= Number(y.price.slice(1)) * y.qty},0)}</strong> */}
            <button type="submit" className="checkout">
              Proceed to checkout
            </button>
          </form>

          {/* <strong className="subTotal">Subtotal: {cart.reduce((x,y)=>{return x+= Number(y.price.slice(1)) * y.qty},0)}</strong> */}
        </section>
      ) : (
        <h3 className="cartHeader">Your cart is empty</h3>
      )}
    </div>
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
