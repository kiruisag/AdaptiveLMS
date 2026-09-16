import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNextActivity } from '../hooks/useLearning';
import { ArrowLeft, CheckCircle, BrainCircuit, PlayCircle, FileText, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { FullPageLoader } from '../../../components/ui/LoadingSpinner';

export function LearningPlayer() {
  const { courseId } = useParams();
  const { data: recommendation, isLoading, error, refetch } = useNextActivity(courseId || 'c1');
  const [isPlaying, setIsPlaying] = useState(false);

  if (isLoading) {
    return <FullPageLoader text="Preparing your personalized learning session..." />;
  }

  if (error || !recommendation) {
    return <div className="p-8 text-center text-red-500">Failed to load learning session.</div>;
  }

  const handleComplete = () => {
    toast.success('Activity completed! Analyzing performance...');
    setIsPlaying(false);
    // In a real app, this would mutate progress and get next activity
    setTimeout(() => {
       refetch();
    }, 1500);
  };

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'video': return <PlayCircle className="w-8 h-8 text-indigo-600" />;
      case 'reading': return <FileText className="w-8 h-8 text-indigo-600" />;
      case 'practice': return <CheckCircle className="w-8 h-8 text-indigo-600" />;
      default: return <BrainCircuit className="w-8 h-8 text-indigo-600" />;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/courses" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Learning Session</h1>
          <p className="text-sm text-slate-500">Adaptive mode active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Left Sidebar: Course Outline / Progress */}
        <div className="hidden lg:flex flex-col bg-white border border-slate-200 rounded-lg p-4 space-y-4">
          <h3 className="font-bold text-slate-900">Course Outline</h3>
          <div className="space-y-2 text-sm overflow-y-auto">
             <div className="flex items-center space-x-2 text-slate-400">
               <CheckCircle className="w-4 h-4 text-green-500" />
               <span className="line-through">Module 1: Basics</span>
             </div>
             <div className="flex items-center space-x-2 text-slate-400">
               <CheckCircle className="w-4 h-4 text-green-500" />
               <span className="line-through">Module 2: Formulas</span>
             </div>
             <div className="flex items-start space-x-2 text-slate-900 font-medium">
               <ChevronRight className="w-4 h-4 text-indigo-600 mt-0.5" />
               <span>Module 3: Current Focus<br/><span className="text-xs text-slate-500 font-normal">Adaptive Path</span></span>
             </div>
             <div className="flex items-center space-x-2 text-slate-400 ml-6">
               <div className="w-2 h-2 rounded-full bg-slate-300" />
               <span>Upcoming Topics</span>
             </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-slate-100">
             <div className="bg-indigo-50 p-3 rounded-lg flex items-start space-x-3">
               <BrainCircuit className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
               <div>
                 <p className="text-xs font-semibold text-indigo-900">AI Tutor Active</p>
                 <p className="text-xs text-indigo-700 mt-1">Monitoring mastery in real-time.</p>
               </div>
             </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-span-1 lg:col-span-3 flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden">
          {!isPlaying ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-indigo-50 p-6 rounded-full mb-6">
                {getActivityIcon(recommendation.activity.type)}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{recommendation.activity.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-slate-500 mb-6">
                <span className="uppercase tracking-wider font-semibold text-xs bg-slate-100 px-2 py-1 rounded">{recommendation.activity.type}</span>
                <span>•</span>
                <span className="capitalize">{recommendation.activity.difficulty}</span>
                <span>•</span>
                <span>~{recommendation.activity.estimated_minutes} mins</span>
              </div>
              
              <div className="max-w-md bg-blue-50 border border-blue-100 p-4 rounded-lg mb-8 text-left">
                <h4 className="font-semibold text-blue-900 text-sm mb-1">Why this activity?</h4>
                <p className="text-sm text-blue-800 leading-relaxed">{recommendation.reasoning}</p>
                <div className="mt-3 flex items-center space-x-2">
                   <span className="text-xs text-blue-700 font-medium">Current Mastery: {Math.round(recommendation.learning_context.mastery * 100)}%</span>
                   <div className="flex-1 h-1.5 bg-blue-200 rounded-full">
                     <div className="h-1.5 bg-blue-600 rounded-full" style={{ width: `${recommendation.learning_context.mastery * 100}%` }}></div>
                   </div>
                </div>
              </div>
              
              <button 
                onClick={() => setIsPlaying(true)}
                className="py-3 px-8 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Start Activity
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col p-6">
               <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                  <h3 className="font-bold text-lg text-slate-900">{recommendation.activity.title}</h3>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{recommendation.activity.type}</span>
               </div>
               
               <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200 mb-6 border-dashed">
                  {/* Mock content rendering */}
                  <div className="text-center p-8 max-w-lg">
                    <p className="text-slate-500 mb-4">Interactive {recommendation.activity.type} content would render here, consumed from the API.</p>
                    <div className="h-32 bg-slate-200 rounded animate-pulse w-full max-w-sm mx-auto"></div>
                  </div>
               </div>
               
               <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button 
                    onClick={handleComplete}
                    className="py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <span>Complete Activity</span>
                    <CheckCircle className="w-4 h-4" />
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
