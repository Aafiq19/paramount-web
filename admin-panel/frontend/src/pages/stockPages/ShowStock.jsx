import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";

const ShowStock = () => {
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-56 flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Product Details</h1>
          <p className="text-gray-500 text-sm mt-1">View stock information</p>
        </div>

        {loading ? (
          <Spinner />
        ) : stock ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-lg p-8">
            <div className="space-y-5">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">{stock.product}</h2>
                {stock.stockQuantity <= stock.reorderLevel ? (
                  <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Low Stock
                  </span>
                ) : (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    In Stock
                  </span>
                )}
              </div>

              {[
                { label: "Product ID", value: stock._id },
                { label: "Supplier", value: stock.supplier },
                { label: "Stock Quantity", value: stock.stockQuantity },
                { label: "Reorder Level", value: stock.reorderLevel },
                { label: "Created At", value: new Date(stock.createdAt).toLocaleString() },
                { label: "Last Updated", value: new Date(stock.updatedAt).toLocaleString() },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-sm text-gray-500 font-medium">{item.label}</span>
                  <span className="text-sm text-gray-800 font-medium max-w-xs text-right break-all">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <Link
                to={`/stocks/edit/${stock._id}`}
                className="flex-1 text-center bg-blue-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
              >
                Edit Product
              </Link>
              <Link
                to="/"
                className="flex-1 text-center bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Back to List
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

export default ShowStock;