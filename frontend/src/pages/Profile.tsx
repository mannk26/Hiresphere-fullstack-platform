import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/user.service';
import { candidateService } from '../services/candidate.service';
import { API_URL } from '../api/axios';
import { User as UserIcon, BookOpen, Code, Briefcase, Save, Loader2, CheckCircle, Sparkles, ShieldCheck, Mail, Phone, Upload, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile: React.FC = () => {
  const { user: authUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    skills: '',
    experience: '',
    phone: ''
  });
  const [resume, setResume] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await userService.getMyProfile();
        let candidateProfile = null;
        
        if (authUser?.role === 'CANDIDATE') {
          try {
            candidateProfile = await candidateService.getProfile(authUser.id);
          } catch {
            console.log("Candidate profile not yet created");
          }
        }

        setFormData({
          firstName: candidateProfile?.firstName || profile.firstName || '',
          lastName: candidateProfile?.lastName || profile.lastName || '',
          bio: profile.bio || '',
          skills: candidateProfile?.skills || profile.skills || '',
          experience: candidateProfile?.experience || profile.experience || '',
          phone: candidateProfile?.phone || ''
        });
        
        if (candidateProfile?.resumeUrl) {
          setResumeUrl(candidateProfile.resumeUrl);
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [authUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      if (authUser?.role === 'CANDIDATE') {
        const data = new FormData();
        data.append('profile', new Blob([JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          skills: formData.skills,
          experience: formData.experience
        })], { type: 'application/json' }));
        
        if (resume) {
          data.append('resume', resume);
        }
        
        const updated = await candidateService.updateProfile(data);
        if (updated.resumeUrl) {
          setResumeUrl(updated.resumeUrl);
        }
        
        // Also update the basic user bio
        await userService.updateProfile({ bio: formData.bio });
      } else {
        await userService.updateProfile(formData);
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Syncing Profile Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-primary/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-blue-500/5 blur-[120px] -z-10" />

      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.3em] mb-4"
          >
            <Sparkles className="h-4 w-4" />
            Control Center
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-4"
          >
            Your <span className="italic text-primary">Identity</span>.
          </motion.h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl">
            Configure your professional presence across the HireSphere ecosystem.
          </p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[48px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden"
        >
          <div className="p-10 md:p-16 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row items-center gap-10">
            <div className="h-32 w-32 rounded-[40px] bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/20 shrink-0">
              <UserIcon className="h-16 w-16" />
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                 <Mail className="h-5 w-5 text-gray-400" />
                 <h2 className="text-2xl font-black text-gray-900">{authUser?.email}</h2>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="inline-flex items-center px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white shadow-lg shadow-gray-900/10">
                  <ShieldCheck className="h-3 w-3 mr-2 text-primary" />
                  {authUser?.role}
                </span>
                <span className="inline-flex items-center px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary">
                  Verified Account
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 md:p-16 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">First Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none group-focus-within:text-primary">
                    <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-16 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[24px] focus:outline-none focus:bg-white focus:border-primary/10 focus:ring-4 focus:ring-primary/5 transition-all text-gray-900 font-bold"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Last Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none group-focus-within:text-primary">
                    <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-16 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[24px] focus:outline-none focus:bg-white focus:border-primary/10 focus:ring-4 focus:ring-primary/5 transition-all text-gray-900 font-bold"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Contact Phone</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none group-focus-within:text-primary">
                    <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="tel"
                    className="block w-full pl-16 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[24px] focus:outline-none focus:bg-white focus:border-primary/10 focus:ring-4 focus:ring-primary/5 transition-all text-gray-900 font-bold"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Legacy Bio</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none group-focus-within:text-primary">
                    <BookOpen className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-16 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[24px] focus:outline-none focus:bg-white focus:border-primary/10 focus:ring-4 focus:ring-primary/5 transition-all text-gray-900 font-bold"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {authUser?.role === 'CANDIDATE' && (
              <>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Tech Stack (Skills)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none group-focus-within:text-primary">
                      <Code className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-16 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[24px] focus:outline-none focus:bg-white focus:border-primary/10 focus:ring-4 focus:ring-primary/5 transition-all text-gray-900 font-bold"
                      placeholder="e.g. React, Node.js, Cloud Infrastructure..."
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Professional Experience</label>
                  <div className="relative group">
                    <div className="absolute top-6 left-6 pointer-events-none group-focus-within:text-primary">
                      <Briefcase className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <textarea
                      rows={4}
                      className="block w-full pl-16 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[32px] focus:outline-none focus:bg-white focus:border-primary/10 focus:ring-4 focus:ring-primary/5 transition-all text-gray-900 font-bold leading-relaxed"
                      placeholder="Outline your historical impact and roles..."
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Resume Module (PDF)</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative group cursor-pointer border-2 border-dashed border-gray-100 rounded-[32px] p-10 hover:border-primary/30 transition-all bg-gray-50/30 hover:bg-primary/5"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center text-center">
                      <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                        {resume ? <FileText className="h-8 w-8 text-primary" /> : <Upload className="h-8 w-8 text-gray-400" />}
                      </div>
                      <p className="text-sm font-bold text-gray-600 mb-1">
                        {resume ? resume.name : (resumeUrl ? 'Update existing resume' : 'Upload professional resume')}
                      </p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PDF Max 5MB</p>
                    </div>
                  </div>
                  {resumeUrl && !resume && (
                    <div className="flex items-center gap-2 mt-4 ml-4">
                      <FileText className="h-4 w-4 text-primary" />
                      <button 
                        type="button"
                        onClick={() => candidateService.viewResume(resumeUrl)}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        View Current Resume
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="pt-10 flex flex-col sm:flex-row items-center gap-6">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:flex-1 flex justify-center items-center gap-3 py-6 px-10 rounded-[28px] text-xl font-black text-white bg-gray-900 hover:bg-primary transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-gray-900/10 hover:shadow-primary/20"
              >
                {saving ? <Loader2 className="animate-spin h-6 w-6" /> : (
                  <>
                    <Save className="h-6 w-6" />
                    Commit Changes
                  </>
                )}
              </button>
              
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-3 text-emerald-600 font-black uppercase text-xs tracking-[0.2em] bg-emerald-50 px-6 py-4 rounded-2xl border border-emerald-100"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>Sync Successful</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </motion.div>

        <footer className="py-20 text-center">
          <p className="text-[10px] font-black tracking-[0.4em] text-gray-300 uppercase">
             Identity Layer Managed by Mrityunjay
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Profile;
