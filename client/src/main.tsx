import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import "./index.css";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/Product/ProductPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StoreProvider } from "./Store";
import CartPage from "./pages/Orders/CartPage";
import SearchPage from "./pages/Product/SearchPage";
import SigninPage from "./pages/Authorization/SigninPage";
import SignupPage from "./pages/Authorization/SignupPage";
import ShippingAddressPage from "./pages/Orders/ShippingAddressPage";
import PaymentMethodPage from "./pages/Orders/PaymentMethodPage";
import UserListPage from "./pages/Admin/Users/UserListPage";
import ProductListPage from "./pages/Admin/Products/ProductListPage";
import ProductEditPage from "./pages/Admin/Products/ProductEditPage";
import UserEditPage from "./pages/Admin/Users/UserEditPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PlaceOrderPage from "./pages/Orders/PlaceOrderPage";
import OrderPage from "./pages/Orders/OrderPage";
import OrderListPage from "./pages/Admin/OrderListPage";
import AdminRoute from "./components/AdminRoute";
import DashboardPage from "./pages/Admin/DashboardPage";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import OrderHistoryPage from "./pages/Orders/OrderHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import MapPage from "./pages/Orders/MapPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomePage />} />
      <Route path="/product/:slug" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/signup" element={<SignupPage />} />
      {/* Normal Users */}
      <Route path="" element={<ProtectedRoute />}>
        <Route path="/orderhistory" element={<OrderHistoryPage />} />
        <Route path="/shipping" element={<ShippingAddressPage />} />
        <Route path="/payment" element={<PaymentMethodPage />} />
        <Route path="/placeorder" element={<PlaceOrderPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/order/:id" element={<OrderPage />} />
      </Route>
      {/* Admin Users */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UserListPage />} />
        <Route path="user/:id" element={<UserEditPage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="product/:id" element={<ProductEditPage />} />
        <Route path="orders" element={<OrderListPage />} />
      </Route>
    </Route>
  )
);

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <PayPalScriptProvider options={{ clientId: "sb" }} deferLoading={true}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </PayPalScriptProvider>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
);
