import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";

const EditSupplier = () => {
  const [supplierName, setSupplierName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [productsSupplied, setProductsSupplied] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5001/suppliers/${id}`)
      .then((res) => {
        setSupplierName(res.data.supplierName); setContact(res.data.contact);
        setEmail(res.data.email || ""); setAddress(res.data.address || "");
        setProductsSupplied(res.data.productsSupplied || ""); setLoading(false);
      })
      .catch((err) => { console.log(err); setLoading(false); });
  }, [id]);

  const handleSubmit = () => {
    if (!supplierName.trim() || !contact.trim()) { alert("Name and contact are required"); return; }
    setSaving(true);
    axios.put(`http://localhost:5001/suppliers/${id}`, { supplierName, contact, email, address, productsSupplied })
      .then(() => { setSaving(false); navigate("/suppliers"); })
      .catch((err) => { setSaving(false); alert("Error: " + err.message); });
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition";

  if (loading) return <div className="flex min-h-screen bg-gray-50"><Sidebar /><div className="ml-52 flex-1 p-8"><Spinner /></div></div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-52 flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Supplier</h1>
          <p className="text-gray-500 text-sm mt-1">Update supplier details</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-lg p-8">
          <div className="space-y-5">
            {[
              { label: "Supplier Name *", value: supplierName, set: setSupplierName },
              { label: "Contact *", value: contact, set: setContact },
              { label: "Email", value: email, set: setEmail },
              { label: "Address", value: address, set: setAddress },
              { label: "Products Supplied", value: productsSupplied, set: setProductsSupplied },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                <input type="text" value={f.value} onChange={(e) => f.set(e.target.value)} className={inputClass} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={handleSubmit} disabled={saving} className="flex-1 bg-blue-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-60">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link to="/suppliers" className="flex-1 text-center bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSupplier;