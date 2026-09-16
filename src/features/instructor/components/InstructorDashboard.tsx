import React from 'react';
import { AppIcon } from '../../../components/ui/AppIcon';
import { Link } from 'react-router-dom';

export function InstructorDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Instructor Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your courses and learner performance.</p>
        </div>
        <div>
           <Link to="/courses/new" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
             Create Course
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="bg-indigo-100 p-3 rounded-full">
            <AppIcon name="book-open" className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Courses</p>
            <p className="text-2xl font-bold text-slate-900">3</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full">
            <AppIcon name="users" className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Learners</p>
            <p className="text-2xl font-bold text-slate-900">1,248</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="bg-orange-100 p-3 rounded-full">
            <AppIcon name="triangle-exclamation" className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">At-Risk Learners</p>
            <p className="text-2xl font-bold text-slate-900">12</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <AppIcon name="wave-square" className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Avg. Completion</p>
            <p className="text-2xl font-bold text-slate-900">68%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-bold text-slate-900">Your Courses</h2>
             <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</button>
          </div>
          <div className="space-y-4">
             {[
               { id: '1', title: 'Introduction to Machine Learning', learners: 450, rating: 4.8 },
               { id: '2', title: 'Data Science Fundamentals', learners: 320, rating: 4.5 },
               { id: '3', title: 'Advanced Neural Networks', learners: 125, rating: 4.9 },
             ].map(course => (
               <div key={course.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors">
                  <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center shrink-0">
                        <AppIcon name="book-open" className="w-5 h-5 text-slate-400" />
                     </div>
                     <div>
                        <p className="font-semibold text-slate-900 text-sm">{course.title}</p>
                        <p className="text-xs text-slate-500">{course.learners} enrolled</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
                       ★ {course.rating}
                     </span>
                  </div>
               </div>
             ))}
          </div>
        </section>
        
        <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
          </div>
          <div className="space-y-4">
             {[
               { id: '1', user: 'Sarah L.', action: 'completed assessment', target: 'Module 4 Quiz', time: '10 mins ago' },
               { id: '2', user: 'James M.', action: 'asked a question in', target: 'Lesson 2.1', time: '1 hour ago' },
               { id: '3', user: 'System', action: 'flagged learner as at-risk:', target: 'Emma W.', time: '3 hours ago', critical: true },
             ].map(event => (
               <div key={event.id} className="flex items-start space-x-3 p-3">
                  <div className={`w-2 h-2 mt-1.5 rounded-full ${event.critical ? 'bg-red-500' : 'bg-indigo-500'}`} />
                  <div>
                     <p className="text-sm text-slate-700">
                        <span className="font-semibold text-slate-900">{event.user}</span> {event.action} <span className="font-medium text-slate-900">{event.target}</span>
                     </p>
                     <p className="text-xs text-slate-500 mt-0.5">{event.time}</p>
                  </div>
               </div>
             ))}
          </div>
        </section>
      </div>
    </div>
  );
}
