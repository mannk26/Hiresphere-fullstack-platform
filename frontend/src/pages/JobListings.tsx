import React, { useState, useEffect, useCallback } from 'react';
import { jobService } from '../services/job.service';
import type { Job } from '../types';
import { Search, MapPin, Briefcase, DollarSign, Clock, ChevronRight, Loader2, Sparkles, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const JobListings: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await jobService.getAllJobs(page, 10, searchTerm);
      setJobs(data.content);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-dot-pattern">
      {/* Dynamic background accents */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/10 blur-[140px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-500/10 blur-[140px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Verified Opportunities</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-6 leading-[0.85]"
          >
            Design your <br /><span className="italic text-primary">ideal career</span>.
          </motion.h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl lg:mx-0 mx-auto leading-relaxed">
            Browse through thousands of verified opportunities from high-growth startups and global tech giants.
          </p>
        </header>

        {/* Search and Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-2xl p-4 rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-white/50 mb-16 flex flex-col md:flex-row gap-4 group"
        >
          <form onSubmit={handleSearch} className="flex-1 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Job title, skills, or company..."
                className="w-full pl-16 pr-8 py-6 bg-gray-50/50 border-2 border-transparent rounded-[28px] focus:bg-white focus:border-primary/10 focus:ring-8 focus:ring-primary/5 transition-all text-gray-900 font-bold placeholder:text-gray-400 text-lg shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-gray-900 text-white px-12 py-6 rounded-[28px] font-black text-xl hover:bg-primary transition-all active:scale-95 shadow-2xl shadow-gray-900/20 flex items-center justify-center gap-3"
            >
              Search <ArrowUpRight className="h-6 w-6" />
            </button>
          </form>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Filters Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-8">
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Filters</h3>
                  <SlidersHorizontal className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="space-y-8">
                  <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-4">Job Type</label>
                    <div className="space-y-3">
                      {['Full-time', 'Part-time', 'Contract', 'Remote'].map((type) => (
                        <label key={type} className="flex items-center group cursor-pointer">
                          <input type="checkbox" className="h-5 w-5 rounded-lg border-2 border-gray-200 text-primary focus:ring-primary/20 transition-all cursor-pointer" />
                          <span className="ml-3 text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-8 border-t border-gray-50">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-4">Experience</label>
                    <div className="space-y-3">
                      {['Entry Level', 'Mid Level', 'Senior Level'].map((level) => (
                        <label key={level} className="flex items-center group cursor-pointer">
                          <input type="checkbox" className="h-5 w-5 rounded-lg border-2 border-gray-200 text-primary focus:ring-primary/20 transition-all cursor-pointer" />
                          <span className="ml-3 text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <button className="w-full mt-10 py-4 bg-gray-50 text-gray-400 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-primary/5 hover:text-primary transition-all">
                  Clear All Filters
                </button>
              </div>
              
              <div className="p-8 rounded-[32px] bg-primary/5 border border-primary/10">
                 <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">HireSphere Premium</p>
                 <p className="text-sm text-gray-600 font-medium mb-4">Get noticed by top recruiters 3x faster with our AI matching.</p>
                 <button className="text-xs font-black text-gray-900 underline">Learn more</button>
              </div>
            </div>
          </motion.aside>

          {/* Job List */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-gray-50/30 rounded-[40px] border border-dashed border-gray-100">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-6" />
                <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Synchronizing opportunities...</p>
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                  {jobs.map((job, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.98, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ delay: idx * 0.05 }}
                      key={job.id}
                      className="group relative bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] hover:border-primary/30 transition-all duration-700 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="flex items-start gap-8">
                          <div className="bg-gray-50 h-20 w-20 rounded-[28px] flex items-center justify-center shrink-0 group-hover:bg-primary transition-all duration-700 shadow-inner group-hover:rotate-6 group-hover:scale-110">
                            <Briefcase className="h-10 w-10 text-gray-400 group-hover:text-white transition-all duration-700" />
                          </div>
                          <div>
                            <div className="flex items-center gap-4 mb-2">
                              <h3 className="text-3xl font-black text-gray-900 tracking-tighter group-hover:text-primary transition-colors duration-500">{job.title}</h3>
                              {idx < 2 && (
                                <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-primary/20 animate-pulse">Featured</span>
                              )}
                            </div>
                            <p className="text-xl text-gray-500 font-bold mb-8 tracking-tight">{job.companyName}</p>
                            
                            <div className="flex flex-wrap gap-4">
                              <span className="flex items-center gap-3 bg-gray-50/80 px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-600 border border-gray-100 group-hover:border-primary/10 transition-colors">
                                <MapPin className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-3 bg-gray-50/80 px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-600 border border-gray-100 group-hover:border-primary/10 transition-colors">
                                <Clock className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                                {job.jobType}
                              </span>
                              <span className="flex items-center gap-3 bg-gray-50/80 px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-600 border border-gray-100 group-hover:border-primary/10 transition-colors">
                                <DollarSign className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                                {job.salaryRange || 'Competitive'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-6 border-t md:border-t-0 pt-8 md:pt-0 border-gray-50">
                          <div className="text-right">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-1">Posted on</p>
                            <p className="text-base font-bold text-gray-500">
                              {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <Link
                            to={`/jobs/${job.id}`}
                            className="inline-flex items-center justify-center h-16 w-16 bg-gray-900 text-white rounded-[24px] group-hover:bg-primary transition-all duration-700 shadow-2xl shadow-gray-900/20 hover:scale-110 active:scale-95 group-hover:shadow-primary/30"
                          >
                            <ArrowUpRight className="h-8 w-8" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="bg-gray-50/50 p-20 rounded-[40px] border-2 border-dashed border-gray-200 text-center">
                <div className="bg-white h-20 w-20 rounded-[28px] shadow-sm flex items-center justify-center mx-auto mb-8">
                  <Briefcase className="h-10 w-10 text-gray-200" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Zero matches found</h3>
                <p className="text-gray-500 font-medium max-w-xs mx-auto mb-10">We couldn't find any jobs matching your current search criteria.</p>
                <button 
                  onClick={() => {setSearchTerm(''); setPage(0);}}
                  className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-900 font-black rounded-2xl hover:border-primary/20 hover:bg-gray-50 transition-all shadow-sm"
                >
                  Reset all search filters
                </button>
              </div>
            )}

            {/* Pagination Placeholder */}
            {jobs.length > 0 && (
              <div className="pt-12 flex justify-center">
                 <button className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-900 font-black rounded-2xl hover:border-primary/20 hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2">
                   Load more opportunities <ChevronRight className="h-4 w-4" />
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Developer Credit */}
      <div className="py-20 text-center">
        <p className="text-[10px] font-black tracking-[0.3em] text-gray-300 uppercase">
          Elite Infrastructure by Mrityunjay
        </p>
      </div>
    </div>
  );
};

export default JobListings;
