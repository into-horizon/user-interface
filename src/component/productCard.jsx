import React, { useState, useEffect, useMemo } from 'react';
// import "./productCard.0css";
import { connect, useSelector } from 'react-redux';
import { addCartItemHandler, updateCartItemHandler } from '../store/cart';
import StarRatings from 'react-star-ratings';
import { Link } from 'react-router-dom';
import image from '../assets/no-image.png';
import { Card, Col, Row } from 'react-bootstrap';
import { addItemHandler, deleteItemHandler } from '../store/wishlist';
import CIcon from '@coreui/icons-react';
import { cilBasket, cilCheck } from '@coreui/icons';
import { CButton, CFormSelect, CTooltip } from '@coreui/react';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../i18n';
import { CartItemModel, WishlistItemModel } from '../services/Models';

const ProductCard = ({
  cart,
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
  const { ids: wishlistIds } = useSelector((state) => state.wishlist);
  const { data } = useSelector((state) => state.cart);
  const [heart, setHeart] = useState(1);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [price, setPrice] = useState(product.price);
  const [success, setSuccess] = useState(false);
  const wishlistItem = { ...new WishlistItemModel(product) };
  const cartItem = useMemo(() => {
    return {
      ...new CartItemModel({
        ...product,
        size,
        color,
        quantity: 1,
        product_quantity: product?.quantity,
      }),
    };
  }, [product, size, color]);

  const productCartItem = useMemo(
    () => data.find((item) => item.product_id === product.id),
    [data]
  );
  const addItem = () => {
    const item = cart.find(
      (item) =>
        item.product_id === cartItem.product_id &&
        item.color === color &&
        item.size === size
    );
    if (item) {
      updateCartItemHandler({ ...item, quantity: item.quantity + 1 });
    } else {
      addCartItemHandler({
        ...cartItem,
        quantity: 1,
        color,
        size,
        price,
      });
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 500);
  };
  const heartFunction = () => {
    if (heart) {
      setHeart(0);
      addItemHandler(wishlistItem);
    } else {
      setHeart(1);
      deleteItemHandler(wishlistItem);
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
    if (wishlistIds.includes(product.id)) {
      setHeart(0);
    } else {
      setHeart(1);
    }
  }, [product.id, wishlistIds]);
  useEffect(() => {
    if (product.discount) {
      setPrice((price) =>
        (+price - +price * +product.discount_rate)?.toFixed(2)
      );
    }
    if (!product.is_commission_included) {
      setPrice((price) => (+price + +price * +product.commission)?.toFixed(2));
    }
  }, [product]);
  return (
    <>
      <Card className='position-relative m-auto w-100 h-100'>
        <small
          className='position-absolute'
          style={{ top: 10, left: 10 }}
          onClick={() => heartFunction(product)}
        >
          {/* <i
            onClick={() => Heart(product)}
            className={`fa ${heart ? "fa-heart-o" : "fa-heart"}`}
          ></i> */}
          {/* <CIcon icon={cilHeart}   /> */}
          {heart ? <Heart color='red' /> : <HeartFill color='red' />}
        </small>
        <Card.Img
          variant='top'
          src={product.pictures?.[0] ?? image}
          className='w-100 mx-auto'
        />
        <Card.Header>
          {' '}
          <Link to={`/store/${product.store_id}`}>
            <small>{product.store_name}</small>
          </Link>
        </Card.Header>
        <Card.Body>
          <Card.Title>
            {' '}
            <Link to={`/product/${product.id}`} className='card-link'>
              {product[`${i18n.language}title`]}
            </Link>
          </Card.Title>
          <Card.Subtitle>{t('description'.toUpperCase())}</Card.Subtitle>
          <Card.Text>{product[`${i18n.language}description`]}</Card.Text>
        </Card.Body>
        <Card.Body>
          <StarRatings
            rating={Number(product?.rate) || 0}
            starDimension='1.5rem'
            starSpacing='.05rem'
            starRatedColor='yellow'
          />
        </Card.Body>
        <Card.Body className='m-0 py-0'>
          <Row className=' justify-content-between  align-content-center '>
            {sizes.length > 0 && (
              <Col xs='auto'>
                <>
                  <CFormSelect
                    id='size'
                    onChange={(e) => setSize(e.target.value)}
                    floatingLabel={t('size'.toUpperCase())}
                  >
                    {sizes.map((size, i) => (
                      <option key={`size${i}`} value={size}>
                        {size}
                      </option>
                    ))}
                  </CFormSelect>
                </>
              </Col>
            )}
            {colors.length > 0 && (
              <Col xs='auto'>
                <>
                  <CFormSelect
                    id='color'
                    onChange={(e) => setColor(e.target.value)}
                    floatingLabel={t('Color'.toUpperCase())}
                  >
                    {colors.map((color, i) => (
                      <option key={`color${i}`} value={color}>
                        {t(color, namespaces.COLOR)}
                      </option>
                    ))}
                  </CFormSelect>
                </>
              </Col>
            )}
          </Row>
        </Card.Body>
        <Card.Body
          as={Row}
          className='justify-content-between align-items-center my-3 py-0'
        >
          <Col xs='auto' className='my-3'>
            <Card.Link
              as={'span'}
              className='text-dark fw-bold bg-light p-3  border-1 rounded align-self-end'
            >
              {product.discount ? (
                <>
                  <sup className='text-decoration-line-through'>
                    {`${(
                      product.final_price *
                      (1 + product.discount_rate)
                    )?.toFixed(2)} ${t(product.currency.toUpperCase())}`}
                  </sup>{' '}
                  {`${product.final_price?.toFixed(2)} ${t(
                    product.currency.toUpperCase()
                  )}`}
                </>
              ) : (
                `${product.final_price?.toFixed(2)} ${t(
                  product.currency.toUpperCase()
                )}`
              )}
            </Card.Link>
          </Col>
          <Col xs='auto'>
            <CTooltip
              content={
                product.quantity <= 0 ? t('OUT_OF_STOCK') : t('ADD_TO_CART')
              }
            >
              {success ? (
                <CButton color='success' size='lg'>
                  <CIcon icon={cilCheck} size='xl' />
                </CButton>
              ) : (
                <CButton
                  onClick={() => addItem(product)}
                  disabled={
                    product.quantity <= 0 ||
                    productCartItem?.quantity === product.quantity
                  }
                  size='lg'
                  className=' text-light '
                >
                  <CIcon icon={cilBasket} size='xl' />
                </CButton>
              )}
            </CTooltip>
          </Col>
        </Card.Body>
        {productCartItem && (
          <Card.Footer className=' bg-light p-0'>
            <p className='text-center m-0'>
              {productCartItem
                ? t('IN_CART', { count: productCartItem.quantity })
                : ''}
            </p>
          </Card.Footer>
        )}
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart.data,
  wishlist: state.wishlist.items,
});

const mapDispatchToProps = {
  addCartItemHandler,
  addItemHandler,
  deleteItemHandler,
  updateCartItemHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);
