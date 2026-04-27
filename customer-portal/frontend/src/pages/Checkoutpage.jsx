import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import emailjs from "@emailjs/browser";
import Navbar from "../components/Navbar";
import { BsCheckCircleFill, BsCreditCard, BsCash, BsLockFill } from "react-icons/bs";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51TOYwgD3POZrS1Tcp1vTMJtjpqIcCkPxlgIIo2FhqBYhT9xgqBiUNIyiEJVX2BsbKTiNxZvVWCKyGMPtnk1hyJIH00U3jRNgzW");

// EmailJS config
const EMAILJS_SERVICE  = "service_iefwa6r";
const EMAILJS_TEMPLATE = "template_fb54p7g";
const EMAILJS_KEY      = "3gaZCZzShhTTeSa1n";

const sendOrderEmail = (customer, orderId, cart, total, paymentMethod) => {
  const itemsList = cart.map(i =>
    `${i.product} x${i.qty} — LKR ${((i.price || 0) * i.qty).toLocaleString()}`
  ).join("\n");

  const templateParams = {
    customer_name:   customer.name,
    customer_email:  customer.email,
    order_id:        orderId.slice(-8).toUpperCase(),
    total_amount:    `LKR ${total.toLocaleString()}`,
    payment_method:  paymentMethod === "stripe" ? "Credit/Debit Card (Stripe)" : "Cash on Delivery",
    items:           itemsList,
    email:           customer.email,
  };

  return emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, templateParams, EMAILJS_KEY);
};

// ── Stripe Card Form ──────────────────────────────────────
const CardForm = ({ total, onSuccess, loading, setLoading }) => {
  const stripe   = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setCardError("");
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    if (error) {
      setCardError(error.message);
      setLoading(false);
      return;
    }
    console.log("Payment method created:", paymentMethod.id);
    onSuccess();
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-xl p-4 bg-white">
        <CardElement options={{
          style: {
            base: { fontSize: "15px", color: "#1f2937", fontFamily: "system-ui, sans-serif", "::placeholder": { color: "#9ca3af" } },
            invalid: { color: "#ef4444" },
          },
          hidePostalCode: true,
        }} />
      </div>
      {cardError && <p className="text-red-500 text-xs">⚠ {cardError}</p>}
      <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
        <p className="text-xs text-blue-700 font-medium">
          🧪 Test card: <span className="font-mono font-bold">4242 4242 4242 4242</span> — any future date — any CVC
        </p>
      </div>
      <button onClick={handlePay} disabled={loading || !stripe}
        className="w-full text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
        <BsLockFill size={14} />
        {loading ? "Processing..." : `Pay LKR ${total.toLocaleString()}`}
      </button>
    </div>
  );
};

