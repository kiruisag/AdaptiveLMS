import React, { useState, useEffect, useRef } from 'react';
import { AppIcon } from './AppIcon';

const mockNotifications = [
  { id: '1', title: 'New Course Available', description: 'Advanced Machine Learning has been added to your curriculum.', type: 'info', time: '10 mins ago', read: false },
  { id: '2', title: 'Assignment Graded', description: 'Your Module 3 assignment has been graded. You scored 95%!', type: 'success', time: '2 hours ago', read: false },
  { id: '3', title: 'Upcoming Deadline', description: 'Module 4 Quiz is due tomorrow at 11:59 PM.', type: 'warning', time: '5 hours ago', read: false },
  { id: '4', title: 'System Maintenance', description: 'The platform will be down for maintenance on Saturday from 2 AM to 4 AM.', type: 'info', time: '1 day ago', read: true },
];

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <AppIcon name="bell" className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50" aria-hidden="true" />
      )}

      {/* Slide-over Panel */}
      <div 
        ref={panelRef}
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <AppIcon name="xmark" className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 rounded-xl border ${notification.read ? 'bg-white border-slate-200' : 'bg-indigo-50/50 border-indigo-100 shadow-sm'} flex items-start gap-3`}
              >
                <div className="shrink-0 mt-0.5">
                  {notification.type === 'info' && <AppIcon name="circle-info" className="w-5 h-5 text-blue-500" />}
                  {notification.type === 'success' && <AppIcon name="circle-check" className="w-5 h-5 text-green-500" />}
                  {notification.type === 'warning' && <AppIcon name="triangle-exclamation" className="w-5 h-5 text-orange-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                    {notification.title}
                  </p>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                    {notification.description}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-slate-400 font-medium">
                    <AppIcon name="clock" className="w-3 h-3" />
                    <span>{notification.time}</span>
                  </div>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 mt-1.5" />
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3">
              <AppIcon name="bell" className="w-12 h-12 text-slate-300" />
              <p>No notifications right now.</p>
            </div>
          )}
        </div>

        {unreadCount > 0 && (
          <div className="p-4 border-t border-slate-200 bg-white">
            <button 
              onClick={markAllAsRead}
              className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-sm transition-colors"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </>
  );
}
