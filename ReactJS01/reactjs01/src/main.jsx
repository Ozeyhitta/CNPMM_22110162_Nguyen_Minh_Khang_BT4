import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegisterPage from "./pages/register.jsx";
import UserPage from "./pages/user.jsx";
import HomePage from "./pages/home.jsx";
import LoginPage from "./pages/login.jsx";
import Forgot from "./pages/forgot.jsx";
import ResetPage from "./pages/reset.jsx";
import VerifyOTP from "./pages/verify-otp.jsx";
import ProductsPage from "./pages/ProductList.jsx";
import ProductDetailPage from "./pages/ProductDetail.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import CategoriesPage from "./pages/Categories.jsx";
import ProductsManagementPage from "./pages/ProductsManagement.jsx";
import PaymentPage from "./pages/payment.jsx";
import { AuthWrapper } from "./components/context/auth.context.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "user",
        element: <UserPage />,
      },
      {
        path: "products", // 👈 THÊM ROUTE
        element: <ProductsPage />,
      },
      {
        path: "products/:productId",
        element: <ProductDetailPage />,
      },
      {
        path: "favorites",
        element: <FavoritesPage />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
      {
        path: "products-management",
        element: <ProductsManagementPage />,
      },
      {
        path: "payment",
        element: <PaymentPage />,
      },
    ],
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "forgot",
    element: <Forgot />,
  },

  {
    path: "reset-password",
    element: <ResetPage />,
  },
  {
    path: "verify-otp",
    element: <VerifyOTP />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode> - Disabled to fix component re-mounting issues
  <AuthWrapper>
    <RouterProvider router={router} />
  </AuthWrapper>
  // </React.StrictMode>
);
