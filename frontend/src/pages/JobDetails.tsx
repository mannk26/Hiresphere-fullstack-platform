import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService } from '../services/job.service';
import { applicationService } from '../services/application.service';
import { type Job } from '../types';
import { useAuth } from '../hooks/useAuth';
import { MapPin, Briefcase, DollarSign, ChevronLeft, Send, CheckCircle2, Loader2, Building2, Sparkles, ShieldCheck, Calendar, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      if (id) {
        try {
          const data = await jobService.getJobById(Number(id));
          setJob(data);
          
          if (user?.role === 'CANDIDATE') {
            const apps = await applicationService.getMyApplications(user.id);
            if (apps.some(app => app.job.id === Number(id))) {
              setApplied(true);
            }
          }
        } catch (error) {
          console.error('Failed to fetch job details', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchJob();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setApplying(true);
    try {
      await applicationService.applyToJob(Number(id));
      setApplied(true);
    } catch (error) {
      console.error('Failed to apply', error);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Accessing Opportunity Data...</p>
    </div>
  );
  
  if (!job) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-[40px] shadow-2xl border border-gray-100 text-center max-w-md"
      >
        <div className="bg-red-50 h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-8">
           <ShieldCheck className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Entry Expired</h2>
        <p className="text-gray-500 font-medium mb-10 leading-relaxed">The requested job listing has been deprecated or removed from our active directory.</p>
        <button 
          onClick={() => navigate('/jobs')} 
          className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-gray-900/10 hover:bg-primary transition-all active:scale-95"
        >
          Return to Hub
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-mesh py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 -z-10" />
      <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-primary/5 blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[60%] h-[60%] bg-blue-500/5 blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-5xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-12 hover:text-primary transition-colors group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </motion.button>

        <div className="space-y-12">
          {/* Header Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[48px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden"
          >
            <div className="p-10 md:p-16 border-b border-gray-50">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 shrink-0 shadow-sm"
                  >
                    <Building2 className="h-12 w-12 text-primary" />
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">High Priority Role</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-4 leading-none">{job.title}</h1>
                    <div className="flex items-center gap-3 group cursor-pointer">
                       <p className="text-2xl text-gray-500 font-bold group-hover:text-primary transition-colors">{job.companyName}</p>
                       <ArrowUpRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-all" />
                    </div>
                  </div>
                </div>
                
                <div className="w-full lg:w-auto">
                  {user?.role === 'CANDIDATE' || !user ? (
                    <button
                      onClick={handleApply}
                      disabled={applied || applying}
                      className={`group w-full lg:w-auto flex items-center justify-center gap-4 px-12 py-6 rounded-[28px] font-black text-xl transition-all shadow-2xl active:scale-95 ${
                        applied
                          ? 'bg-emerald-500 text-white cursor-default shadow-emerald-500/20'
                          : 'bg-gray-900 text-white hover:bg-primary shadow-gray-900/10 hover:shadow-primary/20'
                      }`}
                    >
                      {applying ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : applied ? (
                        <>
                          <CheckCircle2 className="h-6 w-6" />
                          Application Sent
                        </>
                      ) : (
                        <>
                          <Send className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          Initialize Application
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="bg-amber-50 text-amber-600 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border border-amber-100 flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5" />
                      Recruiter Mode Active
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-10 border-t border-gray-50">
                {[
                  { icon: MapPin, label: "Location", val: job.location },
                  { icon: Briefcase, label: "Job Type", val: job.jobType },
                  { icon: Calendar, label: "Experience", val: job.experienceLevel },
                  { icon: DollarSign, label: "Remuneration", val: job.salaryRange || 'Competitive' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                       <item.icon className="h-4 w-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                    </div>
                    <span className="text-lg font-black text-gray-900 tracking-tight">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-10 md:p-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
               <div className="lg:col-span-2 space-y-10">
                  <section>
                    <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight flex items-center gap-4">
                       Description
                       <div className="h-px flex-1 bg-gray-50" />
                    </h2>
                    <div className="text-gray-500 leading-relaxed whitespace-pre-line text-lg font-medium">
                      {job.description}
                    </div>
                  </section>
               </div>

               <div className="space-y-8">
                  <div className="bg-gray-50/50 p-10 rounded-[40px] border border-gray-100">
                    <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">Security Protocol</h3>
                    <ul className="space-y-6">
                      {[
                        "Zero-fee hiring policy enforced.",
                        "Direct communication with verified recruiters only.",
                        "End-to-end data encryption for your identity."
                      ].map((tip, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <div className="h-6 w-6 rounded-lg bg-white flex items-center justify-center border border-gray-100 shrink-0">
                             <ShieldCheck className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm text-gray-500 font-bold leading-tight">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-primary/5 p-10 rounded-[40px] border border-primary/10 group cursor-pointer hover:bg-primary/10 transition-colors">
                     <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">System Analytics</p>
                     <p className="text-sm text-gray-600 font-bold mb-6">This role matches 92% of your profile parameters.</p>
                     <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                        View Match Details <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>

          <div className="text-center pb-20">
             <p className="text-[10px] font-black tracking-[0.4em] text-gray-300 uppercase">
                Architecture by Mrityunjay • HireSphere v2.0
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;

