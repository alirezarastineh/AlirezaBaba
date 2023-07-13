import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { getError } from "../../utils";
import Rating from "../../components/Products/Rating";
import LoadingBox from "../../components/LoadingBox";
import MessageBox from "../../components/MessageBox";
import ProductItem from "../../components/Products/ProductItem";
import { ApiError } from "../../types/ApiError";
import {
  useGetCategoriesQuery,
  useSearchProductsQuery,
} from "../../hooks/productHooks";
import { ratings } from "./constants";

export default function SearchPage() {
  const prices = [
    {
      name: "$10000 to $100000",
      value: "10000-100000",
    },
    {
      name: "$100001 to $200000",
      value: "100001-200000",
    },
    {
      name: "$200001 to $10000000",
      value: "200001-10000000",
    },
  ];

  const savedState = JSON.parse(localStorage.getItem("searchState") || "{}");

  const navigate = useNavigate();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);

  const category = sp.get("category") || savedState.category || "all";
  const query = sp.get("query") || savedState.query || "all";
  const price = sp.get("price") || savedState.price || "all";
  const rating = sp.get("rating") || savedState.rating || "all";
  const order = sp.get("order") || savedState.order || "newest";
  const page = Number(sp.get("page") || savedState.page || 1);

  useEffect(() => {
    localStorage.setItem(
      "searchState",
      JSON.stringify({ category, query, price, rating, order, page })
    );
  }, [category, query, price, rating, order, page]);

  const { data, isLoading, error } = useSearchProductsQuery({
    category,
    order,
    page,
    price,
    query,
    rating,
  });

  const {
    data: categories,
    isLoading: loadingCategories,
    error: errorCategories,
  } = useGetCategoriesQuery();

  const getFilterUrl = (
    filter: {
      category?: string;
      price?: string;
      rating?: string;
      order?: string;
      page?: number;
      query?: string;
    },
    skipPathname = false
  ) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `${
      skipPathname ? "" : "/search?"
    }category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <h3>Department</h3>
          <div>
            <ul>
              <li>
                <Link
                  className={"all" === category ? "text-bold" : ""}
                  to={getFilterUrl({ category: "all" })}
                >
                  Any
                </Link>
              </li>

              {loadingCategories ? (
                <LoadingBox />
              ) : error ? (
                <MessageBox variant="danger">
                  {getError(errorCategories as ApiError)}
                </MessageBox>
              ) : (
                categories?.map((c) => (
                  <li key={c}>
                    <Link
                      className={c === category ? "text-bold" : ""}
                      to={getFilterUrl({ category: c })}
                    >
                      {c}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div>
            <h3>Price</h3>
            <ul>
              <li>
                <Link
                  className={"all" === price ? "text-bold" : ""}
                  to={getFilterUrl({ price: "all" })}
                >
                  Any
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    to={getFilterUrl({ price: p.value })}
                    className={p.value === price ? "text-bold" : ""}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Avg. Customer Review</h3>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating.toString() })}
                    className={`${r.rating}` === `${rating}` ? "text-bold" : ""}
                  >
                    <Rating caption={" & up"} rating={r.rating} />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={getFilterUrl({ rating: "all" })}
                  className={rating === "all" ? "text-bold" : ""}
                >
                  <Rating caption={" & up"} rating={0} />
                </Link>
              </li>
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {isLoading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">
              {getError(error as ApiError)}
            </MessageBox>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {data?.countProducts === 0 ? "No" : data?.countProducts}{" "}
                    Results
                    {query !== "all" && ` : ${query}`}
                    {category !== "all" && ` : ${category}`}
                    {price !== "all" && ` : Price ${price}`}
                    {rating !== "all" && ` : Rating ${rating} & up`}
                    {query !== "all" ||
                    category !== "all" ||
                    rating !== "all" ||
                    price !== "all" ? (
                      <Button
                        variant="light"
                        onClick={() => {
                          navigate(
                            getFilterUrl({
                              category: "all",
                              query: "all",
                              price: "all",
                              rating: "all",
                              order: "newest",
                              page: 1,
                            })
                          );
                        }}
                      >
                        <i className="fas fa-times-circle" />
                      </Button>
                    ) : null}
                  </div>
                </Col>
                <Col className="text-end">
                  Sort by{" "}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                    <option value="toprated">Avg. Customer Reviews</option>
                  </select>
                </Col>
              </Row>
              {data?.products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}

              <Row>
                {data?.products.map((product) => (
                  <Col sm={6} lg={4} className="mb-3" key={product._id}>
                    <ProductItem product={product} />
                  </Col>
                ))}
              </Row>

              <div>
                {[...Array(data?.pages).keys()].map((x) => (
                  <LinkContainer
                    key={x + 1}
                    className="mx-1"
                    to={{
                      pathname: "/search",
                      search: getFilterUrl({ page: x + 1 }, true),
                    }}
                  >
                    <Button
                      className={Number(page) === x + 1 ? "text-bold" : ""}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
