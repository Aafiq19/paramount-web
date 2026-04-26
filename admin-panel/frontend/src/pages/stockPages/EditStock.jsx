import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";

const EditStock = () => {
  const [product, setProduct]             = useState("");
  const [supplier, setSupplier]           = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [reorderLevel, setReorderLevel]   = useState("");
  const [price, setPrice]                 = useState("");
  const [imageUrl, setImageUrl]           = useState("");
  const [loading, setLoading]             = useState(true);
  const [saving, setSaving]               = useState(false);
  const [errors, setErrors]               = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5001/stocks/${id}`)
      .then((res) => {
        const s = res.data;
        setProduct(s.product || "");
        setSupplier(s.supplier || "");
        setStockQuantity(s.stockQuantity ?? "");
        setReorderLevel(s.reorderLevel ?? "");
        setPrice(s.price ?? "");
        setImageUrl(s.imageUrl || "");
        setLoading(false);
      })
      .catch((err) => { console.log(err); setLoading(false); });
  }, [id]);

  const validate = () => {
    const e = {};
    if (!product.trim())  e.product = "Product name is required";
    if (!supplier.trim()) e.supplier = "Supplier name is required";
    if (stockQuantity === "") e.stockQuantity = "Stock quantity is required";
    else if (Number(stockQuantity) < 0) e.stockQuantity = "Cannot be negative";
    if (reorderLevel === "") e.reorderLevel = "Reorder level is required";
    else if (Number(reorderLevel) < 0) e.reorderLevel = "Cannot be negative";
    return e;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setSaving(true);
    axios.put(`http://localhost:5001/stocks/${id}`, {
      product,
      supplier,
      stockQuantity: Number(stockQuantity),
      reorderLevel:  Number(reorderLevel),
      price:         Number(price) || 0,
      imageUrl:      imageUrl.trim(),
    })
      .then(() => { setSaving(false); navigate("/stocks"); })
      .catch((err) => { setSaving(false); alert("Error: " + err.message); });
  };

  const inputClass = (err) =>
    `w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition ${
      err ? "border-red-400 bg-red-50" : "border-gray-200"
    }`;

  if (loading) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar /><div className="ml-52 flex-1 p-8"><Spinner /></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-52 flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
          <p className="text-gray-500 text-sm mt-1">Update the product stock details</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-lg p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">✎</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Edit Details</h2>
          </div>

          <div className="space-y-5">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input type="text" value={product}
                onChange={(e) => { setProduct(e.target.value); setErrors({...errors, product: ""}); }}
                className={inputClass(errors.product)} />
              {errors.product && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.product}</p>}
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Supplier <span className="text-red-500">*</span>
              </label>
              <input type="text" value={supplier}
                onChange={(e) => { setSupplier(e.target.value); setErrors({...errors, supplier: ""}); }}
                className={inputClass(errors.supplier)} />
              {errors.supplier && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.supplier}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (LKR)</label>
              <input type="number" value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 1500" min="0"
                className={inputClass(false)} />
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input type="number" value={stockQuantity}
                onChange={(e) => { setStockQuantity(e.target.value); setErrors({...errors, stockQuantity: ""}); }}
                min="0" className={inputClass(errors.stockQuantity)} />
              {errors.stockQuantity && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.stockQuantity}</p>}
            </div>

            {/* Reorder Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Reorder Level <span className="text-red-500">*</span>
              </label>
              <input type="number" value={reorderLevel}
                onChange={(e) => { setReorderLevel(e.target.value); setErrors({...errors, reorderLevel: ""}); }}
                min="0" className={inputClass(errors.reorderLevel)} />
              {errors.reorderLevel && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.reorderLevel}</p>}
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Product Image URL <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input type="text" value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={inputClass(false)} />
              {/* Live preview */}
              {imageUrl ? (
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                    <img src={imageUrl} alt="preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                  <p className="text-xs text-gray-400">Image preview</p>
                </div>
              ) : (
                <p className="text-gray-400 text-xs mt-1.5">Paste a direct image URL to show product photo in the shop</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={handleSubmit} disabled={saving}
              className="flex-1 bg-blue-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-60">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link to="/stocks"
              className="flex-1 text-center bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStock;