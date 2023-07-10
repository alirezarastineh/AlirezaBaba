import { useMutation, useQuery } from "@tanstack/react-query";
import { Product, Review } from "../types/Product";
import apiClient from "../apiClient";

// Defining a hook to get all products
export const useGetProductsQuery = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: async () =>
      (
        await apiClient.get<{
          featuredProducts: Product[];
          latestProducts: Product[];
        }>(`api/products`)
      ).data,
  });

// Defining a hook to search for products with various filters
export const useSearchProductsQuery = ({
  page,
  query,
  category,
  price,
  rating,
  order,
}: {
  page: number;
  query: string;
  category: string;
  price: string;
  rating: string;
  order: string;
}) =>
  useQuery({
    queryKey: ["products", page, query, category, price, rating, order],
    queryFn: async () =>
      (
        await apiClient.get<{
          products: Product[];
          countProducts: number;
          pages: number;
        }>(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        )
      ).data,
  });

// Defining a hook to get the details of a specific product by its slug
export const useGetProductDetailsBySlugQuery = (slug: string) =>
  useQuery({
    queryKey: ["products", slug],
    queryFn: async () =>
      (await apiClient.get<Product>(`api/products/slug/${slug}`)).data,
  });

// Defining a hook to get the details of a specific product by its ID
export const useGetProductDetailsQuery = (id: string) =>
  useQuery({
    queryKey: ["products", id],
    queryFn: async () =>
      (await apiClient.get<Product>(`api/products/${id}`)).data,
  });

// Defining a hook to get all product categories
export const useGetCategoriesQuery = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () =>
      (await apiClient.get<[]>(`/api/products/categories`)).data,
  });

// Defining a mutation hook to create a review for a product
export const useCreateReviewMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      rating,
      comment,
      productId,
    }: {
      name: string;
      rating: number;
      comment: string;
      productId: string;
    }) =>
      (
        await apiClient.post<Review>(`api/products/${productId}/reviews`, {
          name,
          rating,
          comment,
        })
      ).data,
  });

// Admin

// Defining a hook to get all products for an admin
export const useGetAdminProductsQuery = (page: number) =>
  useQuery({
    queryKey: ["admin-products", page],
    queryFn: async () =>
      (
        await apiClient.get<{
          products: [Product];
          page: number;
          pages: number;
        }>(`/api/products/admin?page=${page}`)
      ).data,
  });

// Defining a mutation hook to create a product for an admin
export const useCreateProductMutation = () =>
  useMutation({
    mutationFn: async () =>
      (
        await apiClient.post<{ product: Product; message: string }>(
          `api/products`
        )
      ).data,
  });

// Defining a mutation hook to delete a product for an admin
export const useDeleteProductMutation = () =>
  useMutation({
    mutationFn: async (productId: string) =>
      (await apiClient.delete(`api/products/${productId}`)).data,
  });

// Defining a mutation hook to update a product for an admin
export const useUpdateProductMutation = () =>
  useMutation({
    mutationFn: async (product: {
      _id: string;
      name: string;
      slug: string;
      price: number;
      image: string;
      images: string[];
      category: string;
      brand: string;
      countInStock: number;
      description: string;
    }) =>
      (
        await apiClient.put<{ product: Product; message: string }>(
          `api/products/${product._id}`,
          product
        )
      ).data,
  });

// Defining a mutation hook to upload a product for an admin
export const useUploadProductMutation = () =>
  useMutation({
    mutationFn: async (formData: FormData) =>
      (
        await apiClient.post<{ secure_url: string }>(
          `api/uploads/cloudinary`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
      ).data,
  });
