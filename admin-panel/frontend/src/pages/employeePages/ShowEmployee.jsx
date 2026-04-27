import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";

const ShowEmployee = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5001/employees/${id}`)
      .then((res) => { setEmployee(res.data); setLoading(false); })
      .catch((err) => { console.log(err); setLoading(false); });
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-52 flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Employee Details</h1>
        </div>
        {loading ? <Spinner /> : employee ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-lg p-8">
            <div className="space-y-4">
              {[
                { label: "Employee ID", value: employee.employeeId },
                { label: "Name", value: employee.name },
                { label: "Role", value: employee.role },
                { label: "Contact", value: employee.contact },
                { label: "Email", value: employee.email },
                { label: "Salary", value: `LKR ${employee.salary.toLocaleString()}` },
                { label: "Payment Status", value: employee.paymentStatus },
                { label: "Joined", value: new Date(employee.createdAt).toLocaleString() },
              ].map((item) => (
                <div key={item.label} className="flex justify-between border-b border-gray-50 pb-3">
                  <span className="text-sm text-gray-500 font-medium">{item.label}</span>
                  <span className={`text-sm font-medium ${item.label === "Payment Status" ? (employee.paymentStatus === "Paid" ? "text-green-600" : "text-red-600") : "text-gray-800"}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <Link to={`/employees/edit/${employee._id}`} className="flex-1 text-center bg-blue-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">Edit</Link>
              <Link to="/employees" className="flex-1 text-center bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Back</Link>
            </div>
          </div>
        ) : <p className="text-gray-500">Employee not found.</p>}
      </div>
    </div>
  );
};

export default ShowEmployee;