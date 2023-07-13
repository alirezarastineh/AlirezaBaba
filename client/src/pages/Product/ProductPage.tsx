import React, { useContext, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Badge,
  Button,
  Card,
  Col,
  ListGroup,
  Row,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import {
  useCreateReviewMutation,
  useGetProductDetailsBySlugQuery,
} from "../../hooks/productHooks";
import LoadingBox from "../../components/LoadingBox";
import MessageBox from "../../components/MessageBox";
import { convertProductToCartItem, getError } from "../../utils";
import { ApiError } from "../../types/ApiError";
import Rating from "../../components/Products/Rating";
import { Store } from "../../Store";
import { Review } from "../../types/Product";

export default function ProductPage() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  const reviewsRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: createReview, isLoading: loadingCreateReview } =
    useCreateReviewMutation();

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!comment) {
      toast.error("Please enter a comment");
      return;
    }
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!product || !userInfo || !reviewsRef.current) {
      toast.error("An error occurred. Please try again later.");
      return;
    }
    try {
      await createReview({
        productId: product._id,
        rating,
        comment,
        name: userInfo.name,
      });
      refetch();
      toast.success("Review submitted successfully");
      window.scrollTo({
        behavior: "smooth",
        top: reviewsRef.current.offsetTop,
      });
      setComment("");
      setRating(0);
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };

  const navigate = useNavigate();

  const { state, dispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const addToCartHandler = async () => {
    if (!product) {
      toast.error("Unable to add product to cart. Please try again later.");
      return;
    }
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.countInStock < quantity) {
      toast.warn("Sorry. Product is out of stock");
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...convertProductToCartItem(product), quantity },
    });
    toast.success("Product added to the cart");
    navigate("/cart");
  };

  const params = useParams();
  const { slug } = params;

  if (slug === undefined) {
    throw new Error("Slug is undefined!");
  }

  const {
    data: product,
    refetch,
    isLoading,
    error,
  } = useGetProductDetailsBySlugQuery(slug);

  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
  ) : product ? (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="large"
            src={selectedImage ? selectedImage : product.image}
            alt={product.name}
          />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </ListGroup.Item>
            <ListGroup.Item>Price : €{product.price}</ListGroup.Item>
            <ListGroup.Item>
              <Row xs={1} md={2} className="g-2">
                {[product.image, ...product.images].map((x) => (
                  <Col key={x}>
                    <Card>
                      <Button
                        className="thumbnail"
                        type="button"
                        variant="light"
                        onClick={() => setSelectedImage(x)}
                      >
                        <Card.Img variant="top" src={x} alt="product" />
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>€{product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className="my-3">
        <h2 ref={reviewsRef}>Reviews</h2>
        <div className="mb-3">
          {product.reviews.length === 0 && (
            <MessageBox>There is no review</MessageBox>
          )}
        </div>
        <ListGroup>
          {product.reviews.map((review: Review) => (
            <ListGroup.Item key={review.createdAt}>
              <strong>{review.name}</strong>
              <Rating rating={review.rating} numReviews={0} caption="" />
              <p>{review.createdAt.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className="my-3">
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <h2>Let us know your opinion about this car</h2>
              <Form.Group className="mb-3" controlId="rating">
                <Form.Label>Rating</Form.Label>
                <Form.Select
                  aria-label="Rating"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value="">Select...</option>
                  <option value="1">1- Poor</option>
                  <option value="2">2- Fair</option>
                  <option value="3">3- Good</option>
                  <option value="4">4- Very good</option>
                  <option value="5">5- Excellent</option>
                </Form.Select>
              </Form.Group>
              <FloatingLabel
                controlId="floatingTextarea"
                label="Comments"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Leave a comment here"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FloatingLabel>

              <div className="mb-3">
                <Button disabled={loadingCreateReview} type="submit">
                  Submit
                </Button>
                {loadingCreateReview && <LoadingBox />}
              </div>
            </form>
          ) : (
            <MessageBox>
              Please{" "}
              <Link to={`/signin?redirect=/product/${product.slug}`}>
                Sign In
              </Link>{" "}
              to write a review
            </MessageBox>
          )}
        </div>
      </div>
    </div>
  ) : (
    <MessageBox variant="danger">Product Not Found</MessageBox>
  );
}
