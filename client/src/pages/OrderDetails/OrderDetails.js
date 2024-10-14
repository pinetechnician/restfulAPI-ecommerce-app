import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchOrders, fetchOrderById } from '../../redux/orders/ordersSlice';
import withSessionCheck from '../../components/WithSessionCheck/WithSessionCheck';
import styles from './OrderDetails.module.css';

const OrderDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { order, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        console.log(id);
        if (id) {
            dispatch(fetchOrderById(id));
        }
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.orderDetails}>
            {order ? (
                <>
                    <h1>Order Id: {order.orderId}</h1>
                    <h2>Created at: {new Date(order.createdAt).toLocaleDateString()}</h2>
                    
                    <ul>
                    {order.items.map((item) => (
                        <li>
                            <strong>{item.productName}</strong>
                            
                            <p>Item number: {item.itemNumber}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${item.itemPrice}</p>
                            
                        </li>
                    ))}
                    </ul>
                    <h2>Total: ${order.orderTotal}</h2>
                    <h3>Status: {order.orderStatus}</h3>
                </>
            ) : (
                <p>Order not found.</p>
            )}
        </div>
    );
};

export default withSessionCheck(OrderDetails);