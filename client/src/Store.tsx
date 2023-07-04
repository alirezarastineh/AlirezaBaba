import React from "react";
import { Cart, CartItem, ShippingAddress, Location } from "./types/Cart";
import { UserInfo } from "./types/Users/UserInfo";

// Defining the AppState type which will be the state of our application
type AppState = {
  mode: string;
  fullBox: boolean;
  cart: Cart;
  userInfo?: UserInfo;
};

const initialState: AppState = {
  // The mode is either from local storage or set based on the user's preferred color scheme
  mode:
    localStorage.getItem("mode") ||
    (window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"),

  // The fullBox is initially set to false
  fullBox: false,

  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo") || "{}")
    : null,

  // The cart is initially empty, with default values for each field
  cart: {
    cartItems: JSON.parse(localStorage.getItem("cartItems") || "[]"),
    shippingAddress: JSON.parse(
      localStorage.getItem("shippingAddress") || "{}"
    ),
    paymentMethod: localStorage.getItem("paymentMethod") || "PayPal",
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
  },
};

// Defining the types of actions that can be dispatched
type Action =
  | { type: "SWITCH_MODE" }
  | { type: "SET_FULLBOX_ON" }
  | { type: "SET_FULLBOX_OFF" }
  | { type: "CART_ADD_ITEM"; payload: CartItem }
  | { type: "CART_REMOVE_ITEM"; payload: CartItem }
  | { type: "CART_CLEAR" }
  | { type: "USER_SIGNIN"; payload: UserInfo }
  | { type: "USER_SIGNOUT" }
  | { type: "SAVE_SHIPPING_ADDRESS"; payload: ShippingAddress }
  | { type: "SAVE_PAYMENT_METHOD"; payload: string }
  | { type: "SAVE_SHIPPING_ADDRESS_MAP_LOCATION"; payload: Location };

// Handle dispatched actions and update the state accordingly
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SWITCH_MODE":
      localStorage.setItem("mode", state.mode === "dark" ? "light" : "dark");
      return { ...state, mode: state.mode === "dark" ? "light" : "dark" };

    case "SET_FULLBOX_ON":
      return { ...state, fullBox: true };
    case "SET_FULLBOX_OFF":
      return { ...state, fullBox: false };

    // Adds a new item to the cart or updates an existing item, and saves the new cart in local storage
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

    // Removes an item from the cart and saves the new cart in local storage
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item: CartItem) => item._id !== action.payload._id
      );
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    // Clears the cart
    case "CART_CLEAR":
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    // Sets the userInfo field to the payload of the action
    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };

    // Resets the state to its initial values
    case "USER_SIGNOUT":
      return {
        ...state,
        mode:
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light",
        cart: {
          cartItems: [],
          paymentMethod: "PayPal",
          shippingAddress: {
            fullName: "",
            location: { lat: 0, lng: 0 },
            address: "",
            postalCode: "",
            city: "",
            country: "",
          },
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
      };

    // Updates the shippingAddress field in the cart
    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };

    // Updates the location field in the shippingAddress
    case "SAVE_SHIPPING_ADDRESS_MAP_LOCATION":
      return state.cart.shippingAddress
        ? {
            ...state,
            cart: {
              ...state.cart,
              shippingAddress: {
                ...state.cart.shippingAddress,
                location: action.payload,
              },
            },
          }
        : {
            ...state,
            cart: {
              ...state.cart,
              shippingAddress: {
                fullName: "",
                address: "",
                city: "",
                postalCode: "",
                country: "",
                location: action.payload,
              },
            },
          };

    // Updates the paymentMethod field in the cart
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };

    // If the dispatched action doesn't match any of the cases, the state is returned as is
    default:
      return state;
  }
}

const defaultDispatch: React.Dispatch<Action> = () => initialState;

const Store = React.createContext({
  state: initialState,
  dispatch: defaultDispatch,
});

// Defining the props for our StoreProvider component
interface StoreProviderProps {
  children: React.ReactNode;
}

// Provide the state and dispatch function to its children
function StoreProvider(props: StoreProviderProps) {
  const [state, dispatch] = React.useReducer<React.Reducer<AppState, Action>>(
    reducer,
    initialState
  );
  return <Store.Provider value={{ state, dispatch }} {...props} />;
}

export { Store, StoreProvider };
