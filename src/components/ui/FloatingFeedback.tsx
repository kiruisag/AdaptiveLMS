import React, { useState, useRef, useEffect } from 'react';
import { AppIcon } from './AppIcon';

export function FloatingFeedback() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'bug' | 'feature'>('bug');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        setMessage('');
        setType('bug');
      }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {/* Popover Form */}
      {isOpen && (
        <div 
          ref={popoverRef}
          className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform origin-bottom-right transition-all animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="bg-indigo-600 p-4 flex items-center justify-between text-white">
            <h3 className="font-semibold flex items-center gap-2">
              <AppIcon name="message" className="w-4 h-4" />
              Send Feedback
            </h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-indigo-500 rounded-full transition-colors"
            >
              <AppIcon name="xmark" className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <AppIcon name="circle-check" className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Thank you!</p>
                  <p className="text-sm text-slate-500">Your feedback has been submitted.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setType('bug')}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      type === 'bug' 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <AppIcon name="bug" className="w-4 h-4" />
                    Issue
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('feature')}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      type === 'feature' 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <AppIcon name="lightbulb" className="w-4 h-4" />
                    Idea
                  </button>
                </div>
                
                <div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={type === 'bug' ? "What went wrong?" : "What would you like to see?"}
                    className="w-full text-slate-900 text-sm border-slate-200 p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none h-24 bg-white"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <AppIcon name="paper-plane" className="w-4 h-4" />
                      Submit
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Send Feedback"
      >
        {isOpen ? <AppIcon name="xmark" className="w-6 h-6" /> : <AppIcon name="message" className="w-6 h-6" />}
      </button>
    </div>
  );
}
