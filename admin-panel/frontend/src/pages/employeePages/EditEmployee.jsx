import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";

const EditEmployee = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [salary, setSalary] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5001/employees/${id}`)
      .then((res) => {
        const e = res.data;
        setEmployeeId(e.employeeId); setName(e.name); setRole(e.role);
        setContact(e.contact); setEmail(e.email); setSalary(e.salary);
        setPaymentStatus(e.paymentStatus); setLoading(false);
      })
      .catch((err) => { console.log(err); setLoading(false); });
  }, [id]);

  const handleSubmit = () => {
    if (!employeeId || !name || !role || !contact || !email || !salary) {
      alert("Please fill all required fields"); return;
    }
    setSaving(true);
    axios.put(`http://localhost:5001/employees/${id}`, {
      employeeId, name, role, contact, email,
      salary: Number(salary), paymentStatus
    })
      .then(() => { setSaving(false); navigate("/employees"); })
      .catch((err) => { setSaving(false); alert("Error: " + err.message); });
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition";

  if (loading) return <div className="flex min-h-screen bg-gray-50"><Sidebar /><div className="ml-52 flex-1 p-8"><Spinner /></div></div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-52 flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Employee</h1>
          <p className="text-gray-500 text-sm mt-1">Update employee details</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-lg p-8">
          <div className="space-y-5">
            {[
              { label: "Employee ID *", value: employeeId, set: setEmployeeId, type: "text" },
              { label: "Full Name *", value: name, set: setName, type: "text" },
              { label: "Contact *", value: contact, set: setContact, type: "text" },
              { label: "Email *", value: email, set: setEmail, type: "email" },
              { label: "Salary (LKR) *", value: salary, set: setSalary, type: "number" },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                <input type={f.type} value={f.value} onChange={(e) => f.set(e.target.value)} className={inputClass} />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role *</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className={inputClass}>
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Status</label>
              <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className={inputClass}>
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={handleSubmit} disabled={saving} className="flex-1 bg-blue-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-60">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link to="/employees" className="flex-1 text-center bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;