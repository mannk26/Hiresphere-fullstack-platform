import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, Users, Building, ArrowRight, Sparkles, Globe, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-dot-pattern opacity-50" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-8 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Next-Gen Hiring Ecosystem</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-7xl md:text-[100px] font-black text-gray-900 tracking-tight leading-[0.85] mb-8"
              >
                Elevate <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-600 to-violet-600">
                  Your Future
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-xl text-gray-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-12 font-medium"
              >
                HireSphere is the premium intelligence layer for modern careers. 
                We connect elite talent with visionary companies through a seamless, transparent experience.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
              >
                <Link
                  to="/jobs"
                  className="group relative inline-flex items-center justify-center px-10 py-5 bg-gray-900 text-white font-black text-lg rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Discover Roles <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  to="/register"
                  className="px-10 py-5 bg-white text-gray-900 font-black text-lg rounded-2xl border-2 border-gray-100 hover:border-primary/20 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
                >
                  Get Started
                </Link>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-16 flex items-center justify-center lg:justify-start gap-8 opacity-60"
              >
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-12 w-12 rounded-full border-4 border-white bg-gray-200" />
                  ))}
                </div>
                <p className="text-sm font-bold text-gray-900">
                  Trusted by <span className="text-primary font-black">10,000+</span> professionals worldwide
                </p>
              </motion.div>
            </div>

            <div className="flex-1 relative">
              <motion.div
                initial={{ opacity: 0, rotate: 5, scale: 0.9 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10"
              >
                <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[48px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-white/50 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="flex items-center justify-between mb-10 relative">
                    <div className="h-4 w-32 bg-gray-100/80 rounded-full" />
                    <div className="flex gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                    </div>
                  </div>
                  
                  <div className="space-y-6 relative">
                    {[
                      { icon: <Building className="text-blue-500" />, label: "Senior Product Designer", co: "Google", type: "Full-time" },
                      { icon: <Briefcase className="text-purple-500" />, label: "Backend Engineer", co: "Stripe", type: "Remote" },
                      { icon: <Users className="text-emerald-500" />, label: "Growth Manager", co: "Airbnb", type: "Hybrid" }
                    ].map((job, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + (i * 0.1), ease: "easeOut" }}
                        key={i} 
                        className="flex items-center gap-5 p-5 bg-white/50 hover:bg-white rounded-[24px] border border-gray-100/50 hover:border-primary/20 transition-all hover:shadow-xl hover:-translate-y-1"
                      >
                        <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-md border border-gray-50">
                          {job.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-gray-900 text-sm tracking-tight">{job.label}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{job.co}</p>
                            <span className="h-1 w-1 rounded-full bg-gray-200" />
                            <p className="text-[10px] text-primary font-bold uppercase tracking-wider">{job.type}</p>
                          </div>
                        </div>
                        <div className="text-[10px] font-black text-white bg-gray-900 px-4 py-2 rounded-xl shadow-lg shadow-gray-900/10 hover:bg-primary transition-colors cursor-pointer">
                          VIEW
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Floating Widgets */}
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-100 p-3 rounded-2xl">
                      <Zap className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase">Success Rate</p>
                      <p className="text-2xl font-black text-gray-900">98.2%</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-2xl">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase">Remote Jobs</p>
                      <p className="text-2xl font-black text-gray-900">2.5k+</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Active Jobs", val: "50k+" },
              { label: "Companies", val: "12k+" },
              { label: "Talent pool", val: "2M+" },
              { label: "Placed Every Month", val: "15k+" }
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tighter">{stat.val}</p>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-[0.95]">
              Everything you need to <span className="text-primary">scale your career</span>.
            </h2>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              We've built a platform that removes friction, adds transparency, and values your time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="h-8 w-8 text-blue-600" />,
                title: "Precision Matching",
                desc: "Our algorithms don't just search keywords; they match your unique potential with the right team culture.",
                color: "blue"
              },
              {
                icon: <ShieldCheck className="h-8 w-8 text-indigo-600" />,
                title: "Verified Companies",
                desc: "Every recruiter on HireSphere goes through a rigorous verification process. No spam, only real opportunities.",
                color: "indigo"
              },
              {
                icon: <Users className="h-8 w-8 text-purple-600" />,
                title: "Real-time Audits",
                desc: "Track every single status change in your application lifecycle with our transparent audit logging system.",
                color: "purple"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="group p-10 bg-white rounded-[32px] border border-gray-100 transition-all hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:border-primary/10"
              >
                <div className={`bg-${feature.color}-50 p-5 rounded-[24px] inline-block mb-8 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto rounded-[50px] bg-gray-900 overflow-hidden relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
          <div className="relative z-10 p-12 md:p-24 text-center">
            <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
              Designed with care. <br />
              Built for <span className="text-primary italic">results</span>.
            </h2>
            <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium">
              Join the ecosystem that prioritizes talent over buzzwords. Your next chapter begins today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to="/register"
                className="px-10 py-5 bg-white text-gray-900 font-black text-xl rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
              >
                Join HireSphere Now
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-4 grayscale opacity-50">
               {/* Corporate logos placeholders */}
               <div className="h-6 w-24 bg-white/20 rounded" />
               <div className="h-6 w-24 bg-white/20 rounded" />
               <div className="h-6 w-24 bg-white/20 rounded" />
            </div>
          </div>
          
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-[60%] h-full bg-primary/10 blur-[100px] -z-1" />
          <div className="absolute bottom-0 left-0 w-[40%] h-full bg-blue-600/10 blur-[100px] -z-1" />
        </div>
      </section>

      {/* Developer Credit Floating */}
      <div className="py-12 text-center">
        <p className="text-[10px] font-black tracking-[0.3em] text-gray-300 uppercase">
          Crafted with absolute precision by Mrityunjay
        </p>
      </div>
    </div>
  );
};

export default Home;
