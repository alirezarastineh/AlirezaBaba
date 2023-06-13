import React from "react";
import { Cart, CartItem } from "./types/Cart";

type AppState = {
  mode: string;
  cart: Cart;
};

const storedMode = localStorage.getItem("mode");
const prefersDarkMode =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

let parsedCartItems;
const cartItems = localStorage.getItem("cartItems");
if (cartItems) {
  parsedCartItems = JSON.parse(cartItems);
} else {
  parsedCartItems = [];
}

let parsedShippingAddress;
const shippingAddress = localStorage.getItem("shippingAddress");
if (shippingAddress) {
  parsedShippingAddress = JSON.parse(shippingAddress);
} else {
  parsedShippingAddress = {};
}

const initialState: AppState = {
  mode: storedMode || (prefersDarkMode ? "dark" : "light"),
  cart: {
    cartItems: parsedCartItems,
    shippingAddress: parsedShippingAddress,
    paymentMethod: localStorage.getItem("paymentMethod") || "PayPal",
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
  },
};

type Action =
  | { type: "SWITCH_MODE" }
  | { type: "CART_ADD_ITEM"; payload: CartItem };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SWITCH_MODE":
      return { ...state, mode: state.mode === "dark" ? "light" : "dark" };
    case "CART_ADD_ITEM": {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item: CartItem) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item: CartItem) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      return { ...state, cart: { ...state.cart, cartItems } };
    }

    default:
      return state;
  }
}
const defaultDispatch: React.Dispatch<Action> = () => initialState;
const Store = React.createContext({
  state: initialState,
  dispatch: defaultDispatch,
});

interface StoreProviderProps {
  children: React.ReactNode;
}
function StoreProvider(props: StoreProviderProps) {
  const [state, dispatch] = React.useReducer<React.Reducer<AppState, Action>>(
    reducer,
    initialState
  );
  return <Store.Provider value={{ state, dispatch }} {...props} />;
}
export { Store, StoreProvider };