// ── Main Checkout ─────────────────────────────────────────
const CheckoutPage = () => {
  const navigate = useNavigate();
  const customer = JSON.parse(localStorage.getItem("customer") || "null");
  const cart     = JSON.parse(localStorage.getItem("cart") || "[]");

  const [notes, setNotes]               = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [loading, setLoading]           = useState(false);
  const [success, setSuccess]           = useState(false);
  const [orderId, setOrderId]           = useState("");
  const [emailSent, setEmailSent]       = useState(false);

  const total = cart.reduce((sum, i) => sum + (i.price || 0) * i.qty, 0);

  useEffect(() => {
    if (!customer) { navigate("/login"); return; }
    if (cart.length === 0 && !success) { navigate("/cart"); }
  }, []);

  const placeOrder = async () => {
    const res = await axios.post("http://localhost:5002/orders", {
      customer_id:    customer.id,
      customer_name:  customer.name,
      customer_email: customer.email,
      phone:          customer.phone || "",
      address:        customer.address || "",
      notes,
      items: cart.map(i => ({
        product_name: i.product,
        quantity:     i.qty,
        unit_price:   i.price || 0,
        subtotal:     (i.price || 0) * i.qty,
      })),
    });
    return res.data._id;
  };

  const handleSuccess = async (method) => {
    try {
      setLoading(true);
      const id = await placeOrder();
      setOrderId(id);
      localStorage.setItem("cart", JSON.stringify([]));

      // Send confirmation email
      try {
        await sendOrderEmail(customer, id, cart, total, method);
        setEmailSent(true);
      } catch (emailErr) {
        console.log("Email error (non-critical):", emailErr);
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert("Error saving order: " + err.message);
    }
  };

  // ── Success Screen ──────────────────────────────────────
  if (success) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={0} />
      <div className="flex items-center justify-center py-24">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md w-full text-center">
          <BsCheckCircleFill className="text-green-500 text-7xl mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed! 🎉</h2>
          <p className="text-gray-500 mb-2">Thank you, {customer.name}!</p>
          {emailSent && (
            <p className="text-green-500 text-xs font-medium mb-2">
              ✅ Confirmation email sent to {customer.email}
            </p>
          )}
          <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-4 py-2 mb-8 font-mono">
            Order ID: #{orderId.slice(-8).toUpperCase()}
          </p>
          <div className="flex gap-3">
            <Link to="/orders"
              className="flex-1 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
              style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
              View My Orders
            </Link>
            <Link to="/shop"
              className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 py-2.5 rounded-lg text-sm font-semibold transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (!customer) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={cart.length} />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-2 gap-8">
          {/* Left */}
          <div className="space-y-5">
            {/* Delivery Info */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Delivery Information</h2>
              <div className="space-y-3">
                {[
                  { label: "Name",    value: customer.name },
                  { label: "Email",   value: customer.email },
                  { label: "Phone",   value: customer.phone || "Not provided" },
                  { label: "Address", value: customer.address || "Not provided" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="text-gray-800 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
              <Link to="/account" className="text-xs mt-3 block hover:underline" style={{ color: "#f59e0b" }}>
                Update delivery info →
              </Link>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Method</h2>
              <div className="space-y-3 mb-5">
                {/* Stripe */}
                <div onClick={() => setPaymentMethod("stripe")}
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "stripe" ? "bg-amber-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={paymentMethod === "stripe" ? { borderColor: "#f59e0b" } : {}}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0`}
                    style={{ borderColor: paymentMethod === "stripe" ? "#f59e0b" : "#d1d5db" }}>
                    {paymentMethod === "stripe" && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#f59e0b" }}></div>}
                  </div>
                  <BsCreditCard className="flex-shrink-0" size={20} style={{ color: "#f59e0b" }} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Credit / Debit Card</p>
                    <p className="text-xs text-gray-400">Powered by Stripe — Secure payment</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">VISA</span>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">MC</span>
                  </div>
                </div>

                {/* Cash */}
                <div onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "cod" ? "bg-amber-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={paymentMethod === "cod" ? { borderColor: "#f59e0b" } : {}}>
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: paymentMethod === "cod" ? "#f59e0b" : "#d1d5db" }}>
                    {paymentMethod === "cod" && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#f59e0b" }}></div>}
                  </div>
                  <BsCash className="flex-shrink-0" size={20} style={{ color: "#f59e0b" }} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Cash on Delivery</p>
                    <p className="text-xs text-gray-400">Pay when your order arrives</p>
                  </div>
                </div>
              </div>

              {/* Stripe Form */}
              {paymentMethod === "stripe" && (
                <Elements stripe={stripePromise}>
                  <CardForm total={total} onSuccess={() => handleSuccess("stripe")} loading={loading} setLoading={setLoading} />
                </Elements>
              )}

              {/* COD Button */}
              {paymentMethod === "cod" && (
                <button onClick={() => handleSuccess("cod")} disabled={loading}
                  className="w-full text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Notes</h2>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions..." rows={3}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none resize-none"
                style={{ outline: "none" }}
                onFocus={e => e.target.style.boxShadow = "0 0 0 2px rgba(245,158,11,0.3)"}
                onBlur={e => e.target.style.boxShadow = "none"} />
            </div>
          </div>

          {/* Right — Summary */}
          <div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-600 flex-1 mr-2 line-clamp-1">{item.product} × {item.qty}</span>
                    <span className="font-medium text-gray-800">LKR {((item.price || 0) * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-800">LKR {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className="text-green-500 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span style={{ color: "#f59e0b" }}>LKR {total.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mt-2">
                <BsLockFill size={11} />
                <span>Secured by Stripe</span>
              </div>
              <Link to="/cart" className="block text-center text-gray-400 hover:text-gray-600 text-sm mt-4 transition-colors">
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-slate-900 text-gray-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">© 2026 Paramount Enterprises. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CheckoutPage;