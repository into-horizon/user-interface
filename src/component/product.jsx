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
  CCardFooter,
  CCardGroup,
  CCardHeader,
  CCardSubtitle,
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
import LoadingSpinner from "./common/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { namespaces } from "../i18n";

const Product = ({
  productHandler,
  getProductReviews,
  addCartItemHandler,
  updateCartItemHandler,
  addItemHandler,
  deleteItemHandler,
}) => {
  let { id } = useParams();
  const { t, i18n } = useTranslation([
    namespaces.PRODUCT.ns,
    namespaces.COLOR.ns,
  ]);
  const cart = useSelector((state) => state.cart);
  const { ids: wishlistIds } = useSelector((state) => state.wishlist);
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
          item.quantity + qty > product?.quantity
            ? product?.quantity
            : item.quantity + qty,
      });
    } else {
      addCartItemHandler({
        ...product,
        quantity: qty > product?.quantity ? product?.quantity : qty,
        color: color,
        size: size,
      });
    }
    // toast("added to your cart");
  };

  useEffect(() => {
    if (product.size_and_color) {
      const sizeAndColor = JSON.parse(product.size_and_color);
      const sizes = sizeAndColor
        .map((item) => item.size)
        ?.filter((size, i, self) => self.indexOf(size) === i && size);
      if (sizes.length > 0) {
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
      className="justify-content-center align-items-start position-relative py-3 w-100 gy-3 "
      // xs={{ gutter: 5 }}
    >
      <CCol
        xs={12}
        sm={10}
        md={8}
        lg={4}
        // className="border-3 border border-light p-3 m-1"
      >
        <CCard>
          {product?.pictures?.length > 0 && (
            <Carousel
              data={
                product?.pictures?.map((p) => {
                  return { image: p };
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
        </CCard>
      </CCol>
      <CCol
        xs={10}
        md={6}
        lg={4}
        sm={8}
        // className=" border-3 border border-light p-3 "
      >
        <CCard>
          <CCardHeader>
            <CCardTitle>{product[`${i18n.language}title`]}</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <StarRatings
              rating={Number(product.rate) || 0}
              starDimension="1.5rem"
              starSpacing=".05rem"
              starRatedColor="yellow"
            />{" "}
            <span className="my-auto">({product.votes}) </span>
          </CCardBody>
          <CCardBody>
            <CCardSubtitle>
              {`${t("PRICE")}: ${product.final_price} ${t(
                product.currency.toUpperCase()
              )}`}
            </CCardSubtitle>
          </CCardBody>
          <CCardBody>
            <CCardText>
              {" "}
              {`${t("DESCRIPTION")}: ${product[`${i18n.language}title`]}`}
            </CCardText>
          </CCardBody>
          <CCardBody>
            {sizes?.length > 0 && (
              <CCardBody>
                <CCardSubtitle className="mb-2">
                  {t("sizes".toUpperCase())}
                </CCardSubtitle>
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
              </CCardBody>
            )}
            {colors?.length > 0 && (
              <CCardBody>
                <CCardSubtitle className="mb-2">
                  {t("colors".toUpperCase())}
                </CCardSubtitle>
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
                          label={t(_color, namespaces.COLOR)}
                          value={_color}
                          checked={color === _color}
                          onChange={(e) => setColor(e.target.value)}
                        />
                      </CCol>
                    ))
                  )}
                </CRow>
              </CCardBody>
            )}
          </CCardBody>
          <CCardFooter>
            <CRow
              className="align-items-center flex-column  justify-content-center p-3 w-auto mx-auto   "
              xs={{ gutterY: 2 }}
            >
              <CCol xs={12} md={9} lg={9} xl={7} xxl={6}>
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

              <CCol xs={12} md={9} lg={9} xl={7} xxl={6}>
                <CButton
                  color="primary"
                  className="mx-auto w-100 "
                  onClick={AddBag}
                >
                  {BagPlus && <BagPlus size={20} className="mx-1" />}
                  {t("Add_to_cart".toUpperCase())}
                </CButton>
              </CCol>
              <CCol xs={12} md={10} lg={"auto"}>
                {wishlistIds.includes(product?.id) ? (
                  <CButton color="success" className="w-100" disabled>
                    <HeartFill color="red" /> in wishlist
                  </CButton>
                ) : (
                  <CButton
                    color="success"
                    className="w-100"
                    onClick={() => addItemHandler(product)}
                  >
                    <Heart color="red" /> {t("ADD_TO_WISHLIST")}
                  </CButton>
                )}
              </CCol>
            </CRow>
          </CCardFooter>
        </CCard>
      </CCol>
      {reviews?.data?.length !== 0 && (
        <CCol xs={8} className="mb-5">
          <CCard>
            <CCardHeader>
              <CCardTitle>{t("Reviews".toUpperCase())}</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CRow xs={{ cols: 1, gutterY: 5 }} className="mt-1">
                {Children.toArray(
                  reviews?.data?.map((review) => (
                    <CCardGroup>
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
                              <CCardTitle className=" border-bottom border-2 border-white w-fit-content pb-2">
                                <strong>{`${review.first_name} ${review.last_name}`}</strong>
                              </CCardTitle>
                              <StarRatings
                                rating={review.rate}
                                starDimension="1.5rem"
                                starSpacing=".05rem"
                                starRatedColor="yellow"
                              />
                              <CCardBody>
                                <CCardSubtitle>{review.review}</CCardSubtitle>
                              </CCardBody>
                              <CCardText className="py-2">
                                <small className="text-medium-emphasis ">
                                  {new Date(
                                    review.created_at
                                  ).toLocaleDateString()}
                                </small>
                              </CCardText>
                            </CCardBody>
                          </CCol>
                        </CRow>
                      </CCard>
                    </CCardGroup>
                  ))
                )}
              </CRow>
            </CCardBody>
          </CCard>
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
