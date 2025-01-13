import React from "react";
import { useHomeCartStore } from "../store/configStore"; // Ensure this is correctly imported
import AddedTocart from "../component/clientPage/AddedTocart"; // Ensure this is correctly imported

function HomePageKitchen() {
  const { lastOrder } = useHomeCartStore(); // Access the last order from global state

  return (
    <div>
      <h1>HomePageKitchen</h1>
      {lastOrder && lastOrder.length > 0 ? (
        lastOrder.map((item, index) => <AddedTocart key={index} {...item} />)
      ) : (
        <p>No orders placed yet.</p>
      )}
    </div>
  );
}

export default HomePageKitchen;
