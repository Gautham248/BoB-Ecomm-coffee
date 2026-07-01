import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Coffee, ArrowRight, Shield } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(token)) {
      navigate('/admin');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 admin-grain">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 mb-5">
            <Coffee className="w-8 h-8 text-gray-900" />
          </div>
          <h1 className="text-2xl font-pangaia font-semibold text-gray-900 tracking-wide mb-1">
            Beans of Bodhi
          </h1>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-[11px] text-gray-500 uppercase tracking-widest">Authentication</span>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm animate-fade-in-up">
              <span className="text-xs">!</span>
              {error}
            </div>
          )}

          <div>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter admin token"
              autoFocus
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm outline-none transition-all duration-300 admin-copper-ring"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold text-sm tracking-wide group"
          >
            Sign In
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </form>

        <p className="text-center text-[10px] text-gray-500 mt-6">
          Roastery Workshop · v3
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
