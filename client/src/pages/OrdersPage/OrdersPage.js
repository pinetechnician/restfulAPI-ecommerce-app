import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchOrders } from '../../redux/orders/ordersSlice';
import withSessionCheck from '../../components/WithSessionCheck/WithSessionCheck';
import styles from './OrdersPage.module.css';

const OrdersPage = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchOrders());
    }, []);

    if (loading) return <p>Loading...</p>;
    if (orders.length === 0) return <p>No orders found.</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            {orders.map((order) => (
                <div key={order.orderId} className={styles.orderCard}>
                    <Link to={`/orders/${order.orderId}`}>
                        <h2>Order Id: {order.orderId}</h2>  
                    </Link>
                    <h3>Total: ${order.orderTotal}</h3>
                    <h3>Created at: {new Date(order.createdAt).toLocaleDateString()}</h3>
                    <h3>Status: {order.orderStatus}</h3>
                </div>
            ))}
        </div>
    );
};

export default withSessionCheck(OrdersPage);