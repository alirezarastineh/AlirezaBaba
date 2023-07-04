import { ApiError } from "./types/ApiError";
import { CartItem } from "./types/Cart";
import { Product } from "./types/Product";

export const getError = (error: ApiError) => {
  return error.response?.data.message
    ? error.response.data.message // If the error response contains a message, return it
    : error.message; // Otherwise, return the error message
};

// Function to convert a Product object to a CartItem object
export const convertProductToCartItem = (product: Product): CartItem => {
  // Create a new CartItem object based on the Product properties
  const cartItem: CartItem = {
    _id: product._id,
    name: product.name,
    slug: product.slug,
    image: product.image,
    price: product.price,
    countInStock: product.countInStock,
    quantity: 1,
  };
  return cartItem;
};
