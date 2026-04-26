import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MdDashboard, MdInventory, MdShoppingCart,
  MdPeople, MdLocalShipping, MdBadge, MdLogout,
} from "react-icons/md";

const Sidebar = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"User","role":"Staff"}');
  const isAdmin = user.role === 'Admin';

  // Staff sees all EXCEPT Employees
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <MdDashboard size={19} />, adminOnly: false },
    { path: "/customers", label: "Customers",  icon: <MdPeople size={19} />,      adminOnly: false },
    { path: "/orders",    label: "Orders",     icon: <MdShoppingCart size={19} />, adminOnly: false },
    { path: "/stocks",    label: "Stock",      icon: <MdInventory size={19} />,    adminOnly: false },
    { path: "/suppliers", label: "Suppliers",  icon: <MdLocalShipping size={19} />,adminOnly: false },
    { path: "/employees", label: "Employees",  icon: <MdBadge size={19} />,        adminOnly: true },
  ].filter(item => !item.adminOnly || isAdmin);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="fixed left-0 top-0 h-full w-52 flex flex-col z-10"
      style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)" }}>

      {/* Logo */}
      <div className="p-5 border-b border-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
            <span className="text-white font-bold text-base">P</span>
          </div>
          <div>
            <p className="font-bold text-sm leading-tight text-white">Paramount</p>
            <p className="text-slate-400 text-xs">Enterprises</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
          return (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive ? "text-white shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
              style={isActive ? { background: "linear-gradient(135deg, #f59e0b, #d97706)" } : {}}>
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Role Badge + User + Logout */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-sm font-medium text-white leading-tight">{user.name}</p>
            <span className="text-xs px-2 py-0.5 rounded-full text-slate-300"
              style={{
                backgroundColor: isAdmin ? "rgba(245,158,11,0.2)" : "rgba(59,130,246,0.2)",
                border: `1px solid ${isAdmin ? "rgba(245,158,11,0.4)" : "rgba(59,130,246,0.4)"}`,
                color: isAdmin ? "#fbbf24" : "#93c5fd"
              }}>
              {user.role}
            </span>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm w-full transition-colors mt-1">
          <MdLogout size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;