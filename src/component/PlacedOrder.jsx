import React, { useState, useEffect }from 'react'
import {useSelector} from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'
import {clearPlacedOrder} from '../store/order'
import {useDispatch} from 'react-redux'

const PlacedOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [orderId, setOrderId] = useState('')
    const {placedOrder} = useSelector(state => state.order)
  useEffect (() => {
    placedOrder.id ? setOrderId(placedOrder.customer_order_id) : navigate('/')
    dispatch(clearPlacedOrder({}))
  }, [])
  return (
    <div className='cart' style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center',padding: '10% 0'}}>
    <h1 >Congratulations! your order#{orderId} has been placed successfully.</h1>
        <Link to='/'>Home</Link>
    </div>
  )
}

export default PlacedOrder