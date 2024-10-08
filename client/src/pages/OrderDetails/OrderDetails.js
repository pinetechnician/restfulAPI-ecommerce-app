import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchOrders, fetchOrderById } from '../../redux/orders/ordersSlice';
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
                    <h3>Status: {order.orderStatus}</h3>
                    <ul>
                    {order.items.map((item) => (
                        <li>
                            <strong>{item.productName}</strong>
                            
                            <p>{item.itemNumber}</p>
                            <p>{item.quantity}</p>
                            <p>{item.itemPrice}</p>
                            
                        </li>
                    ))}
                    </ul>
                </>
            ) : (
                <p>Order not found.</p>
            )}
        </div>
    );
};

export default OrderDetails;