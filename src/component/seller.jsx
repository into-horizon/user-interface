import React, { useEffect, useState } from "react";
import mainProduct from "../static-data/mainProduct"
import { connect, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import StarRatings from 'react-star-ratings';
import { Tabs, Tab, Sonnet } from 'react-bootstrap'
import Image from 'react-bootstrap/Image'
import ProductCard from "./ProductCardV2";
import Store from '../services/Store'
import { CSpinner, CButton } from "@coreui/react";
import { getStoreProductsHandler } from "../store/products";
import { Col, Row } from "react-bootstrap"
import { cilPlus, cilShieldAlt, cilXCircle, cilUserFollow, cilUserUnfollow } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { followStoreHandler, unFollowStoreHandler } from "../store/following";


const Seller = ({ getStoreProductsHandler, followStoreHandler, unFollowStoreHandler }) => {
    const {login} = useSelector(state => state.sign)
    const { following } = useSelector(state => state.follow)
    const [seller, setSeller] = useState({})
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const { storeProducts } = useSelector(state => state.products)
    const [followed,setFollowed] = useState(false)
    const [followers, setFollowers] = useState(0)
    const id = useParams().id

    useEffect(() => {
        // let s = mainProduct.filter(x => x.id === id)[0]
        // console.log("🚀 ~ file: seller.jsx ~ line 14 ~ useEffect ~ mainProduct", mainProduct)
        Promise.all([Store.getStore(id), getStoreProductsHandler({ id: id })]).then(([{ data, status }]) => { setSeller(data); setLoading(false); setFollowers(Number(data.followers)) })

    }, [])

    useEffect(() => {
        
        setProducts(storeProducts)
    }, [storeProducts])

    useEffect(() => {
        console.log("🚀 ~ file: seller.jsx ~ line 44 ~ useEffect ~ following.find(s => s.store_id === seller.id)?.store_id", following.find(s => s.store_id === seller.id)?.store_id)
        setFollowed(()=> !!following.find(s => s.store_id === seller.id))
      
    },[following])

   
    
    return (
        <>
            {loading ? <CSpinner color="primary" /> :
                <div className="seller">
                    <section>
                        {/* <CLoadingButton color="info" spinnerType="grow" timeout={2000}>
                            Submit
                        </CLoadingButton> */}

                        {/* <img className='sellerAvatar' src={seller.image} alt="avatar" /> */}
                        <Image src={seller?.store_picture} alt="avatar" thumbnail={true} rounded={true} />
                        <div className="sellerDetails">
                            <h3>{seller.store_name}</h3>
                            <StarRatings
                                rating={seller.rate || 2.403}
                                starDimension="1.5rem"
                                starSpacing=".05rem"
                                starRatedColor="yellow"
                            />
                            <p>
                                {seller.caption}
                            </p>
                            <span className="followerSpan">followers: {followers}</span>
                            <br />
                           {login && <>
                            {followed ?
                                <CButton color="danger" onClick={() => unFollowStoreHandler(seller.id).then(()=> setFollowers(x=> --x))}>

                                    <CIcon icon={cilUserUnfollow} size="lg" />
                                    unfollow
                                </CButton> :
                                <CButton color="secondary" onClick={() => followStoreHandler(seller.id).then(()=> setFollowers(x=> ++x))}>
                                    <CIcon icon={cilUserFollow} size="lg" />
                                    follow
                                </CButton>


                            }
                            </>}
                        </div>

                    </section>
                    <hr />
                    <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
                        <Tab eventKey="home" title="Home" >
                            <h3>Welcome to out store</h3>
                            <p>Take all my loves, my love, yea take them all; What hast thou then more than thou hadst before? No love, my love, that thou mayst true love call; All mine was thine, before thou hadst this more. Then, if for my love, thou my love receivest, I cannot blame thee, for my love thou usest; But yet be blam'd, if thou thy self deceivest By wilful taste of what thyself refusest. I do forgive thy robbery, gentle thief, Although thou steal thee all my poverty:</p>
                        </Tab>
                        <Tab eventKey="Products" title="Products">
                            <h2 className="productstHead">Our Products</h2>
                            <div>
                                <Row>
                                    {React.Children.toArray(products.map(product =>

                                        <Col lg={6} md={6} sm={12} xs={12} xl={4} xxl={4} style={{ margin: '2rem 0' }} >

                                            <ProductCard product={product} itemType='product' pic='array' />


                                        </Col>
                                    ))
                                    }
                                </Row>
                            </div>
                        </Tab>
                        <Tab eventKey="contact" title="Contact" disabled>
                            <p>Take all my loves, my love, yea take them all; What hast thou then more than thou hadst before? No love, my love, that thou mayst true love call; All mine was thine, before thou hadst this more. Then, if for my love, thou my love receivest, I cannot blame thee, for my love thou usest; But yet be blam'd, if thou thy self deceivest By wilful taste of what thyself refusest. I do forgive thy robbery, gentle thief, Although thou steal thee all my poverty:</p>
                        </Tab>
                    </Tabs>

                </div>}
        </>
    )
}
const mapDispatchToProps = { getStoreProductsHandler, followStoreHandler, unFollowStoreHandler }
export default connect(null, mapDispatchToProps)(Seller);

