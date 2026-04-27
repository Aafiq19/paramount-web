import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BsCart3, BsSearch, BsFunnel } from "react-icons/bs";
import { MdBuild } from "react-icons/md";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [sortBy, setSortBy]     = useState("default");
  const [stockFilter, setStockFilter] = useState("all");
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart") || "[]"));

  useEffect(() => {
    axios.get("http://localhost:5002/shop")
      .then((res) => { setProducts(res.data.products || []); setLoading(false); })
      .catch((err) => { console.log(err); setLoading(false); });
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(i => i._id === product._id);
    let newCart;
    if (existing) {
      newCart = cart.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i);
    } else {
      newCart = [...cart, { ...product, qty: 1 }];
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Filter and sort
  let filtered = products.filter(p =>
    p.product.toLowerCase().includes(search.toLowerCase()) ||
    (p.supplier && p.supplier.toLowerCase().includes(search.toLowerCase()))
  );

  if (stockFilter === "instock") filtered = filtered.filter(p => p.stockQuantity > p.reorderLevel);
  if (stockFilter === "lowstock") filtered = filtered.filter(p => p.stockQuantity <= p.reorderLevel && p.stockQuantity > 0);

  if (sortBy === "price-asc")  filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0));
  if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0));
  if (sortBy === "name-asc")   filtered = [...filtered].sort((a, b) => a.product.localeCompare(b.product));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={cart.length} />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Shop All Products</h1>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            />
          </div>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="all">All Stock</option>
            <option value="instock">In Stock</option>
            <option value="lowstock">Low Stock</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="default">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BsFunnel className="text-gray-300 text-6xl mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No products found</p>
            <p className="text-gray-400 text-sm mt-1">Try changing your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {filtered.map((product) => {
              const isLowStock = product.stockQuantity <= product.reorderLevel;
              const cartItem = cart.find(i => i._id === product._id);

              return (
                <div key={product._id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 group">

                  {/* Image */}
                  <Link to={`/shop/${product._id}`}>
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.product}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                      ) : null}
                      <div className={`w-full h-full items-center justify-center ${product.imageUrl ? 'hidden' : 'flex'}`}>
                        <MdBuild className="text-gray-300 text-6xl" />
                      </div>

                      {/* Low stock badge */}
                      {isLowStock && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          Low Stock
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-xs text-gray-400 uppercase font-medium mb-1 tracking-wide">
                      {product.supplier || 'General'}
                    </p>
                    <Link to={`/shop/${product._id}`}>
                      <h3 className="font-semibold text-gray-800 mb-2 hover:text-orange-500 transition-colors line-clamp-2 leading-tight">
                        {product.product}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <p className="text-lg font-bold text-gray-800">
                          LKR {(product.price || 0).toLocaleString()}
                        </p>
                        <p className={`text-xs font-medium ${isLowStock ? "text-red-500" : "text-green-500"}`}>
                          {isLowStock ? "Low Stock" : "In Stock"}
                        </p>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-lg transition-colors relative"
                      >
                        <BsCart3 size={16} />
                        {cartItem && (
                          <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                            {cartItem.qty}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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

export default ShopPage;