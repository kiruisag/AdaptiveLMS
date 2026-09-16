import React from 'react';
import { Trophy, Target, Award, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const masteryData = [
  { subject: 'Algebra', A: 85, fullMark: 100 },
  { subject: 'Geometry', A: 65, fullMark: 100 },
  { subject: 'Calculus', A: 45, fullMark: 100 },
  { subject: 'Statistics', A: 90, fullMark: 100 },
  { subject: 'Logic', A: 75, fullMark: 100 },
];

const progressData = [
  { name: 'Mon', hours: 2 },
  { name: 'Tue', hours: 3.5 },
  { name: 'Wed', hours: 1 },
  { name: 'Thu', hours: 4 },
  { name: 'Fri', hours: 2.5 },
  { name: 'Sat', hours: 0 },
  { name: 'Sun', hours: 5 },
];

export function LearnerProgress() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Progress</h1>
          <p className="text-slate-500 mt-1">Track your mastery, activity, and achievements over time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Stats */}
         <div className="bg-indigo-600 text-white rounded-2xl p-6 shadow-sm border border-indigo-700 flex flex-col justify-between">
           <div>
             <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center mb-4">
               <Trophy className="w-5 h-5 text-white" />
             </div>
             <p className="text-indigo-200 font-medium text-sm">Overall Mastery</p>
             <p className="text-4xl font-bold mt-1">76%</p>
           </div>
           <div className="mt-6 flex items-center text-sm font-medium text-indigo-100 bg-white/10 py-1.5 px-3 rounded-full w-fit">
             <ArrowUpRight className="w-4 h-4 mr-1" />
             <span>+4% this week</span>
           </div>
         </div>
         
         <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
           <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center mb-4">
             <Target className="w-5 h-5 text-orange-600" />
           </div>
           <p className="text-slate-500 font-medium text-sm">Learning Hours</p>
           <p className="text-3xl font-bold text-slate-900 mt-1">32h 45m</p>
           <p className="text-sm text-slate-500 mt-6">Top 15% of learners</p>
         </div>
         
         <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
           <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mb-4">
             <Award className="w-5 h-5 text-green-600" />
           </div>
           <p className="text-slate-500 font-medium text-sm">Certificates Earned</p>
           <p className="text-3xl font-bold text-slate-900 mt-1">4</p>
           <button className="text-sm text-indigo-600 font-medium mt-6 hover:text-indigo-800">View Certificates &rarr;</button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Topic Mastery</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={masteryData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Mastery" dataKey="A" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 justify-center text-sm">
             <span className="inline-flex items-center space-x-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-slate-600">Strong: Statistics, Algebra</span></span>
             <span className="inline-flex items-center space-x-1.5 ml-4"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-slate-600">Needs Focus: Calculus</span></span>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Learning Activity (This Week)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="hours" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Completed Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {[
             { title: 'Python for Beginners', date: 'Oct 12, 2023', score: '98%' },
             { title: 'SQL Fundamentals', date: 'Nov 05, 2023', score: '92%' },
             { title: 'Data Visualization with D3', date: 'Jan 22, 2024', score: '88%' },
           ].map((course, i) => (
             <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
               <div>
                 <div className="flex items-center space-x-2">
                   <CheckCircle2 className="w-5 h-5 text-green-500" />
                   <h4 className="font-semibold text-slate-900">{course.title}</h4>
                 </div>
                 <p className="text-sm text-slate-500 mt-1 ml-7">Completed {course.date}</p>
               </div>
               <div className="text-right">
                 <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Final Score</span>
                 <p className="font-bold text-indigo-600 text-lg">{course.score}</p>
               </div>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
}
