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
    <div className="min-h-screen bg-roast-base flex items-center justify-center px-4 admin-grain">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-copper-surface border border-copper/20 mb-5">
            <Coffee className="w-8 h-8 text-copper" />
          </div>
          <h1 className="text-2xl font-pangaia font-semibold text-roast-cream tracking-wide mb-1">
            Beans of Bodhi
          </h1>
          <p className="text-sm text-roast-muted">Admin Panel</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-roast-surface border border-roast-border rounded-2xl p-6 space-y-5 shadow-2xl shadow-black/40"
        >
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-3.5 h-3.5 text-copper" />
            <span className="text-[11px] text-roast-muted uppercase tracking-widest">Authentication</span>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rust-muted/15 border border-rust-DEFAULT/20 text-rust-DEFAULT text-sm animate-fade-in-up">
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
              className="w-full px-4 py-3 bg-roast-card border border-roast-border rounded-xl text-roast-cream placeholder-roast-muted text-sm outline-none transition-all duration-300 admin-copper-ring"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-copper text-roast-base rounded-xl hover:bg-copper-light transition-all duration-200 font-semibold text-sm tracking-wide group"
          >
            Sign In
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </form>

        <p className="text-center text-[10px] text-roast-muted mt-6">
          Roastery Workshop · v3
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
