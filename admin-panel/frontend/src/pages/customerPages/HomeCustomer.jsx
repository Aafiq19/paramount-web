import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BsInfoCircle, BsPeopleFill, BsSearch } from "react-icons/bs";
import { MdOutlineDelete, MdFilterList } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import Spinner from "../../components/Spinner";
import Sidebar from "../../components/Sidebar";
import { generateCustomerPDF } from "../../utils/generatePDF";

const HomeCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', email: '', address: '', notes: '' });
  const [errors, setErrors] = useState({});

  const fetchCustomers = () => {
    axios.get("http://localhost:5001/customers")
      .then((res) => { setCustomers(res.data.customers || []); setLoading(false); })
      .catch((err) => { console.log(err); setLoading(false); });
  };

  useEffect(() => { fetchCustomers(); }, []);

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.contact?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.contact.trim()) e.contact = "Contact is required";
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaving(true);
    axios.post("http://localhost:5001/customers", form)
      .then(() => { setSaving(false); setShowModal(false); setForm({ name:'', contact:'', email:'', address:'', notes:'' }); fetchCustomers(); })
      .catch(err => { setSaving(false); alert("Error: " + err.message); });
  };

  const inputClass = (err) =>
    `w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none transition ${err ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"}`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-52 flex-1">

        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Customer Management</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input type="text" placeholder="Search..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 w-56" />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <MdFilterList size={16} /> Filter
            </button>
            <button onClick={() => generateCustomerPDF(customers)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Export PDF
            </button>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium"
              style={{ background: "linear-gradient(135deg, #1e3a8a, #1d4ed8)" }}>
              + Add Customer
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-5 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg"><BsPeopleFill className="text-blue-900 text-xl" /></div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Total Customers</p>
                <p className="text-3xl font-bold text-gray-800">{customers.length}</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? <Spinner /> : (
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: "#0f172a" }}>
                    {["ID", "Name", "Email", "Phone", "Total Orders", "Total Spent (LKR)", "Joined", "Actions"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-12 text-gray-400 text-sm">No customers found.</td></tr>
                  ) : filtered.map((c, i) => (
                    <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-sm text-gray-500 font-mono">C{String(i + 1).padStart(3, '0')}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-gray-800">{c.name}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">{c.email || '-'}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">{c.contact || c.phone || '-'}</td>
                      <td className="px-5 py-3 text-sm text-gray-600 text-center">-</td>
                      <td className="px-5 py-3 text-sm text-gray-600 text-center">-</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Link to={`/customers/details/${c._id}`}><BsInfoCircle size={16} className="text-blue-500 hover:text-blue-700" /></Link>
                          <Link to={`/customers/edit/${c._id}`}><AiOutlineEdit size={17} className="text-amber-500 hover:text-amber-700" /></Link>
                          <Link to={`/customers/delete/${c._id}`}><MdOutlineDelete size={18} className="text-red-500 hover:text-red-700" /></Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">Showing {filtered.length} of {customers.length} customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Add Customer</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={e => { setForm({...form, name: e.target.value}); setErrors({...errors, name: ''}); }}
                  placeholder="e.g. John Smith" className={inputClass(errors.name)} />
                {errors.name && <p className="text-red-500 text-xs mt-1">⚠ {errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                  <input type="text" value={form.contact} onChange={e => { setForm({...form, contact: e.target.value}); setErrors({...errors, contact: ''}); }}
                    placeholder="+94 71 234 5678" className={inputClass(errors.contact)} />
                  {errors.contact && <p className="text-red-500 text-xs mt-1">⚠ {errors.contact}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Address <span className="text-red-500">*</span></label>
                  <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                    placeholder="Enter address" className={inputClass(false)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="john@example.com" className={inputClass(false)} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd} disabled={saving}
                className="flex-1 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #1e3a8a, #1d4ed8)" }}>
                {saving ? "Saving..." : "Add Customer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeCustomer;