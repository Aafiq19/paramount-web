import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MdBuild, MdDelete } from "react-icons/md";
import { BsArrowLeft, BsCart3 } from "react-icons/bs";

const CartPage = () => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart") || "[]"));
  const navigate = useNavigate();

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    const newCart = cart.map(i => i._id === id ? { ...i, qty } : i);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeItem = (id) => {
    const newCart = cart.filter(i => i._id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));
  };

  const total = cart.reduce((sum, i) => sum + (i.price || 0) * i.qty, 0);

  const handleCheckout = () => {
    const customer = JSON.parse(localStorage.getItem("customer") || "null");
    if (!customer) {
      localStorage.setItem("redirectAfterLogin", "/cart");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={cart.length} />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Link to="/shop" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-8 w-fit">
          <BsArrowLeft /> Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <BsCart3 className="text-gray-200 text-8xl mx-auto mb-4" />
            <p className="text-gray-400 text-xl font-medium mb-2">Your cart is empty</p>
            <p className="text-gray-400 text-sm mb-6">Add some products to get started</p>
            <Link to="/shop" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-5">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.product} className="w-full h-full object-cover"
                        onError={(e) => e.target.style.display = 'none'} />
                    ) : (
                      <MdBuild className="text-gray-300 text-3xl" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{item.product}</h3>
                    <p className="text-xs text-gray-400">{item.supplier}</p>
                    <p className="text-orange-500 font-bold mt-1">LKR {(item.price || 0).toLocaleString()}</p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => updateQty(item._id, item.qty - 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-50 font-bold">−</button>
                    <span className="px-4 py-2 text-gray-800 font-semibold border-x border-gray-200">{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.qty + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-50 font-bold">+</button>
                  </div>

                  {/* Subtotal */}
                  <p className="font-bold text-gray-800 w-28 text-right">
                    LKR {((item.price || 0) * item.qty).toLocaleString()}
                  </p>

                  {/* Remove */}
                  <button onClick={() => removeItem(item._id)}
                    className="text-red-400 hover:text-red-600 transition-colors ml-2">
                    <MdDelete size={20} />
                  </button>
                </div>
              ))}

              <button onClick={clearCart}
                className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors">
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-800 mb-5">Order Summary</h2>

                <div className="space-y-3 mb-5">
                  {cart.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span className="text-gray-500 line-clamp-1 flex-1 mr-2">{item.product} × {item.qty}</span>
                      <span className="text-gray-800 font-medium">LKR {((item.price || 0) * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-xl text-orange-500">LKR {total.toLocaleString()}</span>
                  </div>
                </div>

                <button onClick={handleCheckout}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold text-sm transition-colors">
                  Proceed to Checkout
                </button>

                <Link to="/shop"
                  className="block text-center text-gray-500 hover:text-gray-800 text-sm mt-4 transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-slate-900 text-gray-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">© 2026 Paramount Enterprises. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CartPage;