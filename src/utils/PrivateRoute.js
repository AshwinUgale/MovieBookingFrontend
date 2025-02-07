import { Navigate } from "react-router-dom";

const PrivateRoute = ({ component: Component }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
