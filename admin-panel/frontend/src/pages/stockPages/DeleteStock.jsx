import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";

const DeleteStock = () => {
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5001/stocks/${id}`)
      .then((response) => {
        setStock(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    setDeleting(true);
    axios
      .delete(`http://localhost:5001/stocks/${id}`)
      .then(() => {
        setDeleting(false);
        navigate("/stocks");
      })
      .catch((error) => {
        setDeleting(false);
        alert("Error deleting product: " + error.message);
      });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-56 flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Delete Product</h1>
          <p className="text-gray-500 text-sm mt-1">This action cannot be undone</p>
        </div>

        {loading ? (
          <Spinner />
        ) : stock ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-lg p-8">
            {/* Warning Icon */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-red-600 text-3xl">⚠</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Are you sure?</h2>
              <p className="text-gray-500 text-sm">
                You are about to permanently delete this product. This cannot be undone.
              </p>
            </div>

            {/* Product Info */}
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Product</span>
                <span className="text-gray-800 font-semibold">{stock.product}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Supplier</span>
                <span className="text-gray-800">{stock.supplier}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Stock Quantity</span>
                <span className="text-gray-800">{stock.stockQuantity}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <Link
                to="/"
                className="flex-1 text-center bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Product not found.</p>
        )}
      </div>
    </div>
  );
};

export default DeleteStock;