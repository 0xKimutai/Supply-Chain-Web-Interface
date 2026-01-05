import React, { useState } from 'react';
import { Users, Wallet } from 'lucide-react';
import { UserRole, type RegistrationData, roleConfigs } from './types';
import { ethers, type Eip1193Provider } from 'ethers';

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

const RegistrationRouter: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    setSelectedRole(null);
  };

  if (showForm && selectedRole) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RegistrationForm 
          role={selectedRole}
          config={roleConfigs[selectedRole]}
          onBack={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Users className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Supply Chain Tracker</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our blockchain-powered supply chain network. Choose your role to get started.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(roleConfigs).map(([role, config]) => {
            const IconComponent = config.icon;
            return (
              <div
                key={role}
                onClick={() => handleRoleSelect(role as UserRole)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 p-6"
              >
                <div className={`${config.color} rounded-lg p-3 w-fit mx-auto mb-4`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                  {config.title}
                </h3>
                
                <p className="text-gray-600 text-center mb-4 text-sm">
                  {config.description}
                </p>
                
                <ul className="space-y-2">
                  {config.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="text-xs text-gray-500 flex items-center">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className="w-full mt-6 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium">
                  Register as {role}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Registration Form Component
interface RegistrationFormProps {
  role: UserRole;
  config: typeof roleConfigs[UserRole];
  onBack: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ role, config, onBack }) => {
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: role,
    company: '',
    jobTitle: '',
    department: '',
    address: '',
    walletAddress: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: 'en_US'
  });

  const [errors, setErrors] = useState<Partial<RegistrationData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<RegistrationData> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.walletAddress.trim()) {
      newErrors.walletAddress = 'Wallet address is required';
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.walletAddress)) {
      newErrors.walletAddress = 'Valid Ethereum wallet address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof RegistrationData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const connectWallet = async () => {
    setIsConnectingWallet(true);
    setErrors(prev => ({ ...prev, walletAddress: undefined }));
    
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts.length > 0) {
        setFormData(prev => ({ ...prev, walletAddress: accounts[0] }));
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setErrors(prev => ({ 
        ...prev, 
        walletAddress: err instanceof Error ? err.message : 'Failed to connect wallet' 
      }));
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const result = await response.json();
      console.log('Registration successful:', result);
      
      // Redirect to login with success message
      window.location.href = '/login?registered=true';
      
    } catch (error) {
      console.error('Registration error:', error);
      alert(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const IconComponent = config.icon;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4 transition-colors font-medium"
        >
          <span className="mr-2">←</span> Back to role selection
        </button>
        
        <div className={`${config.color} rounded-2xl p-4 w-fit mx-auto mb-6 shadow-lg transform transition-transform hover:scale-110`}>
          <IconComponent className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          {config.title}
        </h2>
        
        <p className="text-lg text-gray-600 max-w-lg mx-auto">
          {config.description}
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 border-b pb-2 mb-6">Profile Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl transition-all focus:ring-2 focus:ring-indigo-500 outline-none ${
                    errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-2 font-medium">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl transition-all focus:ring-2 focus:ring-indigo-500 outline-none ${
                    errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-2 font-medium">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl transition-all focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 border-b pb-2 mb-6">Organizational Context</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl transition-all focus:ring-2 focus:ring-indigo-500 outline-none ${
                    errors.company ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Global Supply Co."
                />
                {errors.company && (
                  <p className="text-red-500 text-xs mt-2 font-medium">{errors.company}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl transition-all focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Operations Manager"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl transition-all focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Logistics"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl transition-all focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="123 Supply Chain Way, Tech City"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 border-b pb-2 mb-6 text-indigo-600">Web3 Identity</h3>
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Ethereum Wallet Address *
              </label>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleInputChange}
                  className={`flex-grow px-4 py-3 border rounded-xl transition-all focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm ${
                    errors.walletAddress ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="0x..."
                />
                <button
                  type="button"
                  onClick={connectWallet}
                  disabled={isConnectingWallet}
                  className="bg-indigo-50 text-indigo-700 px-6 py-3 rounded-xl font-bold border-2 border-indigo-200 hover:bg-indigo-100 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Wallet className="w-5 h-5" />
                  <span>{isConnectingWallet ? 'Connecting...' : 'Connect MetaMask'}</span>
                </button>
              </div>
              
              {errors.walletAddress && (
                <p className="text-red-500 text-xs mt-2 font-medium">{errors.walletAddress}</p>
              )}
              
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs text-blue-700 leading-relaxed">
                  This wallet will be your permanent identity in the supply chain. Ensure you have access to this wallet as it cannot be changed after registration.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-4 px-6 rounded-2xl hover:bg-indigo-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-indigo-500/20 active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Registration...
              </span>
            ) : (
              'Complete Registration'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationRouter;