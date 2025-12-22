import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Package, 
  Tag, 
  FileText, 
  Calendar, 
  MapPin,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productCode: '',
    name: '',
    description: '',
    category: '',
    batchNumber: '',
    weightGrams: '',
    manufacturedAt: new Date().toISOString().slice(0, 16),
    initialLocation: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch('/api/v1/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          weightGrams: formData.weightGrams ? parseInt(formData.weightGrams) : null
        })
      });

      if (response.ok) {
        // Success! Redirect to product list
        navigate('/dashboard/products');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to initiate product creation on blockchain');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Network error - ensure the server is running and local blockchain node is active');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard/products')}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Add New Product</h1>
            <p className="text-slate-500 mt-1">Initiate a new traceable item on the blockchain.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Code */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-indigo-500" />
                  Product Code / SKU
                </label>
                <input
                  required
                  name="productCode"
                  value={formData.productCode}
                  onChange={handleChange}
                  placeholder="e.g. SN-990-XL"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-medium placeholder:text-slate-300 transition-all"
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center">
                  <Package className="w-4 h-4 mr-2 text-indigo-500" />
                  Product Name
                </label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Industrial IoT Sensor"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-medium placeholder:text-slate-300 transition-all"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-medium transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Category</option>
                  <option value="ELECTRONICS">Electronics</option>
                  <option value="APPAREL">Apparel</option>
                  <option value="FOOD">Food & Beverage</option>
                  <option value="INDUSTRIAL">Industrial</option>
                  <option value="PHARMA">Pharmaceuticals</option>
                </select>
              </div>

              {/* Batch Number */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />
                  Batch / Lot Number
                </label>
                <input
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  placeholder="e.g. B-2025-01"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-medium placeholder:text-slate-300 transition-all"
                />
              </div>

              {/* Manufactured At */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                  Manufacturing Date
                </label>
                <input
                  type="datetime-local"
                  name="manufacturedAt"
                  value={formData.manufacturedAt}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-medium transition-all"
                />
              </div>

              {/* Initial Location */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                  Origin Location
                </label>
                <input
                  name="initialLocation"
                  value={formData.initialLocation}
                  onChange={handleChange}
                  placeholder="e.g. Frankfurt Facility"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-medium placeholder:text-slate-300 transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Detailed Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Technical specifications, materials, or special handling instructions..."
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-medium placeholder:text-slate-300 transition-all resize-none"
              ></textarea>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{loading ? 'Processing Transaction...' : 'Mint Product Asset'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Help/Info */}
        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100">
            <div className="flex items-center space-x-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-indigo-200" />
              <h3 className="font-bold text-xl">Governance</h3>
            </div>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Every product created is recorded as a non-fungible asset on the supply chain ledger. This ensures immutable proof of origin and ownership history.
            </p>
            <ul className="mt-6 space-y-4">
              {[
                'Tamper-proof history',
                'Transparent audit trails',
                'Global accessibility',
                'Smart contract validation'
              ].map(item => (
                <li key={item} className="flex items-center text-xs font-semibold">
                  <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full mr-3"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-3 mb-2 text-slate-800">
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold">Need help?</h3>
            </div>
            <p className="text-slate-500 text-sm">
              Contact your administrator for access permissions if "Mint" fails.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
