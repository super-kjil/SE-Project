import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { notification } from "antd"; // Import notification from antd

const socket = io("http://localhost:8081");

function HomePageKitchen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    socket.on("newOrder", (orderDetails) => {
      setOrders((prevOrders) => [...prevOrders, orderDetails]);
    });

    socket.on("orderAlert", (message) => {
      notification.open({
        message: "New Order Alert",
        description: message,
        duration: 2, // Duration for the notification
      });
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderAlert"); // Clean up the listener
    };
  }, []);

  return (
    <div>
      <h1>HomePageKitchen</h1>
      {orders.length > 0 ? (
        orders.map((order, index) => (
          <div key={index}>
            {order.map((item, idx) => (
              <p key={idx}>
                {item.product_id} - Qty: {item.qty}
              </p>
            ))}
          </div>
        ))
      ) : (
        <p>No orders placed yet.</p>
      )}
    </div>
  );
}

export default HomePageKitchen;
