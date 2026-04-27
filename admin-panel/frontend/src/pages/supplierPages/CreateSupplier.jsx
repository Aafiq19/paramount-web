import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const CreateSupplier = () => {
  const [supplierName, setSupplierName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [productsSupplied, setProductsSupplied] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = () => {
    const e = {};
    if (!supplierName.trim()) e.supplierName = "Supplier name is required";
    if (!contact.trim()) e.contact = "Contact is required";
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    axios.post("http://localhost:5001/suppliers", { supplierName, contact, email, address, productsSupplied })
      .then(() => { setLoading(false); navigate("/suppliers"); })
      .catch((err) => { setLoading(false); alert("Error: " + err.message); });
  };

  const inputClass = (err) =>
    `w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition ${err ? "border-red-400 bg-red-50" : "border-gray-200"}`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-52 flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Add New Supplier</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the details to register a new supplier</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-lg p-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Supplier Name <span className="text-red-500">*</span></label>
              <input type="text" value={supplierName} onChange={(e) => { setSupplierName(e.target.value); setErrors({...errors, supplierName: ""}); }} placeholder="e.g. ABC Hardware Supplies" className={inputClass(errors.supplierName)} />
              {errors.supplierName && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.supplierName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact <span className="text-red-500">*</span></label>
              <input type="text" value={contact} onChange={(e) => { setContact(e.target.value); setErrors({...errors, contact: ""}); }} placeholder="e.g. 0771234567" className={inputClass(errors.contact)} />
              {errors.contact && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.contact}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. supplier@email.com" className={inputClass(false)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. 45 Main Street, Colombo" className={inputClass(false)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Products Supplied</label>
              <input type="text" value={productsSupplied} onChange={(e) => setProductsSupplied(e.target.value)} placeholder="e.g. Power Tools, Hand Tools" className={inputClass(false)} />
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-blue-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-60">
              {loading ? "Saving..." : "Save Supplier"}
            </button>
            <Link to="/suppliers" className="flex-1 text-center bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSupplier;