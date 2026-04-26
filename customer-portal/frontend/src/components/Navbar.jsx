import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BsCart3, BsSearch, BsPerson } from "react-icons/bs";

const Navbar = ({ cartCount = 0 }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const customer  = JSON.parse(localStorage.getItem("customer") || "null");

  const handleLogout = () => {
    localStorage.removeItem("customer");
    localStorage.removeItem("cart");
    navigate("/login");
  };

  const navLinks = [
    { path: "/",        label: "Home" },
    { path: "/shop",    label: "Shop" },
    { path: "/orders",  label: "Orders" },
    { path: "/account", label: "Account" },
  ];

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">P</span>
          </div>
          <span className="font-bold text-lg">Paramount Enterprises</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "text-orange-400"
                  : "text-gray-300 hover:text-white"
              }`}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <Link to="/shop" className="text-gray-300 hover:text-white transition-colors">
            <BsSearch size={18} />
          </Link>

          <Link to="/cart" className="relative text-gray-300 hover:text-white transition-colors">
            <BsCart3 size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {customer ? (
            <div className="flex items-center gap-3">
              <Link to="/account" className="text-gray-300 hover:text-white transition-colors">
                <BsPerson size={20} />
              </Link>
            </div>
          ) : (
            <Link to="/login"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;