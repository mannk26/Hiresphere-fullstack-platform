import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../services/job.service';
import { Briefcase, MapPin, DollarSign, Type, FileText, Send, Loader2, ChevronLeft, Sparkles, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const PostJob: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyName: '',
    location: '',
    salaryRange: '',
    jobType: 'Full-time',
    experienceLevel: 'Entry Level'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await jobService.createJob(formData);
      navigate('/jobs');
    } catch (error) {
      console.error('Failed to post job', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] -z-10" />

      <div className="max-w-4xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-12 hover:text-primary transition-colors group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Abort Listing
        </motion.button>

        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.3em] mb-4"
          >
            <Sparkles className="h-4 w-4" />
            Recruitment Terminal
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-4"
          >
            Deploy <span className="italic text-primary">Opportunity</span>.
          </motion.h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl">
            Broadcast your role to our elite talent pool and find your next game-changer.
          </p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[48px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden"
        >
          <div className="p-10 md:p-16 border-b border-gray-50 bg-gray-50/30 flex items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-gray-900 flex items-center justify-center text-white shadow-xl">
               <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <div>
               <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Listing Configuration</h3>
               <p className="text-sm text-gray-500 font-bold">Fill in the required parameters for the new entry.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 md:p-16 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Job Designation</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                    <Type className="h-5 w-5 text-gray-400 group-focus-within:text-primary" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-16 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[24px] focus:outline-none focus:bg-white focus:border-primary/10 focus:ring-4 focus:ring-primary/5 transition-all text-gray-900 font-bold"
                    placeholder="e.g. Senior Backend Architect"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Organization Identity</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                    <Building2 className="h-5 w-5 text-gray-400 group-focus-within:text-primary" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-16 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[24px] focus:outline-none focus:bg-white focus:border-primary/10 focus:ring-4 focus:ring-primary/5 transition-all text-gray-900 font-bold"
                    placeholder="e.g. HireSphere Labs"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Geographical Focus</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                    <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-primary" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-16 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[24px] focus:outline-none focus:bg-white focus:border-primary/10 focus:ring-4 focus:ring-primary/5 transition-all text-gray-900 font-bold"
                    placeholder="e.g. San Francisco, CA or Remote"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Compensation Range</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                    <DollarSign className="h-5 w-5 text-gray-400 group-focus-within:text-primary" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-16 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[24px] focus:outline-none focus:bg-white focus:border-primary/10 focus:ring-4 focus:ring-primary/5 transition-all text-gray-900 font-bold"
                    placeholder="e.g. $140k - $180k"
                    value={formData.salaryRange}
                    onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Contract Type</label>
                  <select
                    className="block w-full px-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[24px] focus:outline-none focus:bg-white focus:border-primary/10 focus:ring-4 focus:ring-primary/5 transition-all text-gray-900 font-bold appearance-none cursor-pointer"
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Remote</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Seniority</label>
                  <select
                    className="block w-full px-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[24px] focus:outline-none focus:bg-white focus:border-primary/10 focus:ring-4 focus:ring-primary/5 transition-all text-gray-900 font-bold appearance-none cursor-pointer"
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  >
                    <option>Entry Level</option>
                    <option>Mid Level</option>
                    <option>Senior Level</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Operational Scope (Description)</label>
              <div className="relative group">
                <div className="absolute top-6 left-6 pointer-events-none group-focus-within:text-primary transition-colors">
                  <FileText className="h-5 w-5 text-gray-400 group-focus-within:text-primary" />
                </div>
                <textarea
                  required
                  rows={6}
                  className="block w-full pl-16 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[32px] focus:outline-none focus:bg-white focus:border-primary/10 focus:ring-4 focus:ring-primary/5 transition-all text-gray-900 font-bold leading-relaxed"
                  placeholder="Outline the mission, requirements, and benefits..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-10">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center gap-4 py-6 px-10 rounded-[32px] text-2xl font-black text-white bg-gray-900 hover:bg-primary transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-gray-900/20 hover:shadow-primary/30"
              >
                {loading ? <Loader2 className="animate-spin h-8 w-8" /> : (
                  <>
                    <Send className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Deploy Listing
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        <footer className="py-20 text-center">
          <p className="text-[10px] font-black tracking-[0.4em] text-gray-300 uppercase">
             Infrastructure by Mrityunjay • HireSphere Network
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PostJob;

