import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="bg-primary p-2 rounded-lg">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                HireSphere
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              The next generation career platform. Connecting talent with opportunity through a seamless, dynamic interface.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">For Candidates</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/jobs" className="text-gray-500 hover:text-primary transition-colors">Browse Jobs</Link></li>
              <li><Link to="/dashboard" className="text-gray-500 hover:text-primary transition-colors">Applied Jobs</Link></li>
              <li><Link to="/profile" className="text-gray-500 hover:text-primary transition-colors">Candidate Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">For Recruiters</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/post-job" className="text-gray-500 hover:text-primary transition-colors">Post a Job</Link></li>
              <li><Link to="/dashboard" className="text-gray-500 hover:text-primary transition-colors">Manage Applicants</Link></li>
              <li><Link to="/dashboard" className="text-gray-500 hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">Contact & Support</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center space-x-3 text-gray-500">
                <Mail className="h-4 w-4" />
                <span>support@hiresphere.com</span>
              </li>
              <li className="mt-6">
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Developer Spotlight</p>
                  <p className="text-sm text-gray-900 font-bold italic">"Crafted with passion by Mrityunjay"</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 font-medium">
            © {new Date().getFullYear()} HireSphere. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>by</span>
            <span className="text-gray-900 font-bold">Mrityunjay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
