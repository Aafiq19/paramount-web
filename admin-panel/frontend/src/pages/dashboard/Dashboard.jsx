import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";
import {
  BsBoxSeam, BsPeopleFill, BsCartCheck, BsTruck,
  BsPersonBadge, BsExclamationTriangle, BsBell, BsSearch
} from "react-icons/bs";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area
} from "recharts";

const COLORS = ["#f59e0b", "#1e3a8a", "#10b981", "#ef4444", "#3b82f6", "#8b5cf6"];

const Dashboard = () => {
  const [stocks, setStocks]       = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders]       = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || '{"name":"User","role":"Staff"}');

  useEffect(() => {
    const base = "http://localhost:5001";
    Promise.all([
      axios.get(`${base}/stocks`),
      axios.get(`${base}/customers`),
      axios.get(`${base}/orders`),
      axios.get(`${base}/suppliers`),
      axios.get(`${base}/employees`),
    ]).then(([s, c, o, sup, emp]) => {
      setStocks(s.data.stocks || []);
      setCustomers(c.data.customers || []);
      setOrders(o.data.orders || []);
      setSuppliers(sup.data.suppliers || []);
      setEmployees(emp.data.employees || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const lowStockItems = stocks.filter(s => s.stockQuantity <= s.reorderLevel);
  const totalRevenue  = orders.reduce((sum, o) => sum + Number(o.total_amount || o.totalAmount || 0), 0);
  const recentOrders  = [...orders].reverse().slice(0, 5);

  const orderStatusData = [
    { name: "Pending",   value: orders.filter(o => o.status === "Pending").length },
    { name: "Approved",  value: orders.filter(o => o.status === "Approved").length },
    { name: "Completed", value: orders.filter(o => o.status === "Completed").length },
    { name: "Cancelled", value: orders.filter(o => o.status === "Cancelled").length },
  ];

  const stockStatusData = [
    { name: "In Stock",   value: stocks.filter(s => s.stockQuantity > s.reorderLevel).length },
    { name: "Low Stock",  value: stocks.filter(s => s.stockQuantity <= s.reorderLevel && s.stockQuantity > 0).length },
    { name: "Out of Stock", value: stocks.filter(s => s.stockQuantity === 0).length },
  ].filter(d => d.value > 0);

  const revenueData = recentOrders.map((o, i) => ({
    name: `Order ${recentOrders.length - i}`,
    revenue: Number(o.total_amount || o.totalAmount || 0),
  })).reverse();

  const summaryCards = [
    { label: "Total Customers",  value: customers.length,    icon: <BsPeopleFill size={20} />,    color: "#3b82f6", link: "/customers" },
    { label: "Total Orders",     value: orders.length,       icon: <BsCartCheck size={20} />,     color: "#f59e0b", link: "/orders" },
    { label: "Total Products",   value: stocks.length,       icon: <BsBoxSeam size={20} />,       color: "#ef4444", link: "/stocks" },
    { label: "Low Stock Items",  value: lowStockItems.length, icon: <BsExclamationTriangle size={20} />, color: "#8b5cf6", link: "/stocks" },
    { label: "Total Suppliers",  value: suppliers.length,    icon: <BsTruck size={20} />,         color: "#10b981", link: "/suppliers" },
    { label: "Total Employees",  value: employees.length,    icon: <BsPersonBadge size={20} />,   color: "#06b6d4", link: "/employees" },
  ];

  const statusColors = {
    Pending:   "bg-yellow-100 text-yellow-700",
    Approved:  "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-52 flex-1">

        {/* Top Navbar - matching screenshot */}
        <div className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: "#1e3a8a" }}>
              <span className="text-white font-bold text-xs">HS</span>
            </div>
            <span className="font-bold text-gray-800 text-sm">Hardware Shop Management System</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-600"><BsSearch size={18} /></button>
            <button className="relative text-gray-400 hover:text-gray-600">
              <BsBell size={18} />
              {lowStockItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {lowStockItems.length}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                {user.name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-none">{user.name}</p>
                <span className="text-xs px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: "#1e3a8a" }}>
                  {user.role === 'Admin' ? 'Administrator' : 'Staff'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

          {loading ? <Spinner /> : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {summaryCards.map((card) => (
                  <Link to={card.link} key={card.label}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between hover:shadow-md transition-all group">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">{card.label}</p>
                      <p className="text-3xl font-bold text-gray-800">{card.value.toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-xl group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: card.color + "20" }}>
                      <span style={{ color: card.color }}>{card.icon}</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Today's Sales + Monthly Revenue */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Total Employees</p>
                    <p className="text-3xl font-bold text-gray-800">{employees.length}</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ backgroundColor: "#f59e0b20" }}>
                    <BsPersonBadge size={20} style={{ color: "#f59e0b" }} />
                  </div>
                </div>
                <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Monthly Revenue</p>
                    <p className="text-3xl font-bold text-gray-800">LKR {totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ backgroundColor: "#10b98120" }}>
                    <BsCartCheck size={20} style={{ color: "#10b981" }} />
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-3 gap-5 mb-6">
                {/* Sales Overview - Line Chart */}
                <div className="col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <h2 className="text-sm font-semibold text-gray-700 mb-4">Sales Overview</h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={v => [`LKR ${v.toLocaleString()}`, "Revenue"]} />
                      <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6"
                        strokeWidth={2} fill="url(#revGrad)" animationDuration={1500} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Orders Summary - Bar Chart */}
                <div className="col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <h2 className="text-sm font-semibold text-gray-700 mb-4">Orders Summary</h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={orderStatusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="value" name="Orders" radius={[4, 4, 0, 0]} animationDuration={1200}>
                        {orderStatusData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Stock Status - Pie Chart */}
                <div className="col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <h2 className="text-sm font-semibold text-gray-700 mb-4">Stock Status</h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={stockStatusData} cx="50%" cy="50%"
                        innerRadius={50} outerRadius={75} paddingAngle={3}
                        dataKey="value" animationDuration={1200}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}>
                        {stockStatusData.map((entry, index) => (
                          <Cell key={index} fill={["#1e3a8a", "#f59e0b", "#ef4444"][index % 3]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-2 gap-5">
                {/* Recent Orders Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-700">Recent Orders</h2>
                    <Link to="/orders" className="text-xs text-blue-600 hover:underline">View All →</Link>
                  </div>
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Order ID", "Customer", "Status", "Total"].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentOrders.length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-8 text-gray-400 text-sm">No orders yet</td></tr>
                      ) : recentOrders.map((order, i) => (
                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-mono text-gray-600">
                            #{order._id?.slice(-4).toUpperCase() || String(1045 - i)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">{order.customer_name || order.customerName}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                            LKR {Number(order.total_amount || order.totalAmount || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-5 py-3 border-t border-gray-100 text-center">
                    <Link to="/orders" className="text-sm text-blue-600 hover:underline font-medium">View All →</Link>
                  </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-700">Low Stock Alerts</h2>
                    <Link to="/stocks" className="text-xs text-blue-600 hover:underline">Manage Stock →</Link>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {lowStockItems.length === 0 ? (
                      <p className="text-center py-8 text-gray-400 text-sm">All stock healthy ✅</p>
                    ) : lowStockItems.slice(0, 6).map((item) => (
                      <div key={item._id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.stockQuantity === 0 ? "#ef4444" : "#f59e0b" }}></div>
                          <span className="text-sm text-gray-800">{item.product} — {item.stockQuantity} left</span>
                        </div>
                        <Link to="/stocks" className="text-xs text-blue-500 hover:underline">Restock</Link>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-3 border-t border-gray-100 text-right">
                    <Link to="/stocks"
                      className="text-sm text-white px-4 py-2 rounded-lg font-medium"
                      style={{ background: "linear-gradient(135deg, #1e3a8a, #1d4ed8)" }}>
                      Manage Stock →
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;