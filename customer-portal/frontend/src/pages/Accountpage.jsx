import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BsPerson, BsGeoAlt, BsTelephone, BsEnvelope, BsBoxArrowRight } from "react-icons/bs";

const AccountPage = () => {
  const navigate  = useNavigate();
  const [customer, setCustomer] = useState(JSON.parse(localStorage.getItem("customer") || "null"));
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  useEffect(() => {
    if (!customer) { navigate("/login"); return; }
    axios.get(`http://localhost:5002/orders/my/${customer.id}`)
      .then((res) => { setOrders(res.data.orders || []); setLoading(false); })
      .catch((err) => { console.log(err); setLoading(false); });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customer");
    localStorage.removeItem("cart");
    navigate("/login");
  };

  const statusColors = {
    Pending:   "bg-yellow-100 text-yellow-700",
    Approved:  "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  if (!customer) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={cart.length} />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Account</h1>

        <div className="grid grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                  <BsPerson className="text-orange-500 text-3xl" />
                </div>
                <h2 className="font-bold text-gray-800 text-lg">{customer.name}</h2>
                <p className="text-gray-400 text-sm">{customer.email}</p>
              </div>

              {/* Info */}
              <div className="space-y-3">
                {customer.address && (
                  <div className="flex items-start gap-3 text-sm">
                    <BsGeoAlt className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{customer.address}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <BsTelephone className="text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">{customer.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <BsEnvelope className="text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">{customer.email}</span>
                </div>
              </div>

              {/* Logout */}
              <button onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full mt-6 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-lg text-sm font-medium transition-colors">
                <BsBoxArrowRight />
                Sign Out
              </button>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-4">
              <h3 className="font-semibold text-gray-700 mb-4">Order Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Orders", value: orders.length },
                  { label: "Completed", value: orders.filter(o => o.status === "Completed").length },
                  { label: "Pending", value: orders.filter(o => o.status === "Pending").length },
                  { label: "Cancelled", value: orders.filter(o => o.status === "Cancelled").length },
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  📦 Order History
                </h2>
                <Link to="/orders" className="text-orange-500 hover:underline text-sm">View All</Link>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">No orders yet</p>
                  <Link to="/shop" className="text-orange-500 hover:underline text-sm mt-2 block">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <Link to={`/orders/${order._id}`} key={order._id}
                      className="block border border-gray-100 rounded-xl p-4 hover:border-orange-200 hover:bg-orange-50 transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} items
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                            {order.status}
                          </span>
                          <p className="font-bold text-gray-800 text-sm mt-1">
                            LKR {Number(order.total_amount).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
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

export default AccountPage;