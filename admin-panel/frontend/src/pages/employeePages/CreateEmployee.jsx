import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const CreateEmployee = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [salary, setSalary] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!employeeId.trim()) e.employeeId = "Employee ID is required";
    if (!name.trim()) e.name = "Name is required";
    if (!role.trim()) e.role = "Role is required";
    if (!contact.trim()) e.contact = "Contact is required";
    if (!email.trim()) e.email = "Email is required";
    if (!salary) e.salary = "Salary is required";
    else if (Number(salary) < 0) e.salary = "Salary cannot be negative";
    return e;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setLoading(true);
    axios.post("http://localhost:5001/employees", {
      employeeId, name, role, contact, email,
      salary: Number(salary), paymentStatus
    })
      .then(() => { setLoading(false); navigate("/employees"); })
      .catch((err) => { setLoading(false); alert("Error: " + err.message); });
  };

  const inputClass = (err) =>
    `w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition ${err ? "border-red-400 bg-red-50" : "border-gray-200"}`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-52 flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Add New Employee</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the details to register a new employee</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-lg p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">+</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Employee Details</h2>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Employee ID <span className="text-red-500">*</span></label>
              <input type="text" value={employeeId} onChange={(e) => { setEmployeeId(e.target.value); setErrors({...errors, employeeId: ""}); }} placeholder="e.g. EMP001" className={inputClass(errors.employeeId)} />
              {errors.employeeId && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.employeeId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
              <input type="text" value={name} onChange={(e) => { setName(e.target.value); setErrors({...errors, name: ""}); }} placeholder="e.g. Ahmed Nafeed" className={inputClass(errors.name)} />
              {errors.name && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role <span className="text-red-500">*</span></label>
              <select value={role} onChange={(e) => { setRole(e.target.value); setErrors({...errors, role: ""}); }} className={inputClass(errors.role)}>
                <option value="">Select role...</option>
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
              </select>
              {errors.role && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.role}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact <span className="text-red-500">*</span></label>
              <input type="text" value={contact} onChange={(e) => { setContact(e.target.value); setErrors({...errors, contact: ""}); }} placeholder="e.g. 0771234567" className={inputClass(errors.contact)} />
              {errors.contact && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.contact}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors({...errors, email: ""}); }} placeholder="e.g. employee@email.com" className={inputClass(errors.email)} />
              {errors.email && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Salary (LKR) <span className="text-red-500">*</span></label>
              <input type="number" value={salary} onChange={(e) => { setSalary(e.target.value); setErrors({...errors, salary: ""}); }} placeholder="e.g. 50000" min="0" className={inputClass(errors.salary)} />
              {errors.salary && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.salary}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Status</label>
              <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className={inputClass(false)}>
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-blue-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-60">
              {loading ? "Saving..." : "Save Employee"}
            </button>
            <Link to="/employees" className="flex-1 text-center bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;