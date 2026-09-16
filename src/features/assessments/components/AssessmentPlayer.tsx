import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssessment, useSubmitAssessment } from '../hooks/useAssessments';
import { Clock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { FullPageLoader } from '../../../components/ui/LoadingSpinner';

export function AssessmentPlayer() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { data: assessment, isLoading, error } = useAssessment(assessmentId || 'a1');
  const { mutateAsync: submit, isPending: isSubmitting } = useSubmitAssessment();
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);

  if (isLoading) {
    return <FullPageLoader text="Loading assessment..." />;
  }

  if (error || !assessment) {
    return <div className="p-8 text-center text-red-500">Failed to load assessment.</div>;
  }

  const handleSubmit = async () => {
    try {
      const res = await submit({
        assessment_id: assessment.id,
        answers
      });
      setResult(res);
      toast.success('Assessment submitted successfully!');
    } catch (e) {
      toast.error('Failed to submit assessment.');
    }
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-slate-200">
           <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${result.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
             {result.passed ? <CheckCircle className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
           </div>
           <h2 className="text-2xl font-bold text-slate-900 mb-2">
             {result.passed ? 'Assessment Passed!' : 'Assessment Failed'}
           </h2>
           <p className="text-4xl font-extrabold text-slate-900 mb-2">{Math.round(result.percentage)}%</p>
           <p className="text-slate-500 mb-6">You scored {result.score} out of {result.total_points} points.</p>
           
           <div className="bg-slate-50 p-4 rounded-lg text-left mb-6">
              <h4 className="font-semibold text-slate-900 text-sm mb-1">Feedback</h4>
              <p className="text-sm text-slate-700">{result.feedback}</p>
           </div>
           
           <button onClick={() => navigate('/courses')} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
             Return to Dashboard
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
         <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-700 flex items-center space-x-1">
           <ArrowLeft className="w-4 h-4" />
           <span className="text-sm font-medium">Back</span>
         </button>
         <div className="flex items-center space-x-2 text-slate-500 font-medium">
           <Clock className="w-5 h-5" />
           <span>{assessment.duration_minutes}:00 left</span>
         </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{assessment.title}</h1>
        <p className="text-slate-600 mb-4">{assessment.description}</p>
      </div>

      <div className="space-y-6">
        {assessment.questions.map((question, index) => (
          <div key={question.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-slate-900">
                <span className="text-indigo-600 mr-2">{index + 1}.</span>
                {question.text}
              </h3>
              <span className="text-sm font-medium text-slate-500 shrink-0 ml-4">{question.points} pts</span>
            </div>
            
            <div className="mt-4">
               {question.type === 'multiple_choice' && (
                 <div className="space-y-3">
                   {question.options.map(opt => (
                     <label key={opt.id} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                       <input 
                         type="radio" 
                         name={question.id} 
                         value={opt.id}
                         checked={answers[question.id] === opt.id}
                         onChange={(e) => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                         className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300" 
                       />
                       <span className="text-slate-700">{opt.text}</span>
                     </label>
                   ))}
                 </div>
               )}
               
               {question.type === 'true_false' && (
                 <div className="flex space-x-4">
                   {['True', 'False'].map(opt => (
                     <label key={opt} className="flex items-center space-x-2">
                       <input 
                         type="radio" 
                         name={question.id} 
                         value={opt.toLowerCase()}
                         checked={answers[question.id] === opt.toLowerCase()}
                         onChange={(e) => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                         className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300" 
                       />
                       <span className="text-slate-700">{opt}</span>
                     </label>
                   ))}
                 </div>
               )}
               
               {question.type === 'short_answer' && (
                 <textarea
                   rows={3}
                   value={answers[question.id] || ''}
                   onChange={(e) => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                   className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-md"
                   placeholder="Type your answer here..."
                 />
               )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:pl-64 flex justify-between items-center z-10">
        <span className="text-sm font-medium text-slate-500">
          Answered {Object.keys(answers).length} of {assessment.questions.length} questions
        </span>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || Object.keys(answers).length < assessment.questions.length}
          className="py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
        </button>
      </div>
    </div>
  );
}
