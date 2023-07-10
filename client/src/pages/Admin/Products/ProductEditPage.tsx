// Importing necessary hooks and components from React, react-router-dom, react-toastify, react-bootstrap, react-helmet-async, and local files
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getError } from "../../../utils";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../../../components/LoadingBox";
import MessageBox from "../../../components/MessageBox";
import Button from "react-bootstrap/Button";
import { ApiError } from "../../../types/ApiError";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductMutation,
} from "../../../hooks/productHooks";

// Defining a component for the product edit page
export default function ProductEditPage() {
  // Using hooks to get the navigate function, the product ID from the URL parameters, and to manage state for the product details form fields
  const navigate = useNavigate();
  const params = useParams();
  const { id: productId } = params;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");

  // Using the useGetProductDetailsQuery hook to fetch the details of the product
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId || "");

  // Using the useEffect hook to set the form fields to the current product details when the product data changes
  useEffect(() => {
    if (!product) {
      return;
    }
    setName(product.name);
    setSlug(product.slug);
    setPrice(product.price);
    setImage(product.image);
    setImages(product.images);
    setCategory(product.category);
    setCountInStock(product.countInStock);
    setBrand(product.brand);
    setDescription(product.description);
  }, [product]);

  // Using the useUpdateProductMutation hook to get the function to update the product
  const { mutateAsync: updateProduct, isLoading: loadingUpdate } =
    useUpdateProductMutation();

  // Defining the submit handler for the form, which updates the product and navigates back to the admin products page
  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      if (productId) {
        await updateProduct({
          _id: productId,
          name,
          slug,
          price,
          image,
          images,
          category,
          brand,
          countInStock,
          description,
        });
        toast.success("Product updated successfully");
        navigate("/admin/products");
      }
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };

  // Using the useUploadProductMutation hook to get the function to upload a product image
  const { mutateAsync: uploadProduct, isLoading: loadingUpload } =
    useUploadProductMutation();

  // Defining the handler for the file input change event, which uploads the selected file and sets the image or images state
  const uploadFileHandler = async (
    e: React.FormEvent<HTMLInputElement>,
    forImages = false
  ) => {
    const file = e.currentTarget.files?.[0];
    const bodyFormData = new FormData();
    if (file) {
      bodyFormData.append("image", file);
    }
    try {
      const data = await uploadProduct(bodyFormData);

      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      toast.success("Image uploaded successfully. click Update to apply it");
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };

  // Defining the handler for the delete button click event, which removes the selected image from the images state
  const deleteFileHandler = async (fileName: string) => {
    setImages(images.filter((x) => x !== fileName));
    toast.success("Image removed successfully. click Update to apply it");
  };

  // Returning the JSX to render
  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Product {productId}</title>
      </Helmet>
      <h1>Edit Product {productId}</h1>

      {isLoading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image File</Form.Label>
            <Form.Control
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>Upload Image</Form.Label>
            <input type="file" onChange={uploadFileHandler} />
            {loadingUpload && <LoadingBox />}
          </Form.Group>

          <Form.Group className="mb-3" controlId="additionalImage">
            <Form.Label>Additional Images</Form.Label>
            {images.length === 0 && <MessageBox>No image</MessageBox>}
            <ListGroup variant="flush">
              {images.map((x) => (
                <ListGroup.Item key={x}>
                  {x}
                  <Button variant="light" onClick={() => deleteFileHandler(x)}>
                    <i className="fa fa-times-circle" />
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="additionalImageFile">
            <Form.Label>Upload Additional Image</Form.Label>
            <input type="file" onChange={(e) => uploadFileHandler(e, true)} />
            {loadingUpload && <LoadingBox />}
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              value={countInStock}
              onChange={(e) => setCountInStock(Number(e.target.value))}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <LoadingBox />}
          </div>
        </Form>
      )}
    </Container>
  );
}