import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { CartItem, ShippingAddress } from "../types/Cart";
import { Order } from "../types/Order";

// Defining a hook to get the order summary
export const useGetOrderSummaryQuery = () =>
  useQuery({
    queryKey: ["orders-summary"],
    queryFn: async () =>
      (
        await apiClient.get<{
          users: [{ numUsers: number }];
          orders: [{ numOrders: number; totalSales: number }];
          dailyOrders: [];
          productCategories: [];
        }>(`api/orders/summary`)
      ).data,
  });

// Defining a hook to get the details of a specific order
export const useGetOrderDetailsQuery = (id: string) =>
  useQuery({
    queryKey: ["orders", id],
    queryFn: async () => (await apiClient.get<Order>(`api/orders/${id}`)).data,
  });

// Defining a hook to get the PayPal client ID
export const useGetPaypalClientIdQuery = () =>
  useQuery({
    queryKey: ["paypal-clientId"],
    queryFn: async () =>
      (await apiClient.get<{ clientId: string }>(`/api/keys/paypal`)).data,
  });

// Defining a mutation hook to pay for an order
export const usePayOrderMutation = () =>
  useMutation({
    mutationFn: async (details: { orderId: string }) =>
      (
        await apiClient.put<{ message: string; order: Order }>(
          `api/orders/${details.orderId}/pay`,
          details
        )
      ).data,
  });

// Defining a hook to get the Google API key
export const useGetGoogleApiKeyQuery = () =>
  useQuery({
    queryKey: ["google-api-key"],
    queryFn: async () =>
      (await apiClient.get<{ key: string }>(`/api/keys/google`)).data,
  });

// Defining a mutation hook to create an order
export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: async (order: {
      orderItems: CartItem[];
      shippingAddress: ShippingAddress;
      paymentMethod: string;
      itemsPrice: number;
      shippingPrice: number;
      taxPrice: number;
      totalPrice: number;
    }) =>
      (
        await apiClient.post<{ message: string; order: Order }>(
          `api/orders`,
          order
        )
      ).data,
  });

// Defining a hook to get the order history
export const useGetOrderHistoryQuery = () =>
  useQuery({
    queryKey: ["order-history"],
    queryFn: async () =>
      (await apiClient.get<Order[]>(`/api/orders/mine`)).data,
  });

// Defining a mutation hook to deliver an order
export const useDeliverOrderMutation = () =>
  useMutation({
    mutationFn: async (orderId: string) =>
      (
        await apiClient.put<{ message: string; order: Order }>(
          `api/orders/${orderId}/deliver`
        )
      ).data,
  });

// Defining a mutation hook to delete an order
export const useDeleteOrderMutation = () =>
  useMutation({
    mutationFn: async (orderId: string) =>
      (await apiClient.delete<{ message: string }>(`api/orders/${orderId}`))
        .data,
  });

// Defining a hook to get all orders
export const useGetOrdersQuery = () =>
  useQuery({
    queryKey: ["orders"],
    queryFn: async () => (await apiClient.get<[Order]>(`api/orders`)).data,
  });
