import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BsArrowLeft } from "react-icons/bs";

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);
  const customer = JSON.parse(localStorage.getItem("customer") || "null");
  const cart     = JSON.parse(localStorage.getItem("cart") || "[]");

  useEffect(() => {
    if (!customer) { navigate("/login"); return; }
    axios.get(`http://localhost:5002/orders/${id}`)
      .then((res) => { setOrder(res.data); setLoading(false); })
      .catch((err) => { console.log(err); setLoading(false); });
  }, [id]);

  const statusColors = {
    Pending:   "bg-yellow-100 text-yellow-700",
    Approved:  "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={cart.length} />
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={cart.length} />
      <div className="text-center py-32">
        <p className="text-gray-400">Order not found</p>
        <Link to="/orders" className="text-orange-500 hover:underline mt-2 block">Back to Orders</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={cart.length} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link to="/orders" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-8 w-fit">
          <BsArrowLeft /> Back to Orders
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
            <span className={`text-sm font-semibold px-4 py-1.5 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
              {order.status}
            </span>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Items Ordered</h2>
            <div className="space-y-3">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{item.product_name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity} × LKR {Number(item.unit_price).toLocaleString()}</p>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">
                    LKR {Number(item.subtotal).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 mb-6">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800">Total Amount</span>
              <span className="text-2xl font-bold text-orange-500">
                LKR {Number(order.total_amount).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Customer</p>
              <p className="text-sm font-medium text-gray-800">{order.customer_name}</p>
              <p className="text-xs text-gray-500">{order.customer_email}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Notes</p>
              <p className="text-sm text-gray-700">{order.notes || "No special notes"}</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-slate-900 text-gray-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">© 2026 Paramount Enterprises. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default OrderDetailPage;