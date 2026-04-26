import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import Login    from "./pages/authPages/Login";
import Register from "./pages/authPages/Register";

// Dashboard
import Dashboard from "./pages/dashboard/Dashboard";

// Stock Pages
import Home        from "./pages/stockPages/Home";
import CreateStock from "./pages/stockPages/CreateStock";
import ShowStock   from "./pages/stockPages/ShowStock";
import EditStock   from "./pages/stockPages/EditStock";
import DeleteStock from "./pages/stockPages/DeleteStock";

// Customer Pages
import HomeCustomer   from "./pages/customerPages/HomeCustomer";
import CreateCustomer from "./pages/customerPages/CreateCustomer";
import ShowCustomer   from "./pages/customerPages/ShowCustomer";
import EditCustomer   from "./pages/customerPages/EditCustomer";
import DeleteCustomer from "./pages/customerPages/DeleteCustomer";

// Employee Pages
import HomeEmployee   from "./pages/employeePages/HomeEmployee";
import CreateEmployee from "./pages/employeePages/CreateEmployee";
import ShowEmployee   from "./pages/employeePages/ShowEmployee";
import EditEmployee   from "./pages/employeePages/EditEmployee";
import DeleteEmployee from "./pages/employeePages/DeleteEmployee";

// Supplier Pages
import HomeSupplier   from "./pages/supplierPages/HomeSupplier";
import CreateSupplier from "./pages/supplierPages/CreateSupplier";
import ShowSupplier   from "./pages/supplierPages/ShowSupplier";
import EditSupplier   from "./pages/supplierPages/EditSupplier";
import DeleteSupplier from "./pages/supplierPages/DeleteSupplier";

// Order Pages
import HomeOrder   from "./pages/orderPages/HomeOrder";
import CreateOrder from "./pages/orderPages/CreateOrder";
import ShowOrder   from "./pages/orderPages/ShowOrder";
import EditOrder   from "./pages/orderPages/EditOrder";
import DeleteOrder from "./pages/orderPages/DeleteOrder";

const App = () => {
  return (
    <Routes>
      {/* Default redirect to login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth */}
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Stock */}
      <Route path="/stocks"                element={<Home />} />
      <Route path="/stocks/create"         element={<CreateStock />} />
      <Route path="/stocks/details/:id"    element={<ShowStock />} />
      <Route path="/stocks/edit/:id"       element={<EditStock />} />
      <Route path="/stocks/delete/:id"     element={<DeleteStock />} />

      {/* Customer */}
      <Route path="/customers"             element={<HomeCustomer />} />
      <Route path="/customers/create"      element={<CreateCustomer />} />
      <Route path="/customers/details/:id" element={<ShowCustomer />} />
      <Route path="/customers/edit/:id"    element={<EditCustomer />} />
      <Route path="/customers/delete/:id"  element={<DeleteCustomer />} />

      {/* Employee */}
      <Route path="/employees"             element={<HomeEmployee />} />
      <Route path="/employees/create"      element={<CreateEmployee />} />
      <Route path="/employees/details/:id" element={<ShowEmployee />} />
      <Route path="/employees/edit/:id"    element={<EditEmployee />} />
      <Route path="/employees/delete/:id"  element={<DeleteEmployee />} />

      {/* Supplier */}
      <Route path="/suppliers"             element={<HomeSupplier />} />
      <Route path="/suppliers/create"      element={<CreateSupplier />} />
      <Route path="/suppliers/details/:id" element={<ShowSupplier />} />
      <Route path="/suppliers/edit/:id"    element={<EditSupplier />} />
      <Route path="/suppliers/delete/:id"  element={<DeleteSupplier />} />

      {/* Order */}
      <Route path="/orders"                element={<HomeOrder />} />
      <Route path="/orders/create"         element={<CreateOrder />} />
      <Route path="/orders/details/:id"    element={<ShowOrder />} />
      <Route path="/orders/edit/:id"       element={<EditOrder />} />
      <Route path="/orders/delete/:id"     element={<DeleteOrder />} />
    </Routes>
  );
};

export default App;
