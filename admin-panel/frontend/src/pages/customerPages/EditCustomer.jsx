import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";

const EditCustomer = () => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5001/customers/${id}`)
      .then((res) => {
        setName(res.data.name); setContact(res.data.contact);
        setEmail(res.data.email || ""); setAddress(res.data.address || "");
        setNotes(res.data.notes || ""); setLoading(false);
      })
      .catch((err) => { console.log(err); setLoading(false); });
  }, [id]);

  const handleSubmit = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    if (!contact.trim()) e.contact = "Contact is required";
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaving(true);
    axios.put(`http://localhost:5001/customers/${id}`, { name, contact, email, address, notes })
      .then(() => { setSaving(false); navigate("/customers"); })
      .catch((err) => { setSaving(false); alert("Error: " + err.message); });
  };

  const inputClass = (err) =>
    `w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition ${err ? "border-red-400 bg-red-50" : "border-gray-200"}`;

  if (loading) return <div className="flex min-h-screen bg-gray-50"><Sidebar /><div className="ml-52 flex-1 p-8"><Spinner /></div></div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-52 flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Customer</h1>
          <p className="text-gray-500 text-sm mt-1">Update customer details</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-lg p-8">
          <div className="space-y-5">
            {[
              { label: "Full Name *", value: name, set: setName, err: errors.name, key: "name" },
              { label: "Phone Number *", value: contact, set: setContact, err: errors.contact, key: "contact" },
              { label: "Address", value: address, set: setAddress, err: null, key: null },
              { label: "Email Address", value: email, set: setEmail, err: null, key: null },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                <input type="text" value={f.value} onChange={(e) => { f.set(e.target.value); if (f.key) setErrors({...errors, [f.key]: ""}); }} className={inputClass(f.err)} />
                {f.err && <p className="text-red-500 text-xs mt-1.5">⚠ {f.err}</p>}
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={inputClass(false) + " resize-none"} />
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={handleSubmit} disabled={saving} className="flex-1 bg-blue-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-60">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link to="/customers" className="flex-1 text-center bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;