import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, Briefcase, UserCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'CANDIDATE' | 'RECRUITER'>('CANDIDATE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({ email, password, role, firstName, lastName });
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('Registration error detail:', err);
      if (axios.isAxiosError(err) && err.response?.data) {
        if (typeof err.response.data === 'object') {
          const messages = Object.values(err.response.data).join(', ');
          setError(messages || 'Validation protocols failed.');
        } else {
          setError(err.response.data as string);
        }
      } else {
        setError('System registration failure. Check uplink.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex relative overflow-hidden">
      {/* Dynamic Grid Background for the whole page */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none -z-10" />

      {/* Left Side: Visual/Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-2/5 relative bg-gray-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Business" 
            className="w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-primary/20 backdrop-blur-md border border-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-10 shadow-2xl">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter leading-[0.9] mb-8">
              Join the <br />
              <span className="text-primary italic">elite</span> <br />
              talent network.
            </h1>
            <p className="text-lg text-gray-400 font-medium leading-relaxed">
              Start your professional transformation on HireSphere. 
              The premium layer for modern careers and hiring.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-12">
          <p className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">
            EST. 2026 // SYSTEM V1.0
          </p>
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className="w-full lg:w-3/5 flex flex-col justify-center items-center p-8 overflow-y-auto">
        <div className="w-full max-w-2xl py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center lg:text-left mb-10"
          >
            <div className="lg:hidden inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Join the Elite</span>
            </div>
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">
              Create <span className="text-primary italic">Identity</span>.
            </h2>
            <p className="text-gray-500 font-medium">
              Initialize your professional account in our secure ecosystem.
            </p>
          </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-xl py-10 px-6 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] sm:rounded-[40px] sm:px-12 border border-gray-100"
        >
          <form className="space-y-8" onSubmit={handleSubmit}>
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

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 block">
                Deployment Mode
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('CANDIDATE')}
                  className={`group flex flex-col items-center justify-center p-6 border-2 rounded-3xl transition-all ${
                    role === 'CANDIDATE'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-50 bg-gray-50/30 hover:border-gray-100 text-gray-400'
                  }`}
                >
                  <UserCircle className={`h-8 w-8 mb-3 transition-transform ${role === 'CANDIDATE' ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="text-xs font-black uppercase tracking-widest">Candidate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('RECRUITER')}
                  className={`group flex flex-col items-center justify-center p-6 border-2 rounded-3xl transition-all ${
                    role === 'RECRUITER'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-50 bg-gray-50/30 hover:border-gray-100 text-gray-400'
                  }`}
                >
                  <Briefcase className={`h-8 w-8 mb-3 transition-transform ${role === 'RECRUITER' ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="text-xs font-black uppercase tracking-widest">Recruiter</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                  First Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary">
                    <UserCircle className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-14 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[24px] focus:outline-none focus:bg-white focus:border-primary/10 focus:ring-4 focus:ring-primary/5 transition-all text-gray-900 font-bold"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                  Last Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary">
                    <UserCircle className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-14 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[24px] focus:outline-none focus:bg-white focus:border-primary/10 focus:ring-4 focus:ring-primary/5 transition-all text-gray-900 font-bold"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                  Authentication Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-14 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[24px] focus:outline-none focus:bg-white focus:border-primary/10 focus:ring-4 focus:ring-primary/5 transition-all text-gray-900 font-bold"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                  Secure Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-14 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[24px] focus:outline-none focus:bg-white focus:border-primary/10 focus:ring-4 focus:ring-primary/5 transition-all text-gray-900 font-bold"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
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
                  Register Identity <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>

            <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mt-6">
              By initializing, you accept our <span className="text-primary cursor-pointer hover:underline">Core Protocol</span> & <span className="text-primary cursor-pointer hover:underline">Data Encryption policy</span>.
            </p>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-50 text-center">
            <p className="text-sm font-bold text-gray-500">
              Already registered in the system?{' '}
              <Link to="/login" className="text-primary font-black uppercase tracking-wider hover:underline ml-1">
                Access Portal
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

export default Register;
