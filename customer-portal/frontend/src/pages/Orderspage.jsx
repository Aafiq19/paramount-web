import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BsBoxSeam } from "react-icons/bs";

const OrdersPage = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate  = useNavigate();
  const customer  = JSON.parse(localStorage.getItem("customer") || "null");
  const cart      = JSON.parse(localStorage.getItem("cart") || "[]");

  useEffect(() => {
    if (!customer) { navigate("/login"); return; }
    axios.get(`http://localhost:5002/orders/my/${customer.id}`)
      .then((res) => { setOrders(res.data.orders || []); setLoading(false); })
      .catch((err) => { console.log(err); setLoading(false); });
  }, []);

  const statusColors = {
    Pending:   "bg-yellow-100 text-yellow-700",
    Approved:  "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={cart.length} />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
        <p className="text-gray-500 text-sm mb-8">Track and view all your orders</p>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <BsBoxSeam className="text-gray-200 text-8xl mx-auto mb-4" />
            <p className="text-gray-400 text-xl font-medium mb-2">No orders yet</p>
            <p className="text-gray-400 text-sm mb-6">Start shopping to place your first order</p>
            <Link to="/shop"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link to={`/orders/${order._id}`} key={order._id}
                className="block bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })} · {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                      {order.status}
                    </span>
                    <p className="font-bold text-gray-800 mt-2">
                      LKR {Number(order.total_amount).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Items preview */}
                <div className="border-t border-gray-50 pt-3">
                  <p className="text-xs text-gray-400">
                    {order.items?.slice(0, 3).map(i => i.product_name).join(", ")}
                    {order.items?.length > 3 ? ` +${order.items.length - 3} more` : ""}
                  </p>
                </div>
              </Link>
            ))}
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

export default OrdersPage;