import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle, BsBoxSeam, BsCurrencyDollar, BsExclamationTriangle } from "react-icons/bs";
import { MdBuild } from "react-icons/md";
import Spinner from "../../components/Spinner";
import Sidebar from "../../components/Sidebar";
import { generateStockPDF } from "../../utils/generatePDF";

const Home = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5001/stocks")
      .then((response) => {
        setStocks(response.data.stocks);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const totalProducts  = stocks.length;
  const totalStockValue = stocks.reduce((sum, s) => sum + s.stockQuantity, 0);
  const lowStockItems  = stocks.filter(s => s.stockQuantity <= s.reorderLevel).length;

  const filtered = stocks.filter(s =>
    s.product.toLowerCase().includes(search.toLowerCase()) ||
    s.supplier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-52 flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Stock Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage inventory and track stock levels</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg"><BsBoxSeam className="text-blue-900 text-xl" /></div>
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Products</p>
              <p className="text-3xl font-bold text-gray-800">{totalProducts}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg"><BsCurrencyDollar className="text-green-700 text-xl" /></div>
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Stock Units</p>
              <p className="text-3xl font-bold text-gray-800">{totalStockValue}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-lg"><BsExclamationTriangle className="text-red-600 text-xl" /></div>
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Low Stock Items</p>
              <p className="text-3xl font-bold text-gray-800">{lowStockItems}</p>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search by product name or supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            <Link to="/stocks/create"
              className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
              <MdOutlineAddBox size={18} /> Add Product
            </Link>
          </div>

          {loading ? <Spinner /> : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    {["Image", "Product Name", "Supplier", "Price", "Quantity", "Reorder Level", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-12 text-gray-400 text-sm">No products found.</td></tr>
                  ) : filtered.map((stock) => (
                    <tr key={stock._id} className="hover:bg-gray-50 transition-colors">
                      {/* Image */}
                      <td className="px-5 py-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {stock.imageUrl ? (
                            <img
                              src={stock.imageUrl}
                              alt={stock.product}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            />
                          ) : null}
                          <div className={`w-full h-full items-center justify-center ${stock.imageUrl ? 'hidden' : 'flex'}`}>
                            <MdBuild className="text-gray-300 text-xl" />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-800">{stock.product}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{stock.supplier}</td>
                      <td className="px-5 py-4 text-sm text-gray-800 font-medium">
                        {stock.price ? `LKR ${stock.price.toLocaleString()}` : <span className="text-gray-400 text-xs">Not set</span>}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-800 font-medium">{stock.stockQuantity}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{stock.reorderLevel}</td>
                      <td className="px-5 py-4">
                        {stock.stockQuantity <= stock.reorderLevel ? (
                          <span className="bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">Low Stock</span>
                        ) : (
                          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">In Stock</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Link to={`/stocks/details/${stock._id}`}><BsInfoCircle size={17} className="text-blue-600 hover:text-blue-800" /></Link>
                          <Link to={`/stocks/edit/${stock._id}`}><AiOutlineEdit size={18} className="text-yellow-500 hover:text-yellow-700" /></Link>
                          <Link to={`/stocks/delete/${stock._id}`}><MdOutlineDelete size={19} className="text-red-500 hover:text-red-700" /></Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end p-5 border-t border-gray-100">
            <button onClick={() => generateStockPDF(stocks)}
              className="bg-blue-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;