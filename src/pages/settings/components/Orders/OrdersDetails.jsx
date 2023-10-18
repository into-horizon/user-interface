import {
    CCol, CRow, CSpinner, CCard, CButton,
    CCardHeader, CCardTitle, CCardText, CCardBody
} from '@coreui/react'
import React, { useEffect, useState, Children } from 'react'
import { connect, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import ProductReviewModal from './ProductReviewModal'

export const OrdersDetails = (props) => {
    const { orders: { data: orders } } = useSelector(state => state.order)
    const [items, setItems] = useState([])
    const [orderStatus, setOrderStatus] = useState('')
    const [loading, setLoading] = useState(true)
    const [visible, setVisible] = useState(false)
    const [itemForReview, setItemForReview] = useState('')
    const { id } = useParams()
    useEffect(() => {
        setItems(orders.find(order => order.id === id).items)
        setOrderStatus(orders.find(order => order.id === id).status)
    }, [])
    useEffect(() => {
        items.length && setLoading(false)
    }, [items])
    useEffect(() => {
        setItems(orders.find(order => order.id === id).items)
        setOrderStatus(orders.find(order => order.id === id).status)
    }, [orders])

    return (
        <>
            <ProductReviewModal visible={visible} onClose={() => setVisible(false)} id={itemForReview} />
            {loading ? <CSpinner color="primary" /> :

                <CRow >
                    {Children.toArray(items.map(item =>
                        <CCol>

                            <CCard>
                                <Link to={`/product/${item.product_id}`} target="_blank">
                                    <CCardHeader component="h5">{item.entitle}</CCardHeader>
                                </Link>
                                <CCardBody>
                                    <CRow xs={{ gutterY: 1 }} className='mg-1'>
                                        <CCol>
                                            <CCardTitle>price</CCardTitle>
                                            <CCardText>{item.price}</CCardText>

                                        </CCol>
                                        <CCol>

                                            <CCardTitle>quantity</CCardTitle>
                                            <CCardText>{item.quantity}</CCardText>
                                        </CCol>
                                        {item.size && <CCol>
                                            <CCardTitle>size</CCardTitle>
                                            <CCardText>{item.size}</CCardText>
                                        </CCol>}
                                        {item.color && <CCol>
                                            <CCardTitle>color</CCardTitle>
                                            <CCardText>{item.color}</CCardText>
                                        </CCol>}
                                        <CCol>
                                            <CCardTitle>status</CCardTitle>
                                            <CCardText>{item.status}</CCardText>
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        {orderStatus === 'delivered' && !item.rated && item.status === 'accepted' && <CCol xs='auto'>
                                            <CButton color="secondary" onClick={() => { setVisible(true); setItemForReview(item.id) }}>submit review</CButton>

                                        </CCol>}
                                        {orderStatus === 'delivered' && item.status === 'accepted' && <CCol xs='auto'>

                                            <CButton color="danger">request a return</CButton>
                                        </CCol>}
                                    </CRow>
                                </CCardBody>
                            </CCard>


                        </CCol>
                    ))

                    }
                </CRow>

            }

        </>
    )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersDetails)