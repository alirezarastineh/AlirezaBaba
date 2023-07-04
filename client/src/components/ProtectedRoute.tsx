import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Store } from "../Store";

export default function ProtectedRoute() {
  // Access the global state from the Store context
  const {
    state: { userInfo },
  } = useContext(Store);

  // If the userInfo object exists, the Outlet component (which renders the child route component) is returned
  // If the userInfo object does not exist, they are redirected to the Sign In Page
  return userInfo ? <Outlet /> : <Navigate to="/signin" />;
}

// The <Outlet /> component is a placeholder that represents the nested child routes within a parent route.
// It allows the child routes to be rendered when the parent route matches.
