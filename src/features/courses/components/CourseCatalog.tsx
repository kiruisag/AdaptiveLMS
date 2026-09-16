import React from 'react';
import { useCourses } from '../hooks/useCourses';
import { AppIcon } from '../../../components/ui/AppIcon';
import { Link } from 'react-router-dom';
import { FullPageLoader } from '../../../components/ui/LoadingSpinner';

export function CourseCatalog() {
  const { data, isLoading, error } = useCourses();

  if (isLoading) {
    return <FullPageLoader text="Loading courses..." />;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Failed to load courses.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Course Catalog</h1>
          <p className="text-slate-500 mt-1">Discover new skills and continue your learning journey.</p>
        </div>
        
        <div className="flex gap-2">
           <input 
             type="search" 
             placeholder="Search courses..." 
             className="px-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
           />
           <select className="px-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
             <option value="">All Difficulties</option>
             <option value="beginner">Beginner</option>
             <option value="intermediate">Intermediate</option>
             <option value="advanced">Advanced</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <Link to={`/courses/${course.id}`} className="h-40 bg-slate-100 relative block">
               <div className="absolute inset-0 flex items-center justify-center">
                  <AppIcon name="book-open" className="w-12 h-12 text-slate-300" />
               </div>
               <div className="absolute top-3 left-3">
                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-slate-800 shadow-sm">
                   {course.category}
                 </span>
               </div>
            </Link>
            
            <div className="p-5 flex-1 flex flex-col">
              <Link to={`/courses/${course.id}`} className="text-lg font-bold text-slate-900 line-clamp-2 mb-2 hover:text-indigo-600 transition-colors">
                {course.title}
              </Link>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-5 mt-auto">
                <div className="flex items-center gap-1">
                  <AppIcon name="clock" className="w-4 h-4" />
                  <span>{Math.floor(course.duration_minutes / 60)}h {course.duration_minutes % 60}m</span>
                </div>
                <div className="flex items-center gap-1">
                  <AppIcon name="chart-column" className="w-4 h-4" />
                  <span className="capitalize">{course.difficulty}</span>
                </div>
                <div className="flex items-center gap-1">
                  <AppIcon name="user" className="w-4 h-4" />
                  <span>{course.instructor_name}</span>
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-4 mt-auto">
                 {course.enrollment_status === 'enrolled' ? (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-indigo-600">In Progress</span>
                        <span className="text-slate-500">{course.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3">
                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${course.progress_percentage}%` }}></div>
                      </div>
                      <Link to={`/learning/${course.id}`} className="block w-full text-center py-2 px-4 border border-indigo-600 rounded-md text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors">
                        Continue Learning
                      </Link>
                    </div>
                 ) : course.enrollment_status === 'completed' ? (
                    <button disabled className="w-full py-2 px-4 border border-transparent rounded-md text-sm font-medium text-green-700 bg-green-50">
                      Completed
                    </button>
                 ) : (
                    <button className="w-full py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                      Enroll Now
                    </button>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {data?.data.length === 0 && (
         <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
           <AppIcon name="book-open" className="mx-auto h-12 w-12 text-slate-300" />
           <h3 className="mt-2 text-sm font-medium text-slate-900">No courses found</h3>
           <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters.</p>
         </div>
      )}
    </div>
  );
}
