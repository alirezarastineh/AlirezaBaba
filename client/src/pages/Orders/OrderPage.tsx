import { useContext, useEffect } from "react";
import {
  PayPalButtons,
  usePayPalScriptReducer,
  SCRIPT_LOADING_STATE,
  PayPalButtonsComponentProps,
} from "@paypal/react-paypal-js";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../../components/LoadingBox";
import MessageBox from "../../components/MessageBox";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { ApiError } from "../../types/ApiError";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../hooks/orderHooks";

export default function OrderPage() {
  const { state } = useContext(Store);
  const {
    userInfo,
    cart: { paymentMethod },
  } = state;

  const params = useParams();
  const { id: orderId } = params;

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderDetailsQuery(orderId || "");

  const { mutateAsync: deliverOrder, isLoading: loadingDeliver } =
    useDeliverOrderMutation();

  async function deliverOrderHandler() {
    if (!orderId) {
      toast.error("Order ID is not provided");
      return;
    }
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order is delivered");
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  }

  const { mutateAsync: payOrder, isLoading: loadingPay } =
    usePayOrderMutation();

  const testPayHandler = async () => {
    if (!orderId) {
      toast.error("Order ID is not provided");
      return;
    }
    try {
      await payOrder({ orderId });
      refetch();
      toast.success("Order is paid");
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };

  const paypalbuttonTransactionProps: PayPalButtonsComponentProps = {
    style: { layout: "vertical" },
    async createOrder(_, actions) {
      if (order) {
        return await actions.order.create({
          purchase_units: [
            {
              amount: {
                value: order.totalPrice.toString(),
              },
            },
          ],
        });
      }
      throw new Error("Order is undefined");
    },
    async onApprove(_, actions) {
      const details = await actions.order?.capture();
      if (orderId) {
        try {
          payOrder({ orderId, ...details });
          refetch();
          toast.success("Order is paid");
        } catch (err) {
          toast.error(getError(err as ApiError));
        }
      } else {
        throw new Error("Order ID is undefined");
      }
    },
    onError: (err) => {
      toast.error(getError(err as ApiError));
    },
  };

  const [{ isPending, isRejected }, paypalDispatch] = usePayPalScriptReducer();

  const { refetch: fetchPayPalClientId } = useGetPaypalClientIdQuery();

  useEffect(() => {
    const loadScript = async () => {
      if (!(order && paymentMethod === "PayPal")) {
        return;
      }
      const { data } = await fetchPayPalClientId();
      if (data) {
        paypalDispatch({
          type: "resetOptions",
          value: {
            clientId: data.clientId,
            currency: "EUR",
          },
        });
        paypalDispatch({
          type: "setLoadingStatus",
          value: SCRIPT_LOADING_STATE.PENDING,
        });
      } else {
        throw new Error("Data is undefined");
      }
    };
    loadScript();
  }, [fetchPayPalClientId, order, paymentMethod, paypalDispatch]);

  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
  ) : order ? (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3">Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Address: </strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}
                &nbsp;
                {order.shippingAddress.location?.lat && (
                  <a
                    target="_new"
                    href={`https://maps.google.com?q=${order.shippingAddress.location.lat},${order.shippingAddress.location.lng}`}
                  >
                    Show On Map
                  </a>
                )}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="warning">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="warning">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded thumbnail"
                        />
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>€{item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>€{order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>€{order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>€{order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>€{order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {loadingPay && <LoadingBox />}
                {!order.isPaid && (
                  <ListGroup.Item>
                    {paymentMethod === "PayPal" ? (
                      isPending ? (
                        <LoadingBox />
                      ) : isRejected ? (
                        <MessageBox variant="danger">
                          Error in connecting to PayPal
                        </MessageBox>
                      ) : (
                        <div>
                          <PayPalButtons {...paypalbuttonTransactionProps} />
                          <Button onClick={testPayHandler}>Test Pay</Button>
                        </div>
                      )
                    ) : null}
                  </ListGroup.Item>
                )}
                {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListGroup.Item>
                    {loadingDeliver && <LoadingBox />}
                    <div className="d-grid">
                      <Button type="button" onClick={deliverOrderHandler}>
                        Deliver Order
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  ) : (
    <MessageBox variant="danger">Order Not Found</MessageBox>
  );
}
