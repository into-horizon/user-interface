import React, { useEffect, useState, Children } from "react";
import { Carousel } from "react-carousel-minimal";
import { connect, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { addItem } from "../store/cart";
import { addProduct } from "../store/wishlist";
import { productHandler, getProductReviews } from "../store/products";
import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCardText,
  CCardTitle,
  CCol,
  CFormCheck,
  CFormInput,
  CInputGroup,
  CRow,
} from "@coreui/react";
import { BagPlus, HeartFill, Heart } from "react-bootstrap-icons";
import { addCartItemHandler, updateCartItemHandler } from "../store/cart";
import { addItemHandler, deleteItemHandler } from "../store/wishlist";
import { toast } from "react-toastify";
import LoadingSpinner from "./common/LoadingSpinner";

const Product = ({
  productHandler,
  getProductReviews,
  addCartItemHandler,
  updateCartItemHandler,
  addItemHandler,
  deleteItemHandler,
}) => {
  let { id } = useParams();
  const cart = useSelector((state) => state.cart);
  const { items } = useSelector((state) => state.wishlist);
  const { product, reviews } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  useEffect(() => {
    Promise.all([productHandler(id), getProductReviews({ id: id })]).then(() =>
      setLoading(false)
    );
  }, [getProductReviews, id, productHandler]);
  const AddBag = () => {
    let item = cart.find(
      (item) =>
        (item.product_id === product.id || item.id === product.id) &&
        item.color === color &&
        item.size === size
    );
    if (item) {
      updateCartItemHandler({
        ...item,
        quantity:
          item.quantity + qty > product.quantity
            ? product.quantity
            : item.quantity + qty,
      });
    } else {
      addCartItemHandler({
        ...product,
        quantity:
          item.quantity + qty > product.quantity
            ? product.quantity
            : item.quantity + qty,
        color: color,
        size: size,
      });
    }
    toast("added to your cart");
  };

  useEffect(() => {
    if (product.size_and_color) {
      const sizeAndColor = JSON.parse(product.size_and_color);
      const sizes = sizeAndColor
        .map((item) => item.size)
        ?.filter((size, i, self) => self.indexOf(size) === i);
      if (sizes) {
        const colors = sizeAndColor
          .filter((item) => item.size === sizes?.[0])
          .map((item) => item.color);
        setSizes(sizes);
        setSize(sizes?.[0]);
        setColors(colors);
        setColor(colors?.[0]);
      } else {
        const colors = sizeAndColor?.map((item) => item.color);
        setColors(colors);
        setColor(colors?.[0]);
      }
    }
  }, [product]);
  useEffect(() => {
    if (sizes?.length !== 0 && colors?.length !== 0) {
      const sizeAndColor = JSON.parse(product.size_and_color);
      const colors = sizeAndColor
        .filter((item) => item.size === size)
        .map((item) => item.color);
      setColors(colors);
      setColor(colors?.[0]);
    }
  }, [colors?.length, product.size_and_color, size, sizes?.length]);
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <CRow
      className="justify-content-center align-items-start position-relative py-3 w-100 "
      // xs={{ gutter: 5 }}
    >
      <CCol
        xs={12}
        sm={10}
        md={8}
        lg={4}
        className="border-3 border border-light p-3 m-1"
      >
        {product?.pictures?.length > 0 && (
          <Carousel
            data={
              product?.pictures?.map((p) => {
                return { image: p.product_picture };
              }) ?? []
            }
            width="35rem"
            height="20rem"
            radius="10px"
            pauseIconColor="white"
            pauseIconSize="40px"
            slideImageFit="cover"
            thumbnails
            thumbnailWidth="50px"
            style={{
              textAlign: "left",
              maxWidth: "850px",
              maxHeight: "500px",
              margin: "40px auto",
            }}
          />
        )}
      </CCol>
      <CCol
        xs={10}
        md={6}
        lg={4}
        sm={8}
        className=" border-3 border border-light p-3 "
      >
        <CRow className="" xs={{ gutterY: 2 }}>
          <h3 className=" text-capitalize border-bottom border-2 py-2">
            {product.entitle}
          </h3>
          <div>
            <StarRatings
              rating={Number(product.rate) || 0}
              starDimension="1.5rem"
              starSpacing=".05rem"
              starRatedColor="yellow"
            />{" "}
            <span className="my-auto">({product.votes}) </span>
          </div>
          <h5 className="">Price: {product.price + " " + product.currency}</h5>
          <p className="">Description: {product.endescription}</p>
          <CCol xs={12} className="px-2">
            <h5>sizes</h5>
            <CRow xs={{ gutter: 1 }}>
              {Children.toArray(
                sizes?.map((_size, i) => (
                  <CCol xs="auto">
                    <CFormCheck
                      button={{ color: "outline-secondary" }}
                      type="radio"
                      name="size"
                      id={_size}
                      label={_size}
                      value={_size}
                      checked={size === _size}
                      onChange={(e) => setSize(e.target.value)}
                    />
                  </CCol>
                ))
              )}
            </CRow>
          </CCol>
          <CCol className="px-2">
            <h5>color</h5>
            <CRow xs={{ gutter: 1 }}>
              {Children.toArray(
                colors?.map((_color, i) => (
                  <CCol xs="auto">
                    <CFormCheck
                      button={{
                        color: "outline-secondary",
                        className: "mx-2 ",
                      }}
                      type="radio"
                      name="color"
                      id={_color}
                      label={_color}
                      value={_color}
                      checked={color === _color}
                      onChange={(e) => setColor(e.target.value)}
                    />
                  </CCol>
                ))
              )}
            </CRow>
          </CCol>
        </CRow>
      </CCol>
      <CCol
        xs={10}
        md={4}
        lg={3}
        xl={3}
        sm={6}
        xxl={2}
        className=" justify-content-center align-items-center  "
      >
        <CRow
          className="align-items-center justify-content-center shadow-box p-3 my-5 w-auto mx-auto   "
          xs={{ gutterY: 2 }}
        >
          <CCol xs={10} lg={12}>
            <CInputGroup>
              <CButton
                onClick={() => setQty((x) => x - 1)}
                disabled={qty === 1}
                color="info"
              >
                -
              </CButton>
              <CFormInput
                className=" bg-info  text-center border-info "
                value={qty}
                readOnly
              />
              <CButton
                onClick={() => setQty((x) => x + 1)}
                disabled={qty === product.quantity}
                color="info"
              >
                +
              </CButton>
            </CInputGroup>
          </CCol>

          <CCol xs={10} lg={12}>
            <CButton
              color="primary"
              className="mx-auto w-100 "
              onClick={AddBag}
            >
              {BagPlus && <BagPlus size={20} />}
              Add to cart
            </CButton>
          </CCol>
          <CCol xs={10} lg={12}>
            {items.find((i) => i?.product_id === product?.id) ? (
              <CButton color="success" className="w-100" disabled>
                <HeartFill color="red" /> in wishlist
              </CButton>
            ) : (
              <CButton
                color="success"
                className="w-100"
                onClick={() => addItemHandler(product)}
              >
                <Heart color="red" /> Add to wishlist
              </CButton>
            )}
          </CCol>
        </CRow>
      </CCol>
      {reviews?.data?.length !== 0 && (
        <CCol xs={8} className="shadow-box">
          <CRow xs={{ cols: 1, gutterY: 5 }}>
            <hr />
            {Children.toArray(
              reviews?.data?.map((review) => (
                <CCol>
                  <CCard className="mb-3 w-auto p-3 bg-light  ">
                    <CRow className="g-0">
                      <CCol xs={"auto"}>
                        <CAvatar
                          src={review.profile_picture}
                          className="mg-1"
                          size="xl"
                        />
                      </CCol>
                      <CCol md={8}>
                        <CCardBody>
                          <CCardTitle className=" border-bottom border-2 border-white text-start pb-2">
                            <strong>{`${review.first_name} ${review.last_name}`}</strong>
                          </CCardTitle>
                          <CCardText>
                            <h6>{review.review}</h6>
                          </CCardText>
                          <StarRatings
                            rating={review.rate}
                            starDimension="1.5rem"
                            starSpacing=".05rem"
                            starRatedColor="yellow"
                          />
                          <CCardText className="py-2">
                            <small className="text-medium-emphasis ">
                              {new Date(review.created_at).toLocaleDateString()}
                            </small>
                          </CCardText>
                        </CCardBody>
                      </CCol>
                    </CRow>
                  </CCard>
                </CCol>
              ))
            )}
          </CRow>
        </CCol>
      )}
    </CRow>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  wishlist: state.wishlist,
});
const mapDispatchToProps = {
  addItem,
  addProduct,
  productHandler,
  getProductReviews,
  addCartItemHandler,
  updateCartItemHandler,
  addItemHandler,
  deleteItemHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
