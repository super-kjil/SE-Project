import { notification } from "antd";
import { create } from "zustand"; // global state

// Config Store
export const configStore = create((set) => ({
  config: {
    category: null,
    role: null,
    supplier: null,
    purchase_status: null,
    brand: null,
    customer: null,
  },
  setConfig: (params) =>
    set(() => ({
      config: params,
    })),
}));

// Cart Store
export const useCartStore = create((set) => ({
  cart: [],

  // Load cart from localStorage
  loadCart: () => {
    const savedCart = localStorage.getItem("cart_list");
    return set(() => ({
      cart: savedCart ? JSON.parse(savedCart) : [],
    }));
  },

  addToBill: (item) =>
    set((state) => {
      const cart = [...state.cart]; // Copy the current cart state
      const findIndex = cart.findIndex((row) => row.barcode === item.barcode); // Check if the item is already in the cart
      let isNoStock = false;

      if (findIndex === -1) {
        // Item not in cart
        if (item.qty > 0) {
          cart.push({ ...item, cart_qty: 1 }); // Add the item to the cart with initial quantity
        } else {
          isNoStock = true; // No stock available
        }
      } else {
        // Item already in cart
        cart[findIndex].cart_qty += 1; // Increment the quantity
        if (item.qty < cart[findIndex].cart_qty) {
          isNoStock = true; // Check if the requested quantity exceeds stock
        }
      }

      // Notify user if there's no stock available
      if (isNoStock) {
        notification.error({
          message: "Warning",
          description: `No stock! Currently, only ${item.qty} available in stock.`,
          placement: "top",
          style: {
            backgroundColor: "hsl(359,100%,98%)",
            outline: "1px solid #ff4d4f",
          },
        });
        return state; // Return the current state without making changes
      }

      // Update cart in localStorage
      localStorage.setItem("cart_list", JSON.stringify(cart));

      // Update state with the modified cart
      return { cart };
    }),
  // New method to set the last order
  setLastOrder: (order) => set({ lastOrder: order }), // Update lastOrder

  // Clear the cart
  clearCart: () =>
    set(() => {
      localStorage.removeItem("cart_list");
      return { cart: [] };
    }),

  // Decrease item quantity
  decreaseQuantity: (barcode) =>
    set((state) => {
      const cart = [...state.cart];
      const itemIndex = cart.findIndex((item) => item.barcode === barcode);
      if (itemIndex !== -1 && cart[itemIndex].cart_qty > 1) {
        cart[itemIndex].cart_qty -= 1;
      }
      localStorage.setItem("cart_list", JSON.stringify(cart));
      return { cart };
    }),

  removeFromCart: (barcode) =>
    set((state) => {
      // Filter the cart to exclude the item with the specified barcode
      const updatedCart = state.cart.filter((item) => item.barcode !== barcode);

      // Update localStorage with the modified cart
      localStorage.setItem("home_cart_list", JSON.stringify(updatedCart));

      // Return a new state with the updated cart
      return { cart: [...updatedCart] }; // Spread operator ensures a new array reference
    }),
}));

// Cart Store for Home Page

export const useHomeCartStore = create((set) => ({
  cart: [],

  // Load cart from localStorage for Home Page
  loadCart: () => {
    const savedCart = localStorage.getItem("home_cart_list");
    return set(() => ({
      cart: savedCart ? JSON.parse(savedCart) : [],
    }));
  },

  addToCart: (item) =>
    set((state) => {
      const cart = [...state.cart]; // Copy the current cart state
      const findIndex = cart.findIndex((row) => row.barcode === item.barcode); // Check if the item is already in the cart

      if (findIndex === -1) {
        // Item not in the cart
        if (item.qty > 0) {
          cart.push({ ...item, cart_qty: 1 }); // Add the item to the cart with initial quantity
          localStorage.setItem("home_cart_list", JSON.stringify(cart)); // Update localStorage
          return { cart }; // Update state with the modified cart
        } else {
          // No stock available
          notification.error({
            message: "Warning",
            description: `No stock! Currently, only ${item.qty} available in stock.`,
            placement: "top",
            style: {
              backgroundColor: "hsl(359,100%,98%)",
              outline: "1px solid #ff4d4f",
            },
          });
          return state; // Return the current state without making changes
        }
      } else {
        // Item is already in the cart, notify the user
        notification.info({
          message: "Info",
          description: "Item is already in the cart.",
          placement: "top",
          style: {
            backgroundColor: "hsl(200,100%,95%)",
            outline: "1px solid #1890ff",
          },
        });
        return state; // Return the current state without making changes
      }
    }),
  // Clear the cart
  clearCart: () =>
    set(() => {
      localStorage.removeItem("cart_list");
      return { cart: [] };
    }),

  increaseQuantity: (barcode) =>
    set((state) => {
      const cart = [...state.cart]; // Copy the current cart state
      const findIndex = cart.findIndex((row) => row.barcode === barcode); // Find the item in the cart

      if (findIndex !== -1) {
        const item = cart[findIndex]; // Get the item
        if (item.qty > item.cart_qty) {
          // Check if there is enough stock to increase the quantity
          cart[findIndex].cart_qty += 1; // Increment the quantity
          localStorage.setItem("home_cart_list", JSON.stringify(cart)); // Update localStorage
          return { cart }; // Update state with the modified cart
        } else {
          // Stock is insufficient or 0
          notification.error({
            message: "Warning",
            description: `No stock available to increase quantity! Currently, only ${item.qty} items are available in stock.`,
            placement: "top",
            style: {
              backgroundColor: "hsl(359,100%,98%)",
              outline: "1px solid #ff4d4f",
            },
          });
          return state; // Return the current state without making changes
        }
      }

      return state; // If the item isn't found, return the current state
    }),

  // Decrease item quantity
  decreaseQuantity: (barcode) =>
    set((state) => {
      const cart = [...state.cart];
      const itemIndex = cart.findIndex((item) => item.barcode === barcode);
      if (itemIndex !== -1 && cart[itemIndex].cart_qty > 1) {
        cart[itemIndex].cart_qty -= 1;
      }
      localStorage.setItem("home_cart_list", JSON.stringify(cart));
      return { cart };
    }),

  removeFromCart: (barcode) =>
    set((state) => {
      // Filter the cart to exclude the item with the specified barcode
      const updatedCart = state.cart.filter((item) => item.barcode !== barcode);

      // Update localStorage with the modified cart
      localStorage.setItem("home_cart_list", JSON.stringify(updatedCart));

      // Return a new state with the updated cart
      return { cart: [...updatedCart] }; // Spread operator ensures a new array reference
    }),
}));
