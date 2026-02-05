import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../context/ChatContext';
import { Briefcase, LogOut, User, Menu, X, Bell, Check, Clock, MessageSquare } from 'lucide-react';
import { notificationService } from '../services/notification.service';
import { type Notification } from '../types';
import { formatDistanceToNow } from 'date-fns';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { openChat } = useChat();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [data, count] = await Promise.all([
          notificationService.getMyNotifications(),
          notificationService.getUnreadCount()
        ]);
        setNotifications(data);
        setUnreadCount(count);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };

    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-gray-100/30 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-gray-900 p-2.5 rounded-2xl group-hover:bg-primary transition-colors duration-500 shadow-xl shadow-gray-900/10">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900">
                Hire<span className="text-primary">Sphere</span>
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center ml-10">
            <div className="bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
              <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                Product by <span className="text-primary">Mrityunjay</span>
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/jobs" className="text-gray-600 hover:text-primary font-medium transition-colors">
              Find Jobs
            </Link>
            {user ? (
              <>
                {user.role === 'RECRUITER' && (
                  <Link to="/post-job" className="text-gray-600 hover:text-primary font-medium transition-colors">
                    Post a Job
                  </Link>
                )}
                <Link to="/dashboard" className="text-gray-600 hover:text-primary font-medium transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                  {/* Chat Toggle */}
                  <button
                    onClick={() => openChat()}
                    className="p-2 text-gray-500 hover:text-primary transition-colors relative"
                    title="Open Chats"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </button>

                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                      className="p-2 text-gray-500 hover:text-primary transition-colors relative"
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>

                    {isNotificationsOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setIsNotificationsOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                          <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-bold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                {unreadCount} unread
                              </span>
                            )}
                          </div>
                          <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                              <div className="divide-y divide-gray-50">
                                {notifications.map((n) => (
                                  <div 
                                    key={n.id} 
                                    className={`p-4 transition-colors ${n.isRead ? 'bg-white' : 'bg-primary/5'}`}
                                  >
                                    <div className="flex gap-3">
                                      <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.isRead ? 'bg-transparent' : 'bg-primary'}`} />
                                      <div className="flex-1">
                                        <p className={`text-sm ${n.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                                          {n.message}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                          <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                          </div>
                                          {!n.isRead && (
                                            <button 
                                              onClick={() => handleMarkAsRead(n.id)}
                                              className="text-[10px] font-black text-primary hover:underline flex items-center"
                                            >
                                              <Check className="h-3 w-3 mr-0.5" /> MARK READ
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-8 text-center">
                                <Bell className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                                <p className="text-sm text-gray-500">No notifications yet</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{user.firstName || user.email.split('@')[0]}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-destructive transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 animate-in slide-in-from-top duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/jobs"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Find Jobs
            </Link>
            {user ? (
              <>
                {user.role === 'RECRUITER' && (
                  <Link
                    to="/post-job"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Post a Job
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-red-50 transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="pt-4 pb-2 border-t border-gray-100">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block mt-2 px-3 py-2 rounded-md text-base font-medium bg-primary text-white text-center shadow-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
