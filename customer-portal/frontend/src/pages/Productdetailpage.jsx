import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BsCart3, BsArrowLeft, BsCheckCircle } from "react-icons/bs";
import { MdBuild } from "react-icons/md";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded]       = useState(false);
  const [related, setRelated]   = useState([]);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart") || "[]"));

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5002/shop/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
        // fetch related products
        axios.get("http://localhost:5002/shop")
          .then((r) => {
            const others = (r.data.products || []).filter(p => p._id !== id).slice(0, 4);
            setRelated(others);
          });
      })
      .catch((err) => { console.log(err); setLoading(false); });
  }, [id]);

  const addToCart = () => {
    const existing = cart.find(i => i._id === product._id);
    let newCart;
    if (existing) {
      newCart = cart.map(i => i._id === product._id ? { ...i, qty: i.qty + quantity } : i);
    } else {
      newCart = [...cart, { ...product, qty: quantity }];
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isLowStock = product && product.stockQuantity <= product.reorderLevel;
  const isOutOfStock = product && product.stockQuantity === 0;

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={cart.length} />
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={cart.length} />
      <div className="text-center py-32">
        <p className="text-gray-400 text-lg">Product not found</p>
        <Link to="/shop" className="text-orange-500 hover:underline mt-2 block">Back to Shop</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={cart.length} />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Back button */}
        <Link to="/shop" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-8 transition-colors w-fit">
          <BsArrowLeft /> Back to Shop
        </Link>

        {/* Product Detail */}
        <div className="grid grid-cols-2 gap-12 bg-white rounded-2xl p-10 shadow-sm border border-gray-100 mb-12">
          {/* Image */}
          <div className="rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center h-96">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.product}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <MdBuild className="text-gray-300 text-9xl" />
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-widest mb-2">
              {product.supplier || 'General'}
            </p>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.product}</h1>

            <p className="text-3xl font-bold text-orange-500 mb-2">
              LKR {(product.price || 0).toLocaleString()}
            </p>

            {/* Stock status */}
            {isOutOfStock ? (
              <span className="text-red-500 font-semibold text-sm mb-4">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-orange-500 font-semibold text-sm mb-4">Low Stock — Only {product.stockQuantity} left</span>
            ) : (
              <span className="text-green-500 font-semibold text-sm mb-4">In Stock</span>
            )}

            <p className="text-gray-500 text-sm mb-6">
              Available Quantity: <span className="font-semibold text-gray-700">{product.stockQuantity}</span>
            </p>

            {/* Quantity selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors font-bold text-lg"
                  >
                    −
                  </button>
                  <span className="px-5 py-2.5 text-gray-800 font-semibold border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                    className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors font-bold text-lg"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={addToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all ${
                    added
                      ? "bg-green-500 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {added ? (
                    <><BsCheckCircle size={18} /> Added to Cart!</>
                  ) : (
                    <><BsCart3 size={18} /> Add to Cart</>
                  )}
                </button>
              </div>
            )}

            {/* Total */}
            {!isOutOfStock && (
              <div className="bg-orange-50 border border-orange-100 rounded-lg px-5 py-3 flex items-center justify-between mb-6">
                <span className="text-sm text-gray-600 font-medium">Total for {quantity} item{quantity > 1 ? 's' : ''}:</span>
                <span className="text-lg font-bold text-orange-600">
                  LKR {((product.price || 0) * quantity).toLocaleString()}
                </span>
              </div>
            )}

            {/* View cart button */}
            <Link to="/cart"
              className="text-center border border-gray-200 text-gray-700 hover:bg-gray-50 py-2.5 rounded-lg text-sm font-medium transition-colors">
              View Cart ({cart.length} items)
            </Link>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Related Products</h2>
            <div className="grid grid-cols-4 gap-6">
              {related.map((item) => (
                <Link to={`/shop/${item._id}`} key={item._id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 group">
                  <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.product}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => e.target.style.display = 'none'} />
                    ) : (
                      <MdBuild className="text-gray-300 text-5xl" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-1 mb-1 group-hover:text-orange-500 transition-colors">
                      {item.product}
                    </h3>
                    <p className="text-orange-500 font-bold text-sm">LKR {(item.price || 0).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">© 2026 Paramount Enterprises. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetailPage;