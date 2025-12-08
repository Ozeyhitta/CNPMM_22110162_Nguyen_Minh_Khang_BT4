import { createContext, useState } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    email: "",
    name: "",
    role: "",
  },
  appLoading: true,
});

// Shopping Cart Context
export const CartContext = createContext({
  cartItems: [],
  cartCount: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  purchaseCounts: {},
  buyNow: () => {},
});

export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: {
      email: "",
      name: "",
      role: "",
    },
  });

  const [appLoading, setAppLoading] = useState(true);

  // Cart state
  const [cartItems, setCartItems] = useState([]);

  // Purchase tracking state
  const [purchaseCounts, setPurchaseCounts] = useState({});

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const buyNow = (productId) => {
    setPurchaseCounts((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        appLoading,
        setAppLoading,
      }}
    >
      <CartContext.Provider
        value={{
          cartItems,
          cartCount,
          addToCart,
          removeFromCart,
          clearCart,
          purchaseCounts,
          buyNow,
        }}
      >
        {props.children}
      </CartContext.Provider>
    </AuthContext.Provider>
  );
};
