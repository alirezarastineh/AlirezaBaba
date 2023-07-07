import { useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../../Store";
import { CartItem } from "../../types/Cart";
import { Product } from "../../types/Product";
import { convertProductToCartItem } from "../../utils";
import Rating from "./Rating";

function ProductItem({ product }: { product: Product }) {
  // Access the global state and dispatch function from the Store context
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems }, // Destructure the cartItems array from the global state
  } = state;

  const addToCartHandler = (item: CartItem) => {
    // Check if the product already exists in the cart
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1; // Increase the quantity if the product already exists

    // Check if the quantity exceeds the available stock
    if (product.countInStock < quantity) {
      alert("Sorry. Product is out of stock");
      return;
    }

    // Dispatch an action to add the item to the cart in the global state
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
    toast.success("Product added to the cart");
  };

  return (
    <Card>
      {/* Link to the product details page */}
      <Link to={`/product/${product.slug}`}>
        <img
          src={`http://localhost:4000${product.image}`}
          className="card-img-top product-image"
          alt={product.name}
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        {/* Display the product rating */}
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>€{product.price}</Card.Text>
        {/* Display a button based on the product's availability */}
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button
            onClick={() => addToCartHandler(convertProductToCartItem(product))}
          >
            Add to cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default ProductItem;
