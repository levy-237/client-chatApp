import { Outlet, Navigate, Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useContext, useEffect } from "react";
import axios from "axios";
import { Audio } from "react-loader-spinner";
export default function ProtectedRoute() {
  const navigate = useNavigate();

  const { userName, id, setId, setUserName } = useContext(UserContext);
  if (userName === undefined) {
    // You can render a loading spinner or some other indicator while waiting
    return <Link to="/">ACCES DENIED LING TO LOGIN/SIGN UP</Link>;
  }
  if (userName === null) {
    // You can render a loading spinner or some other indicator while waiting
    navigate("/");
  }
  return userName ? <Outlet /> : <Navigate to="/" />;
}
