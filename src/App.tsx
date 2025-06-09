import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import { useSelector } from "react-redux";
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ListCustomer from "./pages/ListCustomer";
import Login from "./pages/Login";
import PackageForm from "./pages/PackageForm";
import Purchase from "./pages/Purchase";
import Transactions from "./pages/Transactions";
import type { RootState } from "./store/store";
import theme from "./theme";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  return isAuthenticated && user?.role === 1 ? (
    children
  ) : (
    <Navigate to="/dashboard" />
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Outlet />
                </Layout>
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="purchase/:packageId" element={<Purchase />} />
            <Route path="transactions" element={<Transactions />} />
            <Route
              path="package/new"
              element={
                <AdminRoute>
                  <PackageForm />
                </AdminRoute>
              }
            />
            <Route
              path="package/edit/:packageId"
              element={
                <AdminRoute>
                  <PackageForm isEditMode />
                </AdminRoute>
              }
            />
            <Route
              path="customers"
              element={
                <AdminRoute>
                  <ListCustomer />
                </AdminRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
