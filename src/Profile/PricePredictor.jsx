// src/components/PricePredictor.jsx
import React, { useState } from "react";
import Navbar from "../Navbar";

const BACKEND_URL = "https://relayy-backend-9war.onrender.com"; // your backend proxy (must expose /api/price/predict)

const MOBILE_BRANDS = [
  "Apple",
  "Samsung",
  "OnePlus",
  "Xiaomi",
  "Realme",
  "Vivo",
  "Oppo",
  "Google",
  "Motorola",
  "Nothing",
];

const LAPTOP_BRANDS = [
  "Apple",
  "Dell",
  "HP",
  "Lenovo",
  "Asus",
  "Acer",
  "MSI",
  "Microsoft",
  "Razer",
];

const MOBILE_BRAND_HINTS = {
  Apple: "e.g. iPhone 14, iPhone 13 Pro, iPhone SE",
  Samsung: "e.g. Galaxy S23, Galaxy A54, Galaxy Note series",
  OnePlus: "e.g. OnePlus 11, OnePlus Nord",
  Xiaomi: "e.g. Redmi Note 12, Mi 11",
  Realme: "e.g. Realme 11, Realme GT",
  Vivo: "e.g. V27, X80",
  Oppo: "e.g. Reno8, Find X",
  Google: "e.g. Pixel 7, Pixel 6a",
  Motorola: "e.g. Moto G series, Edge series",
  Nothing: "e.g. Phone (1), Phone (2)",
};

const LAPTOP_BRAND_HINTS = {
  Apple: "e.g. MacBook Air (M1), MacBook Air (M2), MacBook Pro (M1 Pro)",
  Dell: "e.g. XPS 13, Inspiron 15, G15",
  HP: "e.g. Spectre x360, Envy, Pavilion",
  Lenovo: "e.g. ThinkPad X1, IdeaPad Slim",
  Asus: "e.g. ROG, ZenBook, Vivobook",
  Acer: "e.g. Swift, Aspire, Nitro",
  MSI: "e.g. Stealth, Katana, Pulse",
  Microsoft: "e.g. Surface Laptop, Surface Pro",
  Razer: "e.g. Razer Blade 14",
};

const mobileDefault = {
  brand: "",
  model: "",
  ram: "",
  storage: "",
  condition: "",
  age_years: "",
  original_price: "",
};

const laptopDefault = {
  brand: "",
  model: "",
  cpu: "",
  gpu: "",
  ram: "",
  memory: "", // storage
  condition: "",
  age_years: "",
  original_price: "",
};

