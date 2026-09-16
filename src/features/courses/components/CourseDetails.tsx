import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Clock, BarChart, User, CheckCircle, Play } from 'lucide-react';
import { useCourses } from '../hooks/useCourses';
import { FullPageLoader } from '../../../components/ui/LoadingSpinner';

export function CourseDetails() {
  const { courseId } = useParams();
  const { data, isLoading } = useCourses();
  
  if (isLoading) return <FullPageLoader text="Loading course details..." />;
  
  const course = data?.data.find(c => c.id === courseId);
  
  if (!course) {
    return <div className="p-8 text-center text-slate-500">Course not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-12">
        <div className="flex items-center space-x-2 mb-4">
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            {course.category}
          </span>
          <span className="bg-white/10 text-slate-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            {course.difficulty}
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{course.title}</h1>
        <p className="text-lg text-slate-300 max-w-3xl mb-8 leading-relaxed">
          {course.description}
        </p>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 border-t border-slate-800 pt-6">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            <span>Instructor: <span className="text-white font-medium">{course.instructor_name}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>{Math.floor(course.duration_minutes / 60)}h {course.duration_minutes % 60}m</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart className="w-5 h-5 text-indigo-400" />
            <span className="capitalize">{course.difficulty} Level</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Learning Objectives</h2>
            <ul className="space-y-3">
              {[
                "Understand foundational concepts and terminology.",
                "Apply theoretical knowledge to practical scenarios.",
                "Develop critical thinking skills within the subject domain.",
                "Complete a capstone project demonstrating mastery."
              ].map((objective, i) => (
                <li key={i} className="flex items-start space-x-3 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Course Curriculum</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(module => (
                <div key={module} className="border border-slate-200 rounded-lg p-4">
                  <h3 className="font-bold text-slate-900 mb-2">Module {module}: Core Concepts</h3>
                  <div className="space-y-2 mt-3">
                    {[1, 2, 3].map(lesson => (
                      <div key={lesson} className="flex items-center justify-between text-sm py-2 px-3 hover:bg-slate-50 rounded-md">
                        <div className="flex items-center space-x-3 text-slate-700">
                          <Play className="w-4 h-4 text-slate-400" />
                          <span>Lesson {lesson}: Topic breakdown and analysis</span>
                        </div>
                        <span className="text-slate-500 text-xs">15:00</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
            <div className="mb-6">
              {course.enrollment_status === 'enrolled' ? (
                <div>
                   <p className="text-sm font-medium text-slate-500 mb-2">Your Progress</p>
                   <div className="flex items-center justify-between text-sm mb-1">
                     <span className="font-bold text-indigo-600">{course.progress_percentage}% Complete</span>
                   </div>
                   <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
                     <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${course.progress_percentage}%` }}></div>
                   </div>
                   <Link to={`/learning/${course.id}`} className="flex items-center justify-center w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                     Resume Learning
                   </Link>
                </div>
              ) : course.enrollment_status === 'completed' ? (
                <button disabled className="w-full py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-green-700 bg-green-50">
                  Course Completed
                </button>
              ) : (
                <button className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Enroll in Course
                </button>
              )}
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-4">
              <h3 className="font-bold text-slate-900">This course includes:</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center space-x-3">
                  <Play className="w-4 h-4 text-slate-400" />
                  <span>{course.duration_minutes / 60} hours on-demand video</span>
                </li>
                <li className="flex items-center space-x-3">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>12 downloadable resources</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-slate-400" />
                  <span>Certificate of completion</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
