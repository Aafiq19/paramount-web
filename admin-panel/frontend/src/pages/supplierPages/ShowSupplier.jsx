import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";

const ShowSupplier = () => {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5001/suppliers/${id}`)
      .then((res) => { setSupplier(res.data); setLoading(false); })
      .catch((err) => { console.log(err); setLoading(false); });
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-52 flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Supplier Details</h1>
        </div>
        {loading ? <Spinner /> : supplier ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-lg p-8">
            <div className="space-y-4">
              {[
                { label: "Supplier Name", value: supplier.supplierName },
                { label: "Contact", value: supplier.contact },
                { label: "Email", value: supplier.email || '-' },
                { label: "Address", value: supplier.address || '-' },
                { label: "Products Supplied", value: supplier.productsSupplied || '-' },
                { label: "Added On", value: new Date(supplier.createdAt).toLocaleString() },
              ].map((item) => (
                <div key={item.label} className="flex justify-between border-b border-gray-50 pb-3">
                  <span className="text-sm text-gray-500 font-medium">{item.label}</span>
                  <span className="text-sm text-gray-800 font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <Link to={`/suppliers/edit/${supplier._id}`} className="flex-1 text-center bg-blue-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">Edit</Link>
              <Link to="/suppliers" className="flex-1 text-center bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Back</Link>
            </div>
          </div>
        ) : <p className="text-gray-500">Supplier not found.</p>}
      </div>
    </div>
  );
};

export default ShowSupplier;