import AuthForm from "./AuthForm";
import axios from "axios";
import "./index.css";
import { Analytics } from "@vercel/analytics/react";
import { Outlet, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Chat from "./Chat";
export default function App() {
  const { userName, id } = useContext(UserContext);

  axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
  axios.defaults.withCredentials = true;

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={userName ? <Navigate to="/chat" /> : <AuthForm />}
        />
        <Route path="/chat" element={<ProtectedRoute />}>
          <Route index element={userName ? <Chat /> : <Navigate to="/" />} />
        </Route>
      </>
    )
  );
  return (
    <>
      <RouterProvider router={router} />
      <Analytics />
    </>
  );
}
