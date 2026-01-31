import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { jobService } from '../services/job.service';
import { applicationService } from '../services/application.service';
import { candidateService } from '../services/candidate.service';
import { API_URL } from '../api/axios';
import type { Application, Job, ApplicationStatus, StatusHistory, CandidateProfile } from '../types';
import { Briefcase, Clock, CheckCircle2, ChevronRight, Loader2, ArrowUpRight, Mail, History, X, Sparkles, TrendingUp, AlertCircle, Users, Phone, Code, FileText, UserCircle, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [recruiterApps, setRecruiterApps] = useState<Application[]>([]);
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [selectedAppHistory, setSelectedAppHistory] = useState<StatusHistory[] | null>(null);
  const [selectedCandidateProfile, setSelectedCandidateProfile] = useState<CandidateProfile | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          if (user.role === 'CANDIDATE') {
            const data = await applicationService.getMyApplications(user.id);
            setApplications(data);
          } else {
            const [jobs, apps] = await Promise.all([
              jobService.getMyJobs(),
              applicationService.getRecruiterApplications()
            ]);
            setPostedJobs(jobs);
            setRecruiterApps(apps);
          }
        } catch (error) {
          console.error('Failed to fetch dashboard data', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);

  const handleStatusUpdate = async (appId: number, status: ApplicationStatus) => {
    try {
      const updatedApp = await applicationService.updateApplicationStatus(appId, status);
      setRecruiterApps(prev => prev.map(app => app.id === appId ? updatedApp : app));
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const fetchHistory = async (appId: number) => {
    setHistoryLoading(true);
    setShowHistoryModal(true);
    try {
      const history = await applicationService.getApplicationHistory(appId);
      setSelectedAppHistory(history);
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchCandidateProfile = async (appId: number) => {
    setProfileLoading(true);
    setShowProfileModal(true);
    try {
      const profile = await candidateService.getProfileByApplication(appId);
      setSelectedCandidateProfile(profile);
    } catch (error) {
      console.error('Failed to fetch candidate profile', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const stats = user?.role === 'CANDIDATE' ? [
    { label: 'Applications', value: applications.length, icon: <Briefcase className="h-6 w-6 text-blue-600" />, color: 'blue' },
    { label: 'Pending', value: applications.filter(a => a.status === 'APPLIED').length, icon: <Clock className="h-6 w-6 text-amber-600" />, color: 'amber' },
    { label: 'Shortlisted', value: applications.filter(a => a.status === 'SHORTLISTED').length, icon: <CheckCircle2 className="h-6 w-6 text-emerald-600" />, color: 'emerald' },
  ] : [
    { label: 'Jobs Posted', value: postedJobs.length, icon: <TrendingUp className="h-6 w-6 text-indigo-600" />, color: 'indigo' },
    { label: 'Applicants', value: recruiterApps.length, icon: <Users className="h-6 w-6 text-primary" />, color: 'primary' },
    { label: 'Shortlisted', value: recruiterApps.filter(a => a.status === 'SHORTLISTED').length, icon: <CheckCircle2 className="h-6 w-6 text-emerald-600" />, color: 'emerald' },
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-dot-pattern">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/10 blur-[140px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-500/10 blur-[140px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20 text-center lg:text-left">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Management Console Center</span>
            </motion.div>
            <h1 className="text-6xl md:text-[80px] font-black text-gray-900 tracking-tighter leading-[0.85]">
              {user?.role === 'CANDIDATE' ? 'Candidate' : 'Recruiter'} <span className="text-primary italic">Hub</span>.
            </h1>
            <p className="text-gray-500 mt-6 text-2xl font-medium">Welcome back, {user?.firstName || user?.email.split('@')[0]}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 lg:justify-end">
            {user?.role === 'RECRUITER' && (
              <Link
                to="/post-job"
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-gray-900 text-white font-black text-lg rounded-[24px] overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Post Job <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            )}
            <Link
              to="/profile"
              className="px-10 py-5 bg-white text-gray-900 font-black text-lg rounded-[24px] border-2 border-gray-100 hover:border-primary/20 hover:bg-gray-50 transition-all active:scale-95 shadow-sm w-full sm:w-auto text-center"
            >
              Account Settings
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
              key={idx}
              className="bg-white/80 backdrop-blur-2xl p-10 rounded-[48px] border border-white/50 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative flex items-start justify-between mb-12">
                <div className={`p-5 bg-gray-50 rounded-3xl group-hover:bg-primary group-hover:rotate-6 group-hover:scale-110 transition-all duration-700 shadow-inner`}>
                  {React.cloneElement(stat.icon as React.ReactElement<{ className?: string }>, { 
                    className: `h-8 w-8 text-gray-400 group-hover:text-white transition-colors duration-700` 
                  })}
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                  <p className="text-5xl font-black text-gray-900 tracking-tighter group-hover:text-primary transition-colors duration-700">{stat.value}</p>
                </div>
              </div>
              <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '70%' }}
                   transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                   className="h-full bg-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                 />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-white/90 backdrop-blur-3xl rounded-[48px] border border-white/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="p-10 md:p-14 border-b border-gray-50 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
            <div className="flex flex-col md:flex-row md:items-center gap-10">
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter">
                {user?.role === 'CANDIDATE' ? 'Activity Log' : 'Operation Center'}
              </h2>
              
              {user?.role === 'RECRUITER' && (
                <div className="flex bg-gray-50/50 p-1.5 rounded-[24px] border border-gray-100">
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className={`px-8 py-3.5 rounded-[18px] text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                      activeTab === 'jobs' ? 'bg-white text-primary shadow-xl shadow-gray-200' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Deployed Jobs
                  </button>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className={`px-8 py-3.5 rounded-[18px] text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                      activeTab === 'applications' ? 'bg-white text-primary shadow-xl shadow-gray-200' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Incoming Talent
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-6">
               <div className="h-10 w-px bg-gray-100 hidden xl:block" />
               <Link to="/jobs" className="group flex items-center gap-3 text-primary font-black text-xs uppercase tracking-[0.2em] hover:opacity-70 transition-all">
                 System Wide Search <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-40 flex flex-col items-center justify-center">
                <div className="relative">
                  <Loader2 className="h-20 w-20 text-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-10 w-10 bg-white rounded-full" />
                  </div>
                </div>
                <p className="mt-8 text-gray-400 font-black text-[10px] uppercase tracking-[0.4em]">Initializing Data Core...</p>
              </div>
            ) : user?.role === 'CANDIDATE' ? (
              applications.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/30 text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
                      <th className="px-14 py-8">Opportunity Index</th>
                      <th className="px-14 py-8">Entity</th>
                      <th className="px-14 py-8">Status Pulse</th>
                      <th className="px-14 py-8 text-right">Protocol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {applications.map((app, idx) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={app.id} 
                        className="hover:bg-gray-50/50 transition-all duration-500 group"
                      >
                        <td className="px-14 py-10">
                          <p className="font-black text-gray-900 text-xl tracking-tight group-hover:text-primary transition-colors duration-500">{app.job.title}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: #{app.id.toString().padStart(5, '0')}</p>
                        </td>
                        <td className="px-14 py-10">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-white transition-colors">
                              <Building className="h-5 w-5 text-gray-400" />
                            </div>
                            <span className="text-lg text-gray-600 font-bold tracking-tight">{app.job.companyName}</span>
                          </div>
                        </td>
                        <td className="px-14 py-10">
                          <span className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-sm ${
                            app.status === 'SHORTLISTED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-emerald-100/20' :
                            app.status === 'REJECTED' ? 'bg-red-50 text-red-600 border border-red-100 shadow-red-100/20' :
                            'bg-amber-50 text-amber-600 border border-amber-100 shadow-amber-100/20'
                          }`}>
                            <span className={`h-2 w-2 rounded-full animate-pulse ${
                              app.status === 'SHORTLISTED' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                              app.status === 'REJECTED' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                              'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                            }`} />
                            {app.status}
                          </span>
                        </td>
                        <td className="px-14 py-10 text-right">
                          <div className="flex items-center justify-end gap-4">
                            <button
                              onClick={() => fetchHistory(app.id)}
                              className="h-14 w-14 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-primary hover:bg-white hover:shadow-xl hover:shadow-gray-200 rounded-[20px] transition-all duration-500 border border-transparent hover:border-gray-100"
                              title="Trace History"
                            >
                              <History className="h-6 w-6" />
                            </button>
                            <Link
                              to={`/jobs/${app.job.id}`}
                              className="h-14 w-14 flex items-center justify-center bg-gray-900 text-white rounded-[20px] shadow-2xl shadow-gray-900/20 hover:scale-110 hover:bg-primary transition-all duration-700"
                            >
                              <ArrowUpRight className="h-6 w-6" />
                            </Link>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-32 text-center">
                   <AlertCircle className="h-16 w-16 text-gray-200 mx-auto mb-6" />
                   <h3 className="text-2xl font-black text-gray-900 mb-2">System Empty</h3>
                   <p className="text-gray-500 font-medium mb-10">You haven't initiated any applications yet.</p>
                   <Link to="/jobs" className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20">Explore Jobs</Link>
                </div>
              )
            ) : (
              // Recruiter View
              activeTab === 'jobs' ? (
                postedJobs.length > 0 ? (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        <th className="px-10 py-6">Job Title</th>
                        <th className="px-10 py-6">Location</th>
                        <th className="px-10 py-6">Timestamp</th>
                        <th className="px-10 py-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {postedJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50/30 transition-colors group">
                          <td className="px-10 py-8 font-black text-gray-900 text-lg">{job.title}</td>
                          <td className="px-10 py-8 text-gray-500 font-bold">{job.location}</td>
                          <td className="px-10 py-8 text-gray-400 font-medium text-sm">
                            {new Date(job.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-10 py-8 text-right">
                            <Link
                              to={`/jobs/${job.id}`}
                              className="h-12 w-12 inline-flex items-center justify-center bg-gray-900 text-white rounded-xl shadow-lg shadow-gray-900/10 hover:scale-110 transition-all"
                            >
                              <ArrowUpRight className="h-5 w-5" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-32 text-center">
                    <TrendingUp className="h-16 w-16 text-gray-200 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-gray-900 mb-2">No Active Listings</h3>
                    <Link to="/post-job" className="px-10 py-4 bg-primary text-white font-black rounded-2xl">Create Listing</Link>
                  </div>
                )
              ) : (
                // Recruiter Applications View
                recruiterApps.length > 0 ? (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        <th className="px-10 py-6">Candidate</th>
                        <th className="px-10 py-6">Applied For</th>
                        <th className="px-10 py-6">Status</th>
                        <th className="px-10 py-6 text-right">Decision Module</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recruiterApps.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50/30 transition-colors group">
                          <td className="px-10 py-8 font-black text-gray-900">{app.userEmail}</td>
                          <td className="px-10 py-8 text-gray-500 font-bold">{app.job.title}</td>
                          <td className="px-10 py-8">
                             <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                               app.status === 'SHORTLISTED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                               app.status === 'REJECTED' ? 'bg-red-50 text-red-600 border border-red-100' :
                               'bg-amber-50 text-amber-600 border border-amber-100'
                             }`}>
                               {app.status}
                             </span>
                          </td>
                          <td className="px-10 py-8 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={() => fetchCandidateProfile(app.id)}
                                className="h-10 w-10 flex items-center justify-center bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-lg transition-all"
                                title="View Candidate Profile"
                              >
                                <UserCircle className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => fetchHistory(app.id)}
                                className="h-10 w-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-primary rounded-lg transition-all mr-2"
                                title="Audit Trail"
                              >
                                <History className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(app.id, 'SHORTLISTED')}
                                className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10"
                              >
                                Shortlist
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                                className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/10"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-32 text-center">
                    <Mail className="h-16 w-16 text-gray-200 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Inbox Empty</h3>
                    <p className="text-gray-500 font-medium">No candidates have applied to your listings yet.</p>
                  </div>
                )
              )
            )}
          </div>
        </div>

        {/* Developer Credit Floating */}
        <div className="py-20 text-center">
          <p className="text-[10px] font-black tracking-[0.4em] text-gray-300 uppercase">
            Architected & Engineered by Mrityunjay
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                  <History className="h-6 w-6 text-primary" />
                  Audit Trail
                </h3>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                {historyLoading ? (
                  <div className="flex flex-col items-center py-10">
                    <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Accessing Logs...</p>
                  </div>
                ) : selectedAppHistory && selectedAppHistory.length > 0 ? (
                  <div className="relative border-l-4 border-gray-50 ml-4 pl-10 space-y-12">
                    {selectedAppHistory.map((item) => (
                      <div key={item.id} className="relative">
                        <div className="absolute -left-[54px] top-1 h-6 w-6 rounded-full bg-white border-4 border-primary shadow-lg" />
                        <div>
                          <p className="text-sm font-black text-gray-900 flex items-center gap-3 mb-2">
                            {item.oldStatus}
                            <ChevronRight className="h-4 w-4 text-gray-300" />
                            <span className="text-primary">{item.newStatus}</span>
                          </p>
                          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                             <p className="text-xs text-gray-500 font-bold mb-1">
                               Verifier: <span className="text-gray-900 font-black">{item.updatedByEmail}</span>
                             </p>
                             <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                               {new Date(item.timestamp).toLocaleString()}
                             </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-400 font-bold">No historical data available.</p>
                  </div>
                )}
              </div>
              <div className="p-8 bg-gray-50/50">
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl hover:bg-primary transition-all shadow-xl shadow-gray-900/10"
                >
                  Close Access
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[48px] shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100"
            >
              <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <UserCircle className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 leading-none mb-1">Candidate Profile</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assessment Module</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    setSelectedCandidateProfile(null);
                  }}
                  className="h-12 w-12 flex items-center justify-center hover:bg-gray-100 rounded-2xl transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="p-10 max-h-[70vh] overflow-y-auto">
                {profileLoading ? (
                  <div className="flex flex-col items-center py-20">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mb-6" />
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Decrypting Identity Data...</p>
                  </div>
                ) : selectedCandidateProfile ? (
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</p>
                          <p className="text-xl font-black text-gray-900 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            {selectedCandidateProfile.firstName} {selectedCandidateProfile.lastName}
                          </p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Terminal</p>
                          <p className="text-xl font-black text-gray-900 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            {selectedCandidateProfile.email}
                          </p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Uplink</p>
                          <p className="text-xl font-black text-gray-900 bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                            <Phone className="h-5 w-5 text-primary" />
                            {selectedCandidateProfile.phone || 'N/A'}
                          </p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Resume Asset</p>
                          {selectedCandidateProfile.resumeUrl ? (
                            <button 
                              onClick={() => candidateService.viewResume(selectedCandidateProfile.resumeUrl!)}
                              className="w-full text-xl font-black text-primary bg-primary/5 p-4 rounded-2xl border border-primary/10 flex items-center gap-3 hover:bg-primary/10 transition-colors"
                            >
                              <FileText className="h-5 w-5" />
                              Download/View PDF
                            </button>
                          ) : (
                            <p className="text-xl font-black text-gray-400 bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">
                              No Resume Attached
                            </p>
                          )}
                       </div>
                    </div>

                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                          <Code className="h-3 w-3" />
                          Tech Stack & Skills
                       </p>
                       <div className="bg-gray-900 p-6 rounded-[32px] shadow-xl">
                          <div className="flex flex-wrap gap-2">
                             {selectedCandidateProfile.skills?.split(',').map((skill, i) => (
                               <span key={i} className="px-4 py-2 bg-white/10 text-white rounded-xl text-xs font-bold border border-white/5">
                                 {skill.trim()}
                               </span>
                             )) || <span className="text-white/40 italic">Not specified</span>}
                          </div>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Historical Experience</p>
                       <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100">
                          <div className="flex gap-4">
                             <Briefcase className="h-6 w-6 text-primary shrink-0 mt-1" />
                             <p className="text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">
                                {selectedCandidateProfile.experience || 'No experience data provided.'}
                             </p>
                          </div>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <AlertCircle className="h-16 w-16 text-gray-200 mx-auto mb-6" />
                    <p className="text-gray-400 font-bold">Failed to load candidate profile.</p>
                  </div>
                )}
              </div>
              <div className="p-10 bg-gray-50/50">
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    setSelectedCandidateProfile(null);
                  }}
                  className="w-full bg-gray-900 text-white font-black py-6 rounded-[24px] hover:bg-primary transition-all shadow-2xl shadow-gray-900/10 active:scale-95"
                >
                  Terminate Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
