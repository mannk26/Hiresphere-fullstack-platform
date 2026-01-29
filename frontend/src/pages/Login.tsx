import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Invalid credentials. Please verify your access tokens.');
      } else {
        setError('A system synchronization error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex relative overflow-hidden">
      {/* Left Side: Visual/Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Office" 
            className="w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-primary/20 backdrop-blur-md border border-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-10 shadow-2xl">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter leading-[0.9] mb-8">
              The premium <br />
              <span className="text-primary italic">intelligence</span> <br />
              layer for careers.
            </h1>
            <p className="text-xl text-gray-400 font-medium leading-relaxed">
              Join the elite ecosystem where talent meets vision. 
              Secure, transparent, and designed for results.
            </p>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-12 left-12">
          <p className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">
            EST. 2026 // SYSTEM V1.0
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-dot-pattern">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center lg:text-left mb-10"
          >
            <div className="lg:hidden inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Secure Access</span>
            </div>
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">
              Welcome <span className="text-primary italic">Back</span>.
            </h2>
            <p className="text-gray-500 font-medium">
              Enter your credentials to access your dashboard.
            </p>
          </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-xl py-10 px-6 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] sm:rounded-[40px] sm:px-12 border border-gray-100"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3"
              >
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-xs font-black text-red-600 uppercase tracking-wider">{error}</p>
              </motion.div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                Identifier (Email)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-14 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[24px] leading-5 bg-white placeholder-gray-400 focus:outline-none focus:bg-white focus:border-primary/10 focus:ring-4 focus:ring-primary/5 transition-all text-gray-900 font-bold"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                Security Key
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-14 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[24px] leading-5 bg-white placeholder-gray-400 focus:outline-none focus:bg-white focus:border-primary/10 focus:ring-4 focus:ring-primary/5 transition-all text-gray-900 font-bold"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 text-primary focus:ring-primary/20 border-gray-200 rounded-lg transition-all cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-3 block text-xs font-bold text-gray-600 cursor-pointer">
                  Maintain Session
                </label>
              </div>

              <div className="text-xs">
                <a href="#" className="font-black text-primary hover:underline uppercase tracking-wider">
                  Reset Key
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-5 px-4 border border-transparent rounded-[24px] text-lg font-black text-white bg-gray-900 hover:bg-primary transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-gray-900/10"
            >
              {loading ? (
                <Loader2 className="animate-spin h-6 w-6" />
              ) : (
                <span className="flex items-center gap-2">
                  Initialize Access <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-50 text-center">
            <p className="text-sm font-bold text-gray-500">
              New to the ecosystem?{' '}
              <Link to="/register" className="text-primary font-black uppercase tracking-wider hover:underline ml-1">
                Establish Identity
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]"
        >
          Secure Infrastructure by Mrityunjay
        </motion.p>
      </div>
    </div>
  );
};

export default Login;
