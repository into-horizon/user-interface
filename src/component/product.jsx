import React, { useEffect, useState, Children } from "react";
import { Carousel } from 'react-carousel-minimal';
import { connect, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import StarRatings from 'react-star-ratings';
import { addItem } from '../store/cart';
import { addProduct } from '../store/wishlist'
import { If, Then, Else } from 'react-if'
import { productHandler, getProductReviews } from "../store/products";
import { CAvatar, CButton, CCol, CRow, CSpinner } from "@coreui/react";
import { BagPlus, HeartFill, Heart } from 'react-bootstrap-icons';
import {addCartItemHandler,updateCartItemHandler} from '../store/cart'
import { addItemHandler, deleteItemHandler } from '../store/wishlist'
import { ToastContainer, toast } from 'react-toastify';

const Product = ({ productHandler, getProductReviews,addCartItemHandler,updateCartItemHandler ,addItemHandler, deleteItemHandler}) => {
  let { id } = useParams()
  const cart = useSelector(state => state.cart)
  const {items} = useSelector(state => state.wishlist)
  const { product, reviews } = useSelector(state => state.products)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [color, setColor] = useState(null)
  const [size, setSize] = useState(null)
  useEffect(() => {
    Promise.all([productHandler(id), getProductReviews({ id: id })]).then(() => setLoading(false))

  }, [])
  const AddBag = () => {
    let item = cart.find(item => (item.product_id === product.id || item.id === product.id) && item.color === color && item.size === size);
    if (item) {
      updateCartItemHandler({ ...item, quantity: item.quantity + qty > product.quantity ? product.quantity: item.quantity + qty })
    } else {
      addCartItemHandler({ ...product, quantity: item.quantity + qty > product.quantity ? product.quantity: item.quantity + qty, color: color, size: size })
    }
    toast("added to your cart")
  };
  return (
    <CRow className="product justify-content-center" xs={{ gutterY: 3 }} >
      <CCol xs={4}>
        {loading ? <CSpinner /> :
          product?.pictures?.length > 0 && <Carousel data={product?.pictures?.map(p => { return { image: p.product_picture } }) ?? []}
            width="35rem"
            height="20rem"
            radius="10px"


            pauseIconColor="white"
            pauseIconSize="40px"

            slideImageFit="cover"
            thumbnails={true}
            thumbnailWidth="100px"
            style={{
              textAlign: "left",
              maxWidth: "850px",
              maxHeight: "500px",
              margin: "40px 0",
            }} />}

      </CCol>
      <CCol xs={4}>
        <section className="productContent">
          <h3 className="productHead">
            {product.entitle}
          </h3>
          <StarRatings
            rating={Number(product.rate) || 0}
            starDimension="1.5rem"
            starSpacing=".05rem"
            starRatedColor="yellow"
          />  <span>({product.votes}) </span>
          <h5 className="productPrice">Price: {product.price}</h5>
          <p className="productDescription">Description: {product.endescription}</p>
        </section>

      </CCol>
      <CCol xs={2} className="card-btns">

        <CRow className="align-items-center justify-content-center shadow-box pd-1rem" xs={{ gutterY: 2 }} >

          <CCol xs={10} >

            <div className="icCart"><button className="btn" onClick={() => setQty(x=> x-1)} disabled={qty === 1}>-</button><span className="in">{qty}</span><button className="btn" onClick={() => setQty(x=> x+1)} disabled={qty=== product.quantity}>+</button></div>
          </CCol>

          <CCol xs={12} >

            <CButton color="primary" className="center-btn" onClick={AddBag}><BagPlus size={20} />{' '}Add to cart</CButton>
          </CCol>
          <CCol xs={12} >

          {items.find(i => i.product_id === product.id)?  <CButton color='success' className="center-btn" disabled>
             
              <HeartFill color='red' />
              {' '}
              in wishlist

            </CButton>: <CButton color='success' className="center-btn" onClick={() =>addItemHandler(product)}>
              <Heart color='red'/>
            
              {' '}
              Add to wishlist

            </CButton>}

          </CCol>
        </CRow>

     

      </CCol>
      <CCol xs={8} className='shadow-box'>
        <CRow xs={{ cols: 1, gutterY: 5 }}>
          <hr />
{          console.log("🚀 ~ file: product.jsx:117 ~ Product ~ reviews:", reviews)
}          {Children.toArray(reviews?.data?.map(review =>
            <CCol>

              <CAvatar src={review.profile_picture} className="mg-1"></CAvatar>

              <strong>{`${review.first_name} ${review.last_name}`}</strong>
              <br/>
              <StarRatings
                rating={review.rate}
                starDimension="1.5rem"
                starSpacing=".05rem"
                starRatedColor="yellow"
              />
              <h6>{review.review}</h6>
              <span>{new Date(review.created_at).toLocaleDateString()}</span>
              <hr />
            </CCol>

          ))

          }
        </CRow>
      </CCol>
    </CRow>
  )
}

const mapStateToProps = (state) => ({
  cart: state.cart,
  wishlist: state.wishlist
})
const mapDispatchToProps = { addItem, addProduct, productHandler, getProductReviews,addCartItemHandler,updateCartItemHandler,addItemHandler, deleteItemHandler }

export default connect(mapStateToProps, mapDispatchToProps)(Product);