export default function PricePredictor() {
  // 'type' is the item type (mobile | laptop | other)
  const [type, setType] = useState("mobile"); // default mobile
  const [mobileForm, setMobileForm] = useState({ ...mobileDefault });
  const [laptopForm, setLaptopForm] = useState({ ...laptopDefault });
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // handlers
  const handleMobileChange = (e) => {
    const { name, value } = e.target;
    setMobileForm((p) => ({ ...p, [name]: value }));
    setError("");
    setPrice(null);
  };

  const handleLaptopChange = (e) => {
    const { name, value } = e.target;
    setLaptopForm((p) => ({ ...p, [name]: value }));
    setError("");
    setPrice(null);
  };

  // validations
  const validateMobile = () => {
    const required = [
      "brand",
      "model",
      "ram",
      "storage",
      "condition",
      "age_years",
      "original_price",
    ];
    for (const k of required) {
      if (!mobileForm[k] || String(mobileForm[k]).trim() === "") {
        return `Please fill the ${k.replace("_", " ")} field.`;
      }
    }
    if (Number(mobileForm.ram) <= 0) return "RAM must be positive.";
    if (Number(mobileForm.storage) <= 0) return "Storage must be positive.";
    if (Number(mobileForm.age_years) < 0) return "Age must be 0 or greater.";
    if (Number(mobileForm.original_price) <= 0)
      return "Original price must be positive.";
    return null;
  };

  const validateLaptop = () => {
    const required = [
      "brand",
      "model",
      "cpu",
      "ram",
      "memory",
      "condition",
      "age_years",
      "original_price",
    ];
    for (const k of required) {
      if (!laptopForm[k] || String(laptopForm[k]).trim() === "") {
        return `Please fill the ${k.replace("_", " ")} field.`;
      }
    }
    if (Number(laptopForm.ram) <= 0) return "RAM must be positive.";
    if (Number(laptopForm.memory) <= 0) return "Storage must be positive.";
    if (Number(laptopForm.age_years) < 0) return "Age must be 0 or greater.";
    if (Number(laptopForm.original_price) <= 0)
      return "Original price must be positive.";
    return null;
  };

  // proxy call helper
  const callPredictProxy = async (body) => {
    const url = `${BACKEND_URL}/api/price/predict`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res;
  };

  // mobile prediction
  const handlePredictMobile = async () => {
    setPrice(null);
    setError("");
    const v = validateMobile();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        category: "electronics",
        type: "mobile",
        brand: mobileForm.brand,
        model: mobileForm.model,
        ram: Number(mobileForm.ram),
        storage: Number(mobileForm.storage),
        condition: mobileForm.condition,
        age_years: Number(mobileForm.age_years),
        original_price: Number(mobileForm.original_price),
      };

      const res = await callPredictProxy(payload);

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Server returned ${res.status}`);
      }

      const data = await res.json();
      const predicted =
        data?.predictedPrice ?? data?.predicted_price ?? data?.price ?? null;

      if (predicted !== null && predicted !== undefined) {
        setPrice(Math.round(Number(predicted)));
      } else {
        setError(data?.error || "Unexpected response from mobile predictor.");
      }
    } catch (err) {
      console.error("Mobile prediction error:", err);
      setError(err.message || "Failed to connect to mobile predictor.");
    } finally {
      setLoading(false);
    }
  };

  // laptop prediction
  const handlePredictLaptop = async () => {
    setPrice(null);
    setError("");
    const v = validateLaptop();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        category: "electronics",
        type: "laptop",
        brand: laptopForm.brand.toLowerCase(),
        model: laptopForm.model.toLowerCase(),
        cpu: laptopForm.cpu,
        ram: Number(laptopForm.ram),
        memory: Number(laptopForm.memory),
        gpu: laptopForm.gpu || laptopForm.cpu,
        original_price: Number(laptopForm.original_price),
        age_years: Number(laptopForm.age_years),
        condition: laptopForm.condition,
      };

      const res = await callPredictProxy(payload);

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Server returned ${res.status}`);
      }

      const data = await res.json();
      const predicted =
        data?.predictedPrice ?? data?.predicted_price ?? data?.price ?? data?.pred ?? null;

      if (predicted !== null && predicted !== undefined) {
        setPrice(Math.round(Number(predicted)));
      } else {
        setError(data?.error || "Unexpected response from laptop predictor.");
      }
    } catch (err) {
      console.error("Laptop prediction error:", err);
      setError(err.message || "Failed to connect to laptop predictor.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMobileForm({ ...mobileDefault });
    setLaptopForm({ ...laptopDefault });
    setPrice(null);
    setError("");
  };

  // placeholders
  const mobileModelPlaceholder =
    mobileForm.brand && MOBILE_BRAND_HINTS[mobileForm.brand]
      ? MOBILE_BRAND_HINTS[mobileForm.brand]
      : "Type model name manually (e.g. iPhone 14)";

  const laptopModelPlaceholder =
    laptopForm.brand && LAPTOP_BRAND_HINTS[laptopForm.brand]
      ? LAPTOP_BRAND_HINTS[laptopForm.brand]
      : "Type model name (e.g. MacBook Air M1)";

  const laptopCpuPlaceholder =
    laptopForm.brand === "Apple" ? "M1 / M2 / M2 Pro" : "e.g. Intel i5-1135G7";

  const laptopGpuPlaceholder =
    laptopForm.brand === "Apple" ? "Integrated (M1/M2)" : "e.g. Integrated / RTX 3050";

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-6 sm:p-8 font-sans">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-emerald-700">Resale Price Predictor</h2>
          <p className="mt-1 text-sm text-gray-600">Estimate a fair resale value for your product.</p>
        </div>

        {/* Dropdown selector for item type */}
        <div className="mb-4 flex items-center justify-center">
          <label htmlFor="itemType" className="sr-only">Select item type</label>
          <select
            id="itemType"
            value={type}
            onChange={(e) => { setType(e.target.value); setPrice(null); setError(""); }}
            className="w-56 px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
          >
            <option value="mobile">Mobile</option>
            <option value="laptop">Laptop</option>
            <option value="other">Other (coming soon)</option>
          </select>
        </div>

        {/* MOBILE FORM */}
        {type === "mobile" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <select
                  id="brand"
                  name="brand"
                  value={mobileForm.brand}
                  onChange={handleMobileChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="">Select Brand</option>
                  {MOBILE_BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                <input
                  id="model"
                  name="model"
                  value={mobileForm.model}
                  onChange={handleMobileChange}
                  placeholder={mobileModelPlaceholder}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
                {mobileForm.brand && (
                  <p className="mt-1 text-xs text-gray-500">Hint: {MOBILE_BRAND_HINTS[mobileForm.brand]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="ram" className="block text-sm font-medium text-gray-700 mb-2">RAM (GB)</label>
                <input
                  id="ram"
                  name="ram"
                  type="number"
                  min="1"
                  value={mobileForm.ram}
                  onChange={handleMobileChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="e.g. 8"
                />
              </div>

              <div>
                <label htmlFor="storage" className="block text-sm font-medium text-gray-700 mb-2">Storage (GB)</label>
                <input
                  id="storage"
                  name="storage"
                  type="number"
                  min="1"
                  value={mobileForm.storage}
                  onChange={handleMobileChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="e.g. 128"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
              <select
                id="condition"
                name="condition"
                value={mobileForm.condition}
                onChange={handleMobileChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="">Select Condition</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="age_years" className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
                <input
                  id="age_years"
                  name="age_years"
                  type="number"
                  min="0"
                  step="0.1"
                  value={mobileForm.age_years}
                  onChange={handleMobileChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="e.g. 1.5"
                />
              </div>

              <div>
                <label htmlFor="original_price" className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                <input
                  id="original_price"
                  name="original_price"
                  type="number"
                  min="1"
                  value={mobileForm.original_price}
                  onChange={handleMobileChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="e.g. 45000"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handlePredictMobile}
                disabled={loading}
                className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg text-white font-semibold transition ${loading ? "bg-emerald-300 cursor-not-allowed" : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"}`}
              >
                {loading ? "Predicting…" : "Predict Resale Price (Mobile)"}
              </button>

              <button
                onClick={handleReset}
                type="button"
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
              >
                Reset
              </button>
            </div>
          </>
        )}

        {/* LAPTOP FORM */}
        {type === "laptop" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lbrand" className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <select
                  id="lbrand"
                  name="brand"
                  value={laptopForm.brand}
                  onChange={handleLaptopChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="">Select Brand</option>
                  {LAPTOP_BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                {laptopForm.brand && (
                  <p className="mt-1 text-xs text-gray-500">Hint: {LAPTOP_BRAND_HINTS[laptopForm.brand]}</p>
                )}
              </div>

              <div>
                <label htmlFor="lmodel" className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                <input
                  id="lmodel"
                  name="model"
                  value={laptopForm.model}
                  onChange={handleLaptopChange}
                  placeholder={laptopModelPlaceholder}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="cpu" className="block text-sm font-medium text-gray-700 mb-2">CPU</label>
                <input id="cpu" name="cpu" value={laptopForm.cpu} onChange={handleLaptopChange} placeholder={laptopCpuPlaceholder} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200" />
                {laptopForm.brand && (
                  <p className="mt-1 text-xs text-gray-500">Hint: {laptopForm.brand === "Apple" ? "Apple Silicon (M1 / M2 / M2 Pro)" : "e.g. Intel i5-1135G7, Ryzen 5 5600U"}</p>
                )}
              </div>
              <div>
                <label htmlFor="gpu" className="block text-sm font-medium text-gray-700 mb-2">GPU</label>
                <input id="gpu" name="gpu" value={laptopForm.gpu} onChange={handleLaptopChange} placeholder={laptopGpuPlaceholder} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200" />
                {laptopForm.brand && (
                  <p className="mt-1 text-xs text-gray-500">Hint: {laptopForm.brand === "Apple" ? "Integrated (M1/M2) — leave blank if unsure" : "e.g. Integrated / RTX 3050"}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="lram" className="block text-sm font-medium text-gray-700 mb-2">RAM (GB)</label>
                <input id="lram" name="ram" type="number" value={laptopForm.ram} onChange={handleLaptopChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200" placeholder="e.g. 8" />
              </div>

              <div>
                <label htmlFor="memory" className="block text-sm font-medium text-gray-700 mb-2">Storage (GB)</label>
                <input id="memory" name="memory" type="number" value={laptopForm.memory} onChange={handleLaptopChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200" placeholder="e.g. 512" />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="lcondition" className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
              <select id="lcondition" name="condition" value={laptopForm.condition} onChange={handleLaptopChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200">
                <option value="">Select Condition</option>
                <option value="Very Good">Very Good</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="lage" className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
                <input id="lage" name="age_years" type="number" min="0" step="0.1" value={laptopForm.age_years} onChange={handleLaptopChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200" placeholder="e.g. 3" />
              </div>

              <div>
                <label htmlFor="loriginal_price" className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                <input id="loriginal_price" name="original_price" type="number" min="1" value={laptopForm.original_price} onChange={handleLaptopChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200" placeholder="e.g. 75000" />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handlePredictLaptop}
                disabled={loading}
                className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg text-white font-semibold transition ${loading ? "bg-emerald-300 cursor-not-allowed" : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"}`}
              >
                {loading ? "Predicting…" : "Predict Resale Price (Laptop)"}
              </button>

              <button onClick={handleReset} type="button" className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200">
                Reset
              </button>
            </div>
          </>
        )}

        {/* OTHER (placeholder for future types) */}
        {type === "other" && (
          <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">Other item type</h3>
            <p className="text-sm text-gray-600 mt-2">
              Support for this item type is not yet available. You can still manually list the product.
              We'll add prediction support here later — choose "Mobile" or "Laptop" to use the predictors now.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button onClick={() => { setType("mobile"); setError(""); setPrice(null); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Switch to Mobile</button>
              <button onClick={() => { setType("laptop"); setError(""); setPrice(null); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Switch to Laptop</button>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mt-6">
          {price !== null && (
            <div className="mx-auto w-full rounded-lg bg-emerald-50 border border-emerald-100 py-4 px-5 text-center">
              <div className="text-sm text-emerald-700">Predicted Price</div>
              <div className="mt-1 text-2xl font-bold text-emerald-800">₹{price.toLocaleString()}</div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-100 text-red-700 p-3">
              {error}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
