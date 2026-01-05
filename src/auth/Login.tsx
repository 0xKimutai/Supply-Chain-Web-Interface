import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, Wallet } from 'lucide-react';
import { ethers, type Eip1193Provider } from 'ethers';

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
    company: string;
    walletAddress: string;
  };
}

const Login: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user just registered
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
      setJustRegistered(true);
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleWalletLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install it to continue.');
      }

      // 1. Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // 2. Request a challenge/nonce from the backend (optional but recommended for production)
      // For this implementation, we'll assume the backend verifies the signed message
      const message = `Login to Supply Chain Tracker: ${new Date().toISOString()}`;
      const signature = await signer.signMessage(message);

      // 3. Send address and signature to backend
      const response = await fetch('/api/v1/auth/wallet-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          signature,
          message
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const result: LoginResponse = await response.json();
      
      // Store authentication token
      sessionStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      console.log('Login successful:', result);
      
      // Redirect based on user role
      const dashboardUrl = getDashboardUrl(result.user.role);
      window.location.href = dashboardUrl;
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDashboardUrl = (role: string): string => {
    switch (role?.toUpperCase()) {
      case 'MANUFACTURER':
        return '/dashboard/manufacturer';
      case 'DISTRIBUTOR':
        return '/dashboard/distributor';
      case 'RETAILER':
        return '/dashboard/retailer';
      case 'CUSTOMER':
        return '/dashboard/customer';
      case 'ADMIN':
        return '/dashboard/admin';
      default:
        return '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <Users className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Supply Chain Tracker</h1>
          </div>
          <p className="text-lg text-gray-600">
            Secure Web3 Authentication
          </p>
        </div>

        {/* Registration Success Message */}
        {justRegistered && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-green-800">
                  Registration Successful!
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Your account has been created. Please sign in with your wallet.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">Welcome Back</h2>
              <p className="text-sm text-gray-500">Connect your Ethereum wallet to access the tracker</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleWalletLogin}
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-4 px-4 rounded-xl hover:bg-indigo-700 transition-all duration-200 font-bold flex items-center justify-center space-x-3 shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <>
                  <Wallet className="w-6 h-6" />
                  <span>Connect Wallet</span>
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-white text-gray-400">Security Notice</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center leading-relaxed">
              We never store your private keys. All transactions and authentication are handled securely through your browser wallet.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500 mb-4">
              New to the system?
            </p>
            <a
              href="/register"
              className="inline-block w-full py-3 px-4 rounded-lg border-2 border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors"
            >
              Register New Stakeholder
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>© 2026 Supply Chain Tracking System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;