import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BsArrowRight, BsShieldCheck, BsTruck, BsHeadset, BsStar, BsCart3 } from "react-icons/bs";
import { MdBuild, MdElectricalServices, MdPlumbing, MdConstruction } from "react-icons/md";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart") || "[]"));

  useEffect(() => {
    axios.get("http://localhost:5002/shop")
      .then((res) => setProducts(res.data.products || []))
      .catch((err) => console.log(err));
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

  const featuredProducts = products.slice(0, 4);

  const categories = [
    { label: "Tools",       icon: <MdBuild size={28} />,               color: "bg-blue-100 text-blue-700" },
    { label: "Electrical",  icon: <MdElectricalServices size={28} />,   color: "bg-yellow-100 text-yellow-700" },
    { label: "Plumbing",    icon: <MdPlumbing size={28} />,             color: "bg-cyan-100 text-cyan-700" },
    { label: "Construction",icon: <MdConstruction size={28} />,         color: "bg-orange-100 text-orange-700" },
  ];

  const features = [
    { icon: <BsTruck size={24} />,       title: "Fast Delivery",      desc: "Quick delivery to your doorstep" },
    { icon: <BsShieldCheck size={24} />, title: "Quality Guaranteed",  desc: "Only genuine products" },
    { icon: <BsHeadset size={24} />,     title: "24/7 Support",        desc: "Always here to help you" },
    { icon: <BsStar size={24} />,        title: "Best Prices",         desc: "Competitive pricing always" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartCount={cart.length} />

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200')" }}
        />
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-32">
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold leading-tight mb-4">
              Build Better with{" "}
              <span className="text-orange-400">Quality Hardware</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Premium construction materials, tools, and supplies for professionals and DIY enthusiasts.
            </p>
            <div className="flex gap-4">
              <Link to="/shop"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
                Shop Now <BsArrowRight />
              </Link>
              <Link to="/shop"
                className="border border-white text-white hover:bg-white hover:text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors">
                View Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link to="/shop" key={cat.label}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className={`${cat.color} p-4 rounded-full`}>{cat.icon}</div>
              <span className="font-semibold text-gray-800">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
            <Link to="/shop" className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1">
              View All <BsArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {featuredProducts.length === 0 ? (
              <p className="col-span-4 text-center text-gray-400 py-12">Loading products...</p>
            ) : featuredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <Link to={`/shop/${product._id}`}>
                  <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.product}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MdBuild className="text-gray-300 text-6xl" />
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <p className="text-xs text-gray-400 uppercase font-medium mb-1">{product.category || 'General'}</p>
                  <Link to={`/shop/${product._id}`}>
                    <h3 className="font-semibold text-gray-800 mb-2 hover:text-orange-500 transition-colors line-clamp-1">
                      {product.product}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-800">
                        LKR {(product.price || 0).toLocaleString()}
                      </span>
                      <p className={`text-xs font-medium mt-0.5 ${product.stockQuantity > product.reorderLevel ? "text-green-500" : "text-red-500"}`}>
                        {product.stockQuantity > product.reorderLevel ? "In Stock" : "Low Stock"}
                      </p>
                    </div>
                    <button onClick={() => addToCart(product)}
                      className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors">
                      <BsCart3 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-4 p-5 rounded-xl border border-gray-100">
              <div className="text-orange-500 mt-0.5">{f.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">P</span>
            </div>
            <span className="text-white font-bold">Paramount Enterprises</span>
          </div>
          <p className="text-sm">© 2026 Paramount Enterprises. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;