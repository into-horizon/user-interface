import React, { useState, useEffect, Children } from "react";
import { connect } from "react-redux";
import { deleteProduct, deleteItemHandler } from "../store/wishlist";
import { addItem, addCartItemHandler } from "../store/cart";
import { If, Then, Else } from "react-if";
import image from "../assets/no-image.png";
const Wishlist = ({
  wishlist,
  deleteProduct,
  addItem,
  addCartItemHandler,
  cart,
  deleteItemHandler,
}) => {
  const x = cart.map((w) => w.id);

  // useEffect(() =>{

  //     setW(x)
  //   },[wishlist])
  return (
    <div className="wishlist">
      <h2 className="wishlistHead">Wishlist</h2>
      {wishlist.length > 0 ? (
        Children.toArray(
          wishlist.map((item) => (
            <section className="cardw">
              <img
                src={item.picture ?? item.pictures?.product_picture ?? image}
                alt="wishlist"
              />
              <h3>{item.entitle}</h3>
              <div className="btnContainer">
                <div className="money_bag">
                  <If
                    condition={
                      !cart.find(
                        (v) =>
                          v.id === item.product_id ||
                          v.product_id === item.product_id ||
                          v.product_id === item.id ||
                          v.id === item.id
                      )
                    }
                  >
                    <Then>
                      <button
                        onClick={() =>
                          addCartItemHandler({ ...item, quantity: 1 })
                        }
                      >
                        <i className="fa fa-shopping-bag" />
                        Move to Card
                      </button>
                    </Then>
                    <Else>
                      <button
                        disabled
                        onClick={() => addItem({ ...item, quantity: 1 })}
                      >
                        <i className="fa fa-shopping-bag" />
                        In your Card
                      </button>
                    </Else>
                  </If>
                  {/* <button onClick={() =>addItem({...item, qty: 1})}><i className="fa fa-shopping-bag"/>Move to Card</button> */}
                </div>
                <div className="removeBtn ">
                  <button
                    className="removeWishlist"
                    onClick={() => deleteItemHandler(item)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </section>
          ))
        )
      ) : (
        <h3 className="cartHeader">Your wishlist is empty</h3>
      )}
    </div>
  );
};
const mapStateToProps = (state) => ({
  wishlist: state.wishlist.items,
  cart: state.cart,
});

const mapDispatchToProps = {
  deleteProduct,
  addItem,
  deleteItemHandler,
  addCartItemHandler,
};
export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
