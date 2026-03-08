import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { StudentLogin } from "./pages/StudentLogin";
import { AdminLogin } from "./pages/AdminLogin";
import { Dashboard } from "./pages/Dashboard";
import { ForgotPassword } from "./pages/ForgotPassword";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "register", Component: Register },
      { path: "student-login", Component: StudentLogin },
      { path: "admin-login", Component: AdminLogin },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "dashboard", Component: Dashboard },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
