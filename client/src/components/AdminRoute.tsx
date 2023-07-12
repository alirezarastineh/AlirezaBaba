import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Store } from "../Store";

export default function ProtectedRoute() {
  const {
    state: { userInfo },
  } = useContext(Store);

  return userInfo?.isAdmin ? <Outlet /> : <Navigate to="/signin" />;
}
