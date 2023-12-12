import React, { useState, useEffect } from "react";
// import "./productCard.0css";
import { connect } from "react-redux";
import { addCartItemHandler, updateCartItemHandler } from "../store/cart";
import StarRatings from "react-star-ratings";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import image from "../assets/no-image.png";
import { Button, Card, Col, Row } from "react-bootstrap";
import { addItemHandler, deleteItemHandler } from "../store/wishlist";
import CIcon from "@coreui/icons-react";
import { cilBasket } from "@coreui/icons";
import { CButton, CFormSelect, CTooltip } from "@coreui/react";
import { Heart, HeartFill } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { namespaces } from "../i18n";
import landingPage from "../store/landingPage";

const ProductCard = ({
  cart,
  wishlist,
  addCartItemHandler,
  product,
  addItemHandler,
  deleteItemHandler,
  updateCartItemHandler,
}) => {
  const { t, i18n } = useTranslation([
    namespaces.PRODUCT.ns,
    namespaces.COLOR.ns,
  ]);
  const [heart, setheart] = useState(1);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const AddBag = (product) => {
    let item = cart.find(
      (item) =>
        (item.product_id === product.id || item.id === product.id) &&
        item.color === color &&
        item.size === size
    );
    if (item) {
      updateCartItemHandler({ ...item, quantity: item.quantity + 1 });
    } else {
      addCartItemHandler({ ...product, quantity: 1, color: color, size: size });
    }
  };
  const heartFunction = (product) => {
    if (heart) {
      setheart(0);
      addItemHandler(product);
    } else {
      setheart(1);
      deleteItemHandler(product);
    }
  };

  useEffect(() => {
    const arr = JSON.parse(product.size_and_color);
    if (arr?.length > 0) {
      let _colors = arr
        .filter(
          (v, i, a) =>
            i === a.findIndex((x) => x.color === v.color) && v.quantity
        )
        .map((v) => v.color)
        .filter((value) => value);
      let _sizes = arr
        .filter(
          (v, i, a) => i === a.findIndex((x) => x.size === v.size) && v.quantity
        )
        .map((v) => v.size)
        .filter((value) => value);
      if (_sizes.length > 0 && _colors.length > 0) {
        setSizes(() => _sizes);
        setSize(() => _sizes[0]);
      } else if (_sizes.length > 0 && _colors.length === 0) {
        setSizes(() => _sizes);
        setSize(() => _sizes[0]);
      } else if (_sizes.length === 0 && _colors.length > 0) {
        setColors(() => _colors);
        setColor(() => _colors[0]);
      }
    }
  }, [product.size_and_color]);
  useEffect(() => {
    const arr = JSON.parse(product.size_and_color);
    let _colors = arr
      ?.filter(
        (v, i, a) =>
          i ===
          a.findIndex(
            (x) => x.color === v.color && v.size === size && v.quantity
          )
      )
      .map((v) => v.color)
      .filter((value) => value);
    if (_colors?.length > 0) {
      setColors(() => _colors);
      setColor(() => _colors[0]);
    }
  }, [product.size_and_color, size]);
  useEffect(() => {
    if (
      wishlist.find(
        (x) => x?.id === product?.id || x?.product_id === product?.id
      )
    ) {
      setheart(0);
    } else {
      setheart(1);
    }
  }, [product?.id, wishlist]);

  return (
    <>
      <Card className="position-relative m-auto w-100 h-100">
        <small
          className="position-absolute"
          style={{ top: 10, left: 10 }}
          onClick={() => heartFunction(product)}
        >
          {/* <i
            onClick={() => Heart(product)}
            className={`fa ${heart ? "fa-heart-o" : "fa-heart"}`}
          ></i> */}
          {/* <CIcon icon={cilHeart}   /> */}
          {heart ? <Heart color="red" /> : <HeartFill color="red" />}
        </small>
        <Card.Img
          variant="top"
          src={product.pictures?.product_picture ?? image}
          className="w-100 mx-auto"
        />
        <Card.Header>
          {" "}
          <Link to={`/store/${product.store_id}`}>
            <small>{product.store_name}</small>
          </Link>
        </Card.Header>
        <Card.Body>
          <Card.Title>
            {" "}
            <Link to={`/product/${product.id}`} className="card-link">
              {product[`${i18n.language}title`]}
            </Link>
          </Card.Title>
          <Card.Subtitle>{t("description".toUpperCase())}</Card.Subtitle>
          <Card.Text>{product[`${i18n.language}description`]}</Card.Text>
        </Card.Body>
        <Card.Body>
          <StarRatings
            rating={Number(product?.rate) || 0}
            starDimension="1.5rem"
            starSpacing=".05rem"
            starRatedColor="yellow"
          />
        </Card.Body>
        <Card.Body className="m-0 py-0">
          <Row className=" justify-content-between  align-content-center ">
            {sizes.length > 0 && (
              <Col
                xs="4"
                // xs={4} sm={4} md={5} lg={4} xl={4}
              >
                <>
                  <CFormSelect
                    id="size"
                    onChange={(e) => setSize(e.target.value)}
                    floatingLabel={t("size".toUpperCase())}
                  >
                    {sizes.map((size, i) => (
                      <option key={`size${i}`} value={size}>
                        {size}
                      </option>
                    ))}
                  </CFormSelect>
                  {/* <Form.Group className="mb-3">
                    <Form.Label>{t("size".toUpperCase())}</Form.Label>
                  </Form.Group> */}
                </>
              </Col>
            )}
            {colors.length > 0 && (
              <Col
                xs="4"
                // xs={{ span: 5, offset: 3 }}
                // md={{ span: 7, offset: 0 }}
                // lg={{ span: 5, offset: 3 }}
                // xl={{ span: 6, offset: 2 }}
              >
                <>
                  <CFormSelect
                    id="color"
                    onChange={(e) => setColor(e.target.value)}
                    floatingLabel={t("Color".toUpperCase())}
                  >
                    {colors.map((color, i) => (
                      <option key={`color${i}`} value={color}>
                        {t(color, namespaces.COLOR)}
                      </option>
                    ))}
                  </CFormSelect>
                  {/* <Form.Group className="mb-3">
                    <Form.Label>{t("Color".toUpperCase())}</Form.Label>
                  </Form.Group> */}
                </>
              </Col>
            )}
          </Row>
        </Card.Body>
        <Card.Body
          as={Row}
          className="justify-content-between align-items-center my-3 py-0"
        >
          <Col xs={9} className="my-3">
            <Card.Link
              as={"span"}
              className="text-dark fw-bold bg-light p-3  border-1 rounded align-self-end"
            >
              {product.discount ? (
                <>
                  <sup className="text-decoration-line-through">
                    {`${product.price} ${t(product.currency.toUpperCase())}`}
                  </sup>{" "}
                  {`${
                    product.price * (1 - product.discount_rate).toFixed(2)
                  } ${t(product.currency.toUpperCase())}`}
                </>
              ) : (
                `${product.price} ${t(product.currency.toUpperCase())}`
              )}
            </Card.Link>
          </Col>
          <Col xs={3}>
            <CTooltip
              content={
                product.quantity <= 0 ? t("OUT_OF_STOCK") : t("ADD_TO_CART")
              }
            >
              {/* <Card.Link
                as={Button}
                onClick={() => AddBag(product)}
                disabled={product.quantity <= 0}
              >
                <CIcon icon={cilBasket} size="lg" />
              </Card.Link> */}
              <CButton
                onClick={() => AddBag(product)}
                disabled={product.quantity <= 0}
                size="lg"
                className=" text-light "
              >
                <CIcon icon={cilBasket} size="xl" />
              </CButton>
            </CTooltip>
          </Col>
        </Card.Body>
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  wishlist: state.wishlist.items,
});

const mapDispatchToProps = {
  addCartItemHandler,
  addItemHandler,
  deleteItemHandler,
  updateCartItemHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);
