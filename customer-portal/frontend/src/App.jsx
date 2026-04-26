import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage          from "./pages/HomePage";
import ShopPage          from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage          from "./pages/CartPage";
import CheckoutPage      from "./pages/CheckoutPage";
import OrdersPage        from "./pages/OrdersPage";
import OrderDetailPage   from "./pages/OrderDetailPage";
import AccountPage       from "./pages/AccountPage";
import LoginPage         from "./pages/LoginPage";
import RegisterPage      from "./pages/RegisterPage";

const App = () => {
  return (
    <Routes>
      <Route path="/"           element={<HomePage />} />
      <Route path="/shop"       element={<ShopPage />} />
      <Route path="/shop/:id"   element={<ProductDetailPage />} />
      <Route path="/cart"       element={<CartPage />} />
      <Route path="/checkout"   element={<CheckoutPage />} />
      <Route path="/orders"     element={<OrdersPage />} />
      <Route path="/orders/:id" element={<OrderDetailPage />} />
      <Route path="/account"    element={<AccountPage />} />
      <Route path="/login"      element={<LoginPage />} />
      <Route path="/register"   element={<RegisterPage />} />
    </Routes>
  );
};

export default App;